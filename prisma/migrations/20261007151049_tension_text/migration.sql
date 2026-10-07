-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RacketJob" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "tension" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isReturned" BOOLEAN NOT NULL DEFAULT false,
    "cost" REAL NOT NULL DEFAULT 0,
    "stringName" TEXT,
    "stringSource" TEXT NOT NULL DEFAULT 'shop',
    CONSTRAINT "RacketJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RacketJob_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RacketJob" ("cost", "createdAt", "customerId", "id", "isDone", "isPaid", "isReturned", "price", "stringName", "stringSource", "tension", "userId") SELECT "cost", "createdAt", "customerId", "id", "isDone", "isPaid", "isReturned", "price", "stringName", "stringSource", CASE WHEN "tension" = CAST("tension" AS INTEGER) THEN CAST(CAST("tension" AS INTEGER) AS TEXT) ELSE CAST("tension" AS TEXT) END, "userId" FROM "RacketJob";
DROP TABLE "RacketJob";
ALTER TABLE "new_RacketJob" RENAME TO "RacketJob";
CREATE INDEX "RacketJob_userId_idx" ON "RacketJob"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
