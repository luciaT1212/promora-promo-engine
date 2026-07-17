CREATE TYPE "PromoStateType" AS ENUM ('draft','active','paused','expired');
CREATE TYPE "DiscountType" AS ENUM ('fixed','percent','tiered');
CREATE TYPE "OrderStatus" AS ENUM ('draft','cart','pending','paid','cancelled');
CREATE TYPE "OrderType" AS ENUM ('service','product','subscription');

CREATE TABLE "promo_codes" ("id" UUID PRIMARY KEY, "code" TEXT NOT NULL UNIQUE, "type" "DiscountType" NOT NULL, "value" DECIMAL(18,2) NOT NULL, "state" "PromoStateType" NOT NULL, "start_date" TIMESTAMP(3) NOT NULL, "end_date" TIMESTAMP(3) NOT NULL, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL);
CREATE TABLE "promo_rules" ("id" UUID PRIMARY KEY, "promo_code_id" UUID NOT NULL REFERENCES "promo_codes"("id") ON DELETE CASCADE, "rule_type" TEXT NOT NULL, "parameters" JSONB NOT NULL, "is_active" BOOLEAN NOT NULL DEFAULT true, "priority" INTEGER NOT NULL DEFAULT 0, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "tier_configurations" ("id" UUID PRIMARY KEY, "promo_code_id" UUID NOT NULL REFERENCES "promo_codes"("id") ON DELETE CASCADE, "min_orders" INTEGER NOT NULL, "discount_percent" DECIMAL(5,2) NOT NULL, "order_index" INTEGER NOT NULL DEFAULT 0, CONSTRAINT "tier_configurations_promo_code_id_min_orders_key" UNIQUE ("promo_code_id","min_orders"));
CREATE TABLE "buyer_profiles" ("id" UUID PRIMARY KEY, "total_orders" INTEGER NOT NULL DEFAULT 0, "is_first_buyer" BOOLEAN NOT NULL DEFAULT true);
CREATE TABLE "categories" ("id" UUID PRIMARY KEY, "name" TEXT NOT NULL, "parent_id" UUID REFERENCES "categories"("id") ON DELETE SET NULL);
CREATE TABLE "orders" ("id" UUID PRIMARY KEY, "buyer_id" UUID NOT NULL REFERENCES "buyer_profiles"("id") ON DELETE RESTRICT, "category_id" UUID NOT NULL REFERENCES "categories"("id") ON DELETE RESTRICT, "subtotal" DECIMAL(18,2) NOT NULL, "status" "OrderStatus" NOT NULL, "type" "OrderType" NOT NULL, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL);
CREATE TABLE "promo_code_usages" ("id" UUID PRIMARY KEY, "promo_code_id" UUID NOT NULL REFERENCES "promo_codes"("id") ON DELETE RESTRICT, "order_id" UUID NOT NULL REFERENCES "orders"("id") ON DELETE RESTRICT, "buyer_id" UUID NOT NULL REFERENCES "buyer_profiles"("id") ON DELETE RESTRICT, "discount_amount" DECIMAL(18,2) NOT NULL, "is_paid" BOOLEAN NOT NULL, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "promo_code_usages_promo_code_id_order_id_key" UNIQUE ("promo_code_id","order_id"));
CREATE TABLE "restricted_user_mappings" ("id" UUID PRIMARY KEY, "promo_code_id" UUID NOT NULL REFERENCES "promo_codes"("id") ON DELETE CASCADE, "buyer_id" UUID NOT NULL REFERENCES "buyer_profiles"("id") ON DELETE CASCADE, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "restricted_user_mappings_promo_code_id_buyer_id_key" UNIQUE ("promo_code_id","buyer_id"));

CREATE INDEX "promo_rules_promo_code_id_is_active_idx" ON "promo_rules"("promo_code_id","is_active");
CREATE INDEX "promo_code_usages_promo_code_id_is_paid_idx" ON "promo_code_usages"("promo_code_id","is_paid");
CREATE INDEX "promo_code_usages_promo_code_id_buyer_id_is_paid_idx" ON "promo_code_usages"("promo_code_id","buyer_id","is_paid");
CREATE INDEX "orders_buyer_id_status_idx" ON "orders"("buyer_id","status");
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");
