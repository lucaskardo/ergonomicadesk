import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seedApiKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)

  logger.info("Checking for existing publishable API key...")

  const { data: existingKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "title", "token"],
    filters: { type: "publishable" },
  })

  if (existingKeys.length > 0) {
    const key = existingKeys[0]
    logger.info(`Found existing publishable API key: "${key.title}"`)
    logger.info(`Token: ${key.token}`)
    logger.info(
      `Add to apps/storefront/.env.local:\n  NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${key.token}`
    )
    return
  }

  logger.info("No publishable API key found — creating one...")

  const [defaultSalesChannel] = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  })

  if (!defaultSalesChannel) {
    throw new Error(
      'Default Sales Channel not found. Run the main seed script first: npx medusa exec ./src/scripts/seed.ts'
    )
  }

  const {
    result: [apiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Storefront",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  })

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: apiKey.id,
      add: [defaultSalesChannel.id],
    },
  })

  logger.info(`Created publishable API key: "${apiKey.title}"`)
  logger.info(`Token: ${apiKey.token}`)
  logger.info(
    `Add to apps/storefront/.env.local:\n  NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`
  )
}
