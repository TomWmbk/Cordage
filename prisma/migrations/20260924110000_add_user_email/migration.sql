-- Keep email optional for existing accounts; all new registrations require it.
ALTER TABLE "User" ADD COLUMN "email" TEXT;

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
