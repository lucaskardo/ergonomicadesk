import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"

type ResendOptions = {
  api_key: string
  from: string
}

/**
 * Resend Notification Provider
 *
 * Stub implementation — full transactional email logic to be added in
 * a later sprint (cart abandonment, order confirmation, etc.).
 */
class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "notification-resend"

  private options: ResendOptions

  constructor(_: unknown, options: ResendOptions) {
    super()
    this.options = options
  }

  async send(
    _notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    // TODO: implement with Resend SDK
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Resend notification provider is not yet implemented."
    )
  }
}

export default ResendNotificationProviderService
