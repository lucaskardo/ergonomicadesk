import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260322181236 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "nmi_payment_attempt_log" ("id" text not null, "intent_id" text not null, "action" text not null, "request_amount" text not null, "response_code" text not null, "response_text" text not null, "nmi_transaction_id" text null, "avs_response" text null, "cvv_response" text null, "three_ds_eci" text null, "raw_response" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "nmi_payment_attempt_log_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_nmi_payment_attempt_log_deleted_at" ON "nmi_payment_attempt_log" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "nmi_payment_intent" ("id" text not null, "cart_id" text not null, "session_id" text not null, "amount_cents" integer not null, "currency_code" text not null, "idempotency_key" text not null, "status" text not null, "nmi_transaction_id" text null, "nmi_auth_code" text null, "nmi_response_code" text null, "charged_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "nmi_payment_intent_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_nmi_payment_intent_deleted_at" ON "nmi_payment_intent" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "nmi_payment_attempt_log" cascade;`);

    this.addSql(`drop table if exists "nmi_payment_intent" cascade;`);
  }

}
