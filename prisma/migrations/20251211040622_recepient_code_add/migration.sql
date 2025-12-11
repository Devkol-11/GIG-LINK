-- CreateTable
CREATE TABLE "PaymentRecipient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentRecipient_userId_key" ON "PaymentRecipient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentRecipient_code_key" ON "PaymentRecipient"("code");

-- AddForeignKey
ALTER TABLE "PaymentRecipient" ADD CONSTRAINT "PaymentRecipient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
