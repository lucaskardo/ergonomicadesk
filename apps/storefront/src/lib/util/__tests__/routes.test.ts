import { describe, it, expect } from "vitest"
import {
  productPath,
  categoryPath,
  collectionPath,
  blogPath,
  PATHS,
  canonicalUrl,
  productCanonical,
  categoryCanonical,
  collectionCanonical,
  alternateUrls,
  SITE_URL,
} from "../routes"

const BASE = "https://ergonomicadesk.com"

describe("SITE_URL", () => {
  it("defaults to ergonomicadesk.com", () => {
    // env vars are not set in test environment
    expect(SITE_URL).toBe(BASE)
  })
})

describe("productPath", () => {
  it("returns /productos/[handle] without SKU", () => {
    expect(productPath("standing-desk-pro")).toBe("/productos/standing-desk-pro")
  })

  it("returns /productos/[handle]/[sku] with SKU", () => {
    expect(productPath("standing-desk-pro", "SDP-BLK-140")).toBe(
      "/productos/standing-desk-pro/SDP-BLK-140"
    )
  })

  it("handles handles with hyphens and numbers", () => {
    expect(productPath("silla-ergonomica-500", "SE-500-GRY")).toBe(
      "/productos/silla-ergonomica-500/SE-500-GRY"
    )
  })
})

describe("categoryPath", () => {
  it("returns /categorias/[handle]", () => {
    expect(categoryPath("standing-desks")).toBe("/categorias/standing-desks")
    expect(categoryPath("sillas")).toBe("/categorias/sillas")
  })
})

describe("collectionPath", () => {
  it("returns /colecciones/[handle]", () => {
    expect(collectionPath("black-edition")).toBe("/colecciones/black-edition")
  })
})

describe("blogPath", () => {
  it("returns /blog/[slug]", () => {
    expect(blogPath("ergonomia-en-casa")).toBe("/blog/ergonomia-en-casa")
  })
})

describe("PATHS", () => {
  it("contains all static paths", () => {
    expect(PATHS.home).toBe("/")
    expect(PATHS.store).toBe("/store")
    expect(PATHS.cart).toBe("/cart")
    expect(PATHS.faq).toBe("/faq")
    expect(PATHS.returns).toBe("/returns")
    expect(PATHS.warranty).toBe("/warranty")
    expect(PATHS.terms).toBe("/terms")
    expect(PATHS.privacy).toBe("/privacy")
    expect(PATHS.blog).toBe("/blog")
  })
})

describe("canonicalUrl", () => {
  it("builds Spanish canonical (no lang prefix)", () => {
    expect(canonicalUrl("pa", "es", "/productos/desk")).toBe(
      `${BASE}/pa/productos/desk`
    )
  })

  it("builds English canonical (/en prefix)", () => {
    expect(canonicalUrl("pa", "en", "/productos/desk")).toBe(
      `${BASE}/pa/en/productos/desk`
    )
  })

  it("works with root path /", () => {
    expect(canonicalUrl("pa", "es", "/")).toBe(`${BASE}/pa/`)
    expect(canonicalUrl("pa", "en", "/")).toBe(`${BASE}/pa/en/`)
  })
})

describe("productCanonical", () => {
  it("builds canonical product URL for es", () => {
    expect(productCanonical("pa", "es", "standing-desk-pro")).toBe(
      `${BASE}/pa/productos/standing-desk-pro`
    )
  })

  it("builds canonical product URL for en", () => {
    expect(productCanonical("pa", "en", "standing-desk-pro")).toBe(
      `${BASE}/pa/en/productos/standing-desk-pro`
    )
  })
})

describe("categoryCanonical", () => {
  it("builds canonical category URL for es", () => {
    expect(categoryCanonical("pa", "es", "sillas")).toBe(
      `${BASE}/pa/categorias/sillas`
    )
  })

  it("builds canonical category URL for en", () => {
    expect(categoryCanonical("pa", "en", "sillas")).toBe(
      `${BASE}/pa/en/categorias/sillas`
    )
  })
})

describe("collectionCanonical", () => {
  it("builds canonical collection URL for es", () => {
    expect(collectionCanonical("pa", "es", "black-edition")).toBe(
      `${BASE}/pa/colecciones/black-edition`
    )
  })

  it("builds canonical collection URL for en", () => {
    expect(collectionCanonical("pa", "en", "black-edition")).toBe(
      `${BASE}/pa/en/colecciones/black-edition`
    )
  })
})

describe("alternateUrls", () => {
  it("returns es, en, and x-default entries", () => {
    const alts = alternateUrls("pa", "/productos/desk")
    expect(alts.es).toBe(`${BASE}/pa/productos/desk`)
    expect(alts.en).toBe(`${BASE}/pa/en/productos/desk`)
    expect(alts["x-default"]).toBe(`${BASE}/pa/productos/desk`)
  })

  it("x-default equals es", () => {
    const alts = alternateUrls("pa", "/store")
    expect(alts["x-default"]).toBe(alts.es)
  })
})
