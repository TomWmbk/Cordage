-- AddColumn
ALTER TABLE "User" ADD COLUMN "laborPrice" REAL NOT NULL DEFAULT 10;

-- AddColumn
ALTER TABLE "RacketJob" ADD COLUMN "stringSource" TEXT NOT NULL DEFAULT 'shop';
