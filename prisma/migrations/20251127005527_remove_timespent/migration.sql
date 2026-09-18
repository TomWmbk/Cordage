/*
  Warnings:

  - You are about to drop the column `timeSpent` on the `RacketJob` table. All the data in the column will be lost.

*/
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
    "cost" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "RacketJob_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RacketJob" ("cost", "createdAt", "customerId", "id", "isDone", "isPaid", "isReturned", "price", "tension") SELECT "cost", "createdAt", "customerId", "id", "isDone", "isPaid", "isReturned", "price", "tension" FROM "RacketJob";
DROP TABLE "RacketJob";
ALTER TABLE "new_RacketJob" RENAME TO "RacketJob";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
