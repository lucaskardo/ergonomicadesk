---
name: medusa-backend
description: Use when working on the Medusa backend — workflows, modules, API routes, subscribers, or any file in apps/backend/
---

## Medusa v2 patterns (MUST follow)
- Workflows: createStep + createWorkflow from @medusajs/framework/workflows-sdk
- Data in steps: resolve "query" from container → query.graph()
- API routes: /store/* = x-publishable-api-key, /admin/* = auth, /custom/* = public
- Module names: underscores not hyphens
- Node.js MUST be v20 LTS

## Existing custom modules
- delivery-panama: shipping rates for Panama regions
- nmi-payment: NMI payment module registration
- nmi-provider: NMI payment provider implementation
- rbac: role-based access control middleware
- resend: email sending via Resend API

## Existing workflows
- generate-product-feed: 2 steps (get items → build XML)

## Existing subscribers
- indexnow.ts: pings search engines on product/page changes
- meta-capi.ts: fires Meta Conversion API on orders
- order-confirmation.ts: sends confirmation email via Resend

## Existing API routes
- /custom/product-feed (GET): Google/Meta XML feed, public
- /store/custom/nmi-charge (POST): process NMI payment
- /admin/custom/nmi-payment-info (GET): payment admin info
- /admin/custom/payment-attempts (GET): payment attempts log

## Gotchas
- Payment providers fetch: ALWAYS cache: "no-store"
- Cart metadata: set BEFORE cart.complete — copies to order.metadata
- RBAC: built-in roles do NOT enforce access — custom middleware required
- Prices in CENTS (29900 = $299.00)
- Meilisearch: registered as plugin in medusa-config.ts (not module)
