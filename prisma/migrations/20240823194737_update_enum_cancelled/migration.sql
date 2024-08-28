/*
  Warnings:

  - The values [CACELLED] on the enum `OrderEventStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderEventStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');
ALTER TABLE "order_events" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderEventStatus_new" USING ("status"::text::"OrderEventStatus_new");
ALTER TABLE "order_events" ALTER COLUMN "status" TYPE "OrderEventStatus_new" USING ("status"::text::"OrderEventStatus_new");
ALTER TYPE "OrderEventStatus" RENAME TO "OrderEventStatus_old";
ALTER TYPE "OrderEventStatus_new" RENAME TO "OrderEventStatus";
DROP TYPE "OrderEventStatus_old";
ALTER TABLE "order_events" ALTER COLUMN "status" SET DEFAULT 'PENDING';
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
