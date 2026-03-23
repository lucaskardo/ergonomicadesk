import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260323000001 extends Migration {
  override async up(): Promise<void> {
    // Remove duplicate idempotency_key rows, keeping the best status (charged > charged_unreconciled > failed > pending)
    this.addSql(`
      DELETE FROM "nmi_payment_intent"
      WHERE id IN (
        SELECT id FROM (
          SELECT id,
            ROW_NUMBER() OVER (
              PARTITION BY idempotency_key
              ORDER BY
                CASE status
                  WHEN 'charged' THEN 1
                  WHEN 'charged_unreconciled' THEN 2
                  WHEN 'failed' THEN 3
                  ELSE 4
                END,
                created_at DESC
            ) AS rn
          FROM "nmi_payment_intent"
          WHERE deleted_at IS NULL
        ) ranked
        WHERE rn > 1
      );
    `)
    // Unique constraint prevents duplicate idempotency keys
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_nmi_payment_intent_idempotency_key_unique" ON "nmi_payment_intent" ("idempotency_key") WHERE deleted_at IS NULL;`)
    // Index for fast lookups by cart_id
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_nmi_payment_intent_cart_id" ON "nmi_payment_intent" ("cart_id") WHERE deleted_at IS NULL;`)
    // Index for fast lookups by session_id
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_nmi_payment_intent_session_id" ON "nmi_payment_intent" ("session_id") WHERE deleted_at IS NULL;`)
  }

  override async down(): Promise<void> {
    this.addSql(`DROP INDEX IF EXISTS "IDX_nmi_payment_intent_idempotency_key_unique";`)
    this.addSql(`DROP INDEX IF EXISTS "IDX_nmi_payment_intent_cart_id";`)
    this.addSql(`DROP INDEX IF EXISTS "IDX_nmi_payment_intent_session_id";`)
  }
}
