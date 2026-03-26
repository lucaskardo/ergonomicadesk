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
 * Resend Notification Provider — intentional stub.
 *
 * Medusa's notification system calls send() for events like order.placed, but
 * order confirmation emails are sent directly via Resend's REST API in the
 * order-confirmation subscriber (src/subscribers/order-confirmation.ts).
 * That subscriber handles both customer and admin emails with full HTML templates.
 *
 * This stub exists only to satisfy Medusa's provider registration requirement.
 * If Medusa-native notification triggers are needed in the future (e.g.,
 * cart abandonment via workflows), implement send() here using the api_key option.
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
    // Stub — see class comment above. Emails are sent directly in order-confirmation.ts.
    return { id: "stub-noop" }
  }
}

export default ResendNotificationProviderService
