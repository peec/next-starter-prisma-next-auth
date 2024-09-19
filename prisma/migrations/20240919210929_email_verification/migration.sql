-- CreateTable
CREATE TABLE "UserVerificationToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserVerificationToken_token_key" ON "UserVerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UserVerificationToken_userId_key" ON "UserVerificationToken"("userId");

-- AddForeignKey
ALTER TABLE "UserVerificationToken" ADD CONSTRAINT "UserVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
