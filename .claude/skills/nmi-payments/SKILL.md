---
name: nmi-payments
description: Use when working on payment integration, checkout flow, NMI charge, payment security, or any file in src/modules/checkout/ or apps/backend/src/modules/nmi-*
---

## NMI Integration
- Package: @nmipayments/nmi-pay-react
- Use onChange callback (NOT onPay) for 3DS flow
- Amount: STRING "299.00" not number — NMI rejects numeric amounts
- Backend POST to transact.php: application/x-www-form-urlencoded (NOT JSON)
- Response: key=value pairs — parse with URLSearchParams, not JSON.parse
- After failed payment: call resetFields() on NmiPayments ref before retry

## Checkout flow
- Steps: Dirección → Entrega → Pago → Order Confirmed (NO Review step)
- Card tokenization happens in Payment step
- Charge fires on "Realizar Pedido" click
- Payment provider fetch: ALWAYS cache: "no-store" — silently breaks checkout otherwise

## Backend modules
- nmi-payment: src/modules/nmi-payment/ — payment module registration
- nmi-provider: src/modules/nmi-provider/ — provider implementation
- API routes: /store/custom/nmi-charge (POST), /admin/custom/nmi-payment-info (GET)

## Security
- Rate limiter: Redis-backed when REDIS_URL available, in-memory fallback
- Reconciliation: hourly subscriber checks for unreconciled charges
- Turnstile: fails closed in production, validates hostname

## Gotchas
- NMI SDK requires stable visible DOM at mount — card fields MUST NOT be in an unmounted step
- Eliminating the Review step solved 10+ failed integration attempts
- The payment-providers list fetch MUST use cache: "no-store" or checkout silently breaks
