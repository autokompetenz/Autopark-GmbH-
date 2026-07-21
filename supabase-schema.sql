-- Autopark GmbH — Supabase Schema
-- Run this in Supabase SQL Editor if Prisma migrate fails

DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('CLIENT', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "FuelType" AS ENUM ('Essence', 'Diesel', 'Electrique', 'Hybride');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "Transmission" AS ENUM ('Manuelle', 'Automatique');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "Category" AS ENUM ('Berline', 'SUV', 'Citadine', 'Break', 'Coupe', 'Monospace', 'Utilitaire', '4x4');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentType" AS ENUM ('full', 'deposit', 'monthly');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "User" (
  "id"            SERIAL PRIMARY KEY,
  "username"      TEXT UNIQUE NOT NULL,
  "email"         TEXT UNIQUE NOT NULL,
  "password"      TEXT NOT NULL,
  "firstName"     TEXT NOT NULL,
  "lastName"      TEXT NOT NULL,
  "phone"         TEXT,
  "address"       TEXT,
  "monthlySalary" FLOAT,
  "role"          "Role" DEFAULT 'CLIENT',
  "emailVerified" BOOLEAN DEFAULT false,
  "createdAt"     TIMESTAMP DEFAULT NOW(),
  "updatedAt"     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Car" (
  "id"             SERIAL PRIMARY KEY,
  "make"           TEXT NOT NULL,
  "model"          TEXT NOT NULL,
  "year"           INT NOT NULL,
  "price"          FLOAT NOT NULL,
  "stock"          INT DEFAULT 1,
  "description"    TEXT,
  "fuelType"       "FuelType" NOT NULL,
  "transmission"   "Transmission" NOT NULL,
  "mileage"        INT DEFAULT 0,
  "color"          TEXT,
  "power"          INT,
  "category"       "Category" NOT NULL,
  "imageUrl"       TEXT,
  "imageUrl2"      TEXT,
  "imageUrl3"      TEXT,
  "imageUrl4"      TEXT,
  "imageUrl5"      TEXT,
  "imageUrl6"      TEXT,
  "imageUrl7"      TEXT,
  "imageUrl8"      TEXT,
  "imageUrl9"      TEXT,
  "imageUrl10"     TEXT,
  "imageUrl11"     TEXT,
  "imageUrl12"     TEXT,
  "imageUrl13"     TEXT,
  "imageUrl14"     TEXT,
  "imageUrl15"     TEXT,
  "imageUrl16"     TEXT,
  "imageUrl17"     TEXT,
  "imageUrl18"     TEXT,
  "imageUrl19"     TEXT,
  "imageUrl20"     TEXT,
  "minSalary"      FLOAT,
  "monthlyPayment" FLOAT,
  "featured"       BOOLEAN DEFAULT false,
  "promotional"    BOOLEAN DEFAULT false,
  "isActive"       BOOLEAN DEFAULT true,
  "createdAt"      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Order" (
  "id"              SERIAL PRIMARY KEY,
  "orderNumber"     TEXT UNIQUE NOT NULL,
  "userId"          INT NOT NULL REFERENCES "User"("id"),
  "totalPrice"      FLOAT NOT NULL,
  "paymentType"     "PaymentType" NOT NULL,
  "depositAmount"   FLOAT,
  "monthlyAmount"   FLOAT,
  "monthlyDuration" INT,
  "discountAmount"  FLOAT,
  "status"          "OrderStatus" DEFAULT 'pending',
  "notes"           TEXT,
  "shippingAddress" TEXT,
  "createdAt"       TIMESTAMP DEFAULT NOW(),
  "updatedAt"       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id"        SERIAL PRIMARY KEY,
  "orderId"   INT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "carId"     INT NOT NULL REFERENCES "Car"("id"),
  "quantity"  INT DEFAULT 1,
  "unitPrice" FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS "OrderTracking" (
  "id"        SERIAL PRIMARY KEY,
  "orderId"   INT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "status"    "OrderStatus" NOT NULL,
  "comment"   TEXT,
  "updatedBy" INT REFERENCES "User"("id"),
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Cart" (
  "id"          SERIAL PRIMARY KEY,
  "userId"      INT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "carId"       INT NOT NULL REFERENCES "Car"("id"),
  "quantity"    INT DEFAULT 1,
  "paymentType" "PaymentType" DEFAULT 'full',
  "createdAt"   TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "carId")
);

-- Prisma migrations table (required)
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id"                  VARCHAR(36) PRIMARY KEY,
  "checksum"            VARCHAR(64) NOT NULL,
  "finished_at"         TIMESTAMP,
  "migration_name"      VARCHAR(255) NOT NULL,
  "logs"                TEXT,
  "rolled_back_at"      TIMESTAMP,
  "started_at"          TIMESTAMP DEFAULT NOW(),
  "applied_steps_count" INT DEFAULT 0
);

-- Admin account
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO "User" (
  "username", "email", "password", "firstName", "lastName",
  "phone", "role", "emailVerified", "createdAt", "updatedAt"
) VALUES (
  'admin',
  'admin@autopark-gmbh.com',
  crypt('Autopark2024!', gen_salt('bf', 12)),
  'Ronny',
  'Reinsberger',
  '+49 174 523 29 45',
  'ADMIN',
  true,
  NOW(),
  NOW()
) ON CONFLICT ("email") DO NOTHING;

-- Auto-update "updatedAt" on User and Order
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_updated ON "User";
CREATE TRIGGER trg_user_updated
  BEFORE UPDATE ON "User"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_order_updated ON "Order";
CREATE TRIGGER trg_order_updated
  BEFORE UPDATE ON "Order"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
