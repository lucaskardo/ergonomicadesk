import { createContext } from "react"

// Shared context for Stripe readiness — kept in a separate file so that
// payment-container can import it without pulling in @stripe/stripe-js.
export const StripeContext = createContext(false)
