import { describe, it, expect } from "vitest"
import {
  getSessionPages,
  getViewedProducts,
  getSessionId,
  getLeadId,
  getMetaCookies,
} from "../utm"

// Tests run in Node.js (environment: "node"). Functions that call document.cookie
// without an SSR guard cannot be tested here — they require a browser env.
// These tests confirm the SSR guards work correctly (return safe defaults).

describe("UTM getters — SSR safety (document is undefined)", () => {
  it("getSessionPages returns '0' when document is undefined", () => {
    expect(getSessionPages()).toBe("0")
  })

  it("getViewedProducts returns [] when document is undefined", () => {
    expect(getViewedProducts()).toEqual([])
  })

  it("getSessionId returns null when document is undefined", () => {
    expect(getSessionId()).toBeNull()
  })

  it("getLeadId returns null when document is undefined", () => {
    expect(getLeadId()).toBeNull()
  })

  it("getMetaCookies returns {fbp: null, fbc: null} when document is undefined", () => {
    expect(getMetaCookies()).toEqual({ fbp: null, fbc: null })
  })
})
