ALTER TABLE "RacketJob" ADD COLUMN "racketModel" TEXT;
ALTER TABLE "RacketJob" ADD COLUMN "materialCost" REAL;
ALTER TABLE "RacketJob" ADD COLUMN "stringReferenceId" INTEGER;
ALTER TABLE "StringReference" ADD COLUMN "reelCost" REAL;
ALTER TABLE "StringReference" ADD COLUMN "jobsPerReel" INTEGER;
CREATE TABLE "RacketBrand" (
 "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 "userId" INTEGER NOT NULL,
 "name" TEXT NOT NULL,
 "key" TEXT NOT NULL,
 CONSTRAINT "RacketBrand_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "RacketBrand_userId_key_key" ON "RacketBrand"("userId", "key");
