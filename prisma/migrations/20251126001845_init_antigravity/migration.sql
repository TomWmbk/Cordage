/*
  Warnings:

  - You are about to drop the column `completionDate` on the `RacketJob` table. All the data in the column will be lost.
  - You are about to drop the column `creationDate` on the `RacketJob` table. All the data in the column will be lost.
  - You are about to drop the column `isDelivered` on the `RacketJob` table. All the data in the column will be lost.
  - You are about to alter the column `tension` on the `RacketJob` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN "lastName" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RacketJob" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "tension" REAL NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isReturned" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "RacketJob_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RacketJob" ("customerId", "id", "isDone", "isPaid", "price", "tension") SELECT "customerId", "id", "isDone", "isPaid", "price", "tension" FROM "RacketJob";
DROP TABLE "RacketJob";
ALTER TABLE "new_RacketJob" RENAME TO "RacketJob";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Customer_lastName_idx" ON "Customer"("lastName");
