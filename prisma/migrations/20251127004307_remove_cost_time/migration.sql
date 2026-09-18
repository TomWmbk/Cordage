/*
  Warnings:

  - You are about to drop the column `lastName` on the `Customer` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "defaultTension" TEXT,
    "defaultPrice" REAL,
    "balance" REAL NOT NULL DEFAULT 0.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Customer" ("balance", "createdAt", "defaultTension", "firstName", "id", "sport") SELECT "balance", "createdAt", "defaultTension", "firstName", "id", "sport" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE INDEX "Customer_firstName_idx" ON "Customer"("firstName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
