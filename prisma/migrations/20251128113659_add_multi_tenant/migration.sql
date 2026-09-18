/*
  Warnings:

  - Added the required column `userId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RacketJob` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "defaultTension" TEXT,
    "defaultPrice" REAL,
    "balance" REAL NOT NULL DEFAULT 0.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Customer" ("id", "userId", "firstName", "sport", "defaultTension", "defaultPrice", "balance", "createdAt") 
SELECT "id", 1, "firstName", "sport", "defaultTension", "defaultPrice", "balance", "createdAt" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE INDEX "Customer_firstName_idx" ON "Customer"("firstName");
CREATE INDEX "Customer_userId_idx" ON "Customer"("userId");
CREATE TABLE "new_RacketJob" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "tension" REAL NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isReturned" BOOLEAN NOT NULL DEFAULT false,
    "cost" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "RacketJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RacketJob_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RacketJob" ("id", "userId", "customerId", "tension", "price", "createdAt", "isDone", "isPaid", "isReturned", "cost") 
SELECT "id", 1, "customerId", "tension", "price", "createdAt", "isDone", "isPaid", "isReturned", "cost" FROM "RacketJob";
DROP TABLE "RacketJob";
ALTER TABLE "new_RacketJob" RENAME TO "RacketJob";
CREATE INDEX "RacketJob_userId_idx" ON "RacketJob"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
