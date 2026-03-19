import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
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
    if (!this.options.api_key || this.options.api_key === "placeholder") {
      return { id: "dev-noop" }
    }
    return { id: "dev-noop" }
  }
}

export default ResendNotificationProviderService
