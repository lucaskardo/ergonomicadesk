// ============================================================================
// Tipos compartidos — ergonomicadesk monorepo
// Importar: import { PaymentIntentStatus } from '@ergonomicadesk/shared'
// ============================================================================

// --- Pagos (NMI) ---

export enum PaymentIntentStatus {
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  DECLINED = 'declined',
  TIMEOUT = 'timeout',
  ERROR = 'error',
}

export enum PaymentAttemptStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
  ERROR = 'error',
  TIMEOUT = 'timeout',
}

export enum PaymentAttemptType {
  SALE = 'sale',
  AUTH = 'auth',
  CAPTURE = 'capture',
  REFUND = 'refund',
  VOID = 'void',
}

/** Respuesta parseada de NMI Payment API (key=value format) */
export interface NmiTransactionResult {
  response: '1' | '2' | '3' // 1=approved, 2=declined, 3=error
  responsetext: string
  authcode: string
  transactionid: string
  avsresponse: string
  cvvresponse: string
  response_code: string
  type: string
}

/** Datos 3DS que llegan del frontend (NmiThreeDSecure onComplete) */
export interface ThreeDSecureData {
  cardHolderAuth: string
  cavv: string
  directoryServerId: string
  eci: string
  threeDsVersion: string
  xid: string
}

// --- Delivery (Panama) ---

export enum DeliveryZoneType {
  PICKUP = 'pickup',
  PANAMA_CITY = 'panama_city',
  PROVINCE = 'province',
  INTERNATIONAL = 'international',
}

export interface DeliveryQuote {
  zone: DeliveryZoneType
  zoneName: string
  rate: number // en centavos
  freeShipping: boolean
  includesAssembly: boolean
}

// --- RBAC ---

export enum UserRole {
  ADMIN = 'admin',
  SALES_ASSOCIATE = 'sales_associate',
}

export enum PermissionAction {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
}

export interface Permission {
  resource: string
  action: PermissionAction
}

// --- Tracking (PostHog) ---

export enum TrackingEvent {
  PRODUCT_VIEWED = 'product_viewed',
  PRODUCT_ADDED_TO_CART = 'product_added_to_cart',
  CART_VIEWED = 'cart_viewed',
  CHECKOUT_STARTED = 'checkout_started',
  DELIVERY_METHOD_SELECTED = 'delivery_method_selected',
  PAYMENT_INITIATED = 'payment_initiated',
  PAYMENT_SUCCEEDED = 'payment_succeeded',
  PAYMENT_FAILED = 'payment_failed',
  CHECKOUT_ABANDONED = 'checkout_abandoned',
}

export interface LeadAttribution {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  referrer?: string
  landingPage?: string
  device?: string
  gclid?: string
  fbclid?: string
}

// --- QuickBooks Sync ---

export enum QbSyncTrigger {
  WEBHOOK = 'webhook',
  CDC_CATCHUP = 'cdc_catchup',
  MANUAL = 'manual',
}

export enum QbSyncStatus {
  SUCCESS = 'success',
  PARTIAL_FAILURE = 'partial_failure',
  ERROR = 'error',
}

// --- Dead Letter Queue ---

export enum DlqEventStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  EXPIRED = 'expired',
}

// --- Tax (ITBMS Panama) ---

export const ITBMS_RATE = 0.07 // 7%
export const ITBMS_RATE_DISPLAY = '7%'
export const FREE_SHIPPING_THRESHOLD_CENTS = 10000 // $100.00 en centavos
