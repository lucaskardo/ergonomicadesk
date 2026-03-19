import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260319022814 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "delivery_zone" ("id" text not null, "name" text not null, "zone_type" text check ("zone_type" in ('pickup', 'panama_city', 'province', 'international')) not null, "base_rate" integer not null default 0, "free_threshold" integer null, "includes_assembly" boolean not null default false, "active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "delivery_zone_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_delivery_zone_deleted_at" ON "delivery_zone" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "delivery_zone" cascade;`);
  }

}
