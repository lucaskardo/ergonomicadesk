import { MedusaService } from "@medusajs/framework/utils"
import DeliveryZone from "./models/delivery-zone"

type CalculatePriceResult = {
  rate: number
  freeShipping: boolean
  includesAssembly: boolean
}

class DeliveryPanamaService extends MedusaService({ DeliveryZone }) {
  /**
   * Calculates shipping cost for a given zone type and cart subtotal (in cents).
   *
   * Pricing rules:
   * - pickup         → always free, no assembly
   * - panama_city    → free if subtotal >= free_threshold, else base_rate; includes assembly
   * - province       → always base_rate, no assembly
   * - international  → always base_rate, no assembly
   */
  async calculatePrice(
    zoneType: string,
    subtotalCents: number
  ): Promise<CalculatePriceResult> {
    const [zone] = await this.listDeliveryZones({ zone_type: zoneType, active: true })

    if (!zone) {
      throw new Error(`No active delivery zone found for type: ${zoneType}`)
    }

    if (zoneType === "pickup") {
      return { rate: 0, freeShipping: true, includesAssembly: false }
    }

    if (zoneType === "panama_city") {
      const qualifiesForFree =
        zone.free_threshold != null && subtotalCents >= zone.free_threshold
      return {
        rate: qualifiesForFree ? 0 : zone.base_rate,
        freeShipping: qualifiesForFree,
        includesAssembly: zone.includes_assembly,
      }
    }

    // province | international
    return {
      rate: zone.base_rate,
      freeShipping: false,
      includesAssembly: zone.includes_assembly,
    }
  }
}

export default DeliveryPanamaService
