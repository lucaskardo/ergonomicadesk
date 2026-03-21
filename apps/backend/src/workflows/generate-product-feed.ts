import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getProductFeedItemsStep } from "./steps/get-product-feed-items"
import { buildProductFeedXmlStep } from "./steps/build-product-feed-xml"

type Input = {
  currency_code: string
  country_code: string
}

export const generateProductFeedWorkflow = createWorkflow(
  "generate-product-feed",
  (input: Input) => {
    const { items } = getProductFeedItemsStep(input)
    const { xml } = buildProductFeedXmlStep({ items })
    return new WorkflowResponse({ xml })
  }
)
