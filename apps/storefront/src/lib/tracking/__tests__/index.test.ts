import { describe, it, expect } from "vitest"
import { getItemId, getPurchaseEventId } from "../index"

// Only test pure functions that don't depend on browser APIs (window/document).
// Functions that push to window.dataLayer are tested via E2E / GTM Preview.

describe("getItemId", () => {
  it("returns variant.sku (highest priority)", () => {
    expect(
      getItemId({ variant: { sku: "SKU-001", id: "var_1" }, variant_id: "vid_1", product_id: "pid_1", id: "id_1" })
    ).toBe("SKU-001")
  })

  it("falls back to variant.id when sku is missing", () => {
    expect(
      getItemId({ variant: { id: "var_1" }, variant_id: "vid_1", product_id: "pid_1" })
    ).toBe("var_1")
  })

  it("falls back to variant_id when variant has no sku or id", () => {
    expect(
      getItemId({ variant: {}, variant_id: "vid_1", product_id: "pid_1" })
    ).toBe("vid_1")
  })

  it("falls back to product_id when variant_id is missing", () => {
    expect(getItemId({ product_id: "pid_1", id: "id_1" })).toBe("pid_1")
  })

  it("falls back to id when product_id is missing", () => {
    expect(getItemId({ id: "id_1" })).toBe("id_1")
  })

  it("returns 'unknown' when all fields are missing", () => {
    expect(getItemId({})).toBe("unknown")
  })

  it("returns 'unknown' when variant is null", () => {
    expect(getItemId({ variant: null })).toBe("unknown")
  })

  it("uses variant.sku even when variant_id and product_id are set", () => {
    expect(
      getItemId({ variant: { sku: "BEST-SKU" }, variant_id: "vid", product_id: "pid" })
    ).toBe("BEST-SKU")
  })

  it("handles variant with empty string sku (falsy — falls through to variant.id)", () => {
    expect(
      getItemId({ variant: { sku: "", id: "var_fallback" } })
    ).toBe("var_fallback")
  })
})

describe("getPurchaseEventId", () => {
  it("uses display_id when present", () => {
    expect(getPurchaseEventId({ display_id: 42, id: "order_abc" })).toBe("purchase_42")
  })

  it("falls back to id when display_id is absent", () => {
    expect(getPurchaseEventId({ id: "order_abc" })).toBe("purchase_order_abc")
  })

  it("prefers display_id over id", () => {
    expect(getPurchaseEventId({ display_id: 1, id: "should-not-appear" })).toBe("purchase_1")
  })
})
