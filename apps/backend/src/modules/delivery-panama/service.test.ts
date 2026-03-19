import DeliveryPanamaService from "./service"

/**
 * Unit tests for DeliveryPanamaService.calculatePrice.
 *
 * We use Object.create to bypass the Medusa container constructor and provide
 * a stub listDeliveryZones that returns a pre-configured zone.
 */

type ZoneStub = {
  id: string
  name: string
  zone_type: string
  base_rate: number
  free_threshold: number | null
  includes_assembly: boolean
  active: boolean
}

function makeService(zone: ZoneStub) {
  const svc = Object.create(DeliveryPanamaService.prototype) as DeliveryPanamaService
  ;(svc as any).listDeliveryZones = jest.fn().mockResolvedValue([zone])
  return svc
}

describe("DeliveryPanamaService.calculatePrice", () => {
  it("pickup zone → rate 0, freeShipping true, assembly false", async () => {
    const svc = makeService({
      id: "zone_1",
      name: "Retiro en tienda",
      zone_type: "pickup",
      base_rate: 0,
      free_threshold: null,
      includes_assembly: false,
      active: true,
    })

    const result = await svc.calculatePrice("pickup", 5000)

    expect(result.rate).toBe(0)
    expect(result.freeShipping).toBe(true)
    expect(result.includesAssembly).toBe(false)
  })

  it("panama_city + subtotal $150 → free shipping, assembly true", async () => {
    const svc = makeService({
      id: "zone_2",
      name: "Ciudad de Panamá",
      zone_type: "panama_city",
      base_rate: 1500,
      free_threshold: 10000,
      includes_assembly: true,
      active: true,
    })

    const result = await svc.calculatePrice("panama_city", 15000)

    expect(result.rate).toBe(0)
    expect(result.freeShipping).toBe(true)
    expect(result.includesAssembly).toBe(true)
  })

  it("panama_city + subtotal $50 → base_rate charged, no free shipping", async () => {
    const svc = makeService({
      id: "zone_2",
      name: "Ciudad de Panamá",
      zone_type: "panama_city",
      base_rate: 1500,
      free_threshold: 10000,
      includes_assembly: true,
      active: true,
    })

    const result = await svc.calculatePrice("panama_city", 5000)

    expect(result.rate).toBe(1500)
    expect(result.freeShipping).toBe(false)
    expect(result.includesAssembly).toBe(true)
  })

  it("province zone → base_rate, no free shipping, no assembly", async () => {
    const svc = makeService({
      id: "zone_3",
      name: "Provincias centrales",
      zone_type: "province",
      base_rate: 3500,
      free_threshold: null,
      includes_assembly: false,
      active: true,
    })

    const result = await svc.calculatePrice("province", 50000)

    expect(result.rate).toBe(3500)
    expect(result.freeShipping).toBe(false)
    expect(result.includesAssembly).toBe(false)
  })
})
