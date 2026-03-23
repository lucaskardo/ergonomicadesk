import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260323000002 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`ALTER TABLE "nmi_payment_attempt_log" DROP COLUMN IF EXISTS "raw_response";`)
  }

  override async down(): Promise<void> {
    this.addSql(`ALTER TABLE "nmi_payment_attempt_log" ADD COLUMN IF NOT EXISTS "raw_response" text NOT NULL DEFAULT '';`)
  }
}
