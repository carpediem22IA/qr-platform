-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "printedAt" DATETIME
);

-- CreateTable
CREATE TABLE "QrCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qrNumber" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" DATETIME,
    "downloadPath" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    CONSTRAINT "QrCode_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Batch_batchNumber_key" ON "Batch"("batchNumber");

-- CreateIndex
CREATE UNIQUE INDEX "QrCode_qrNumber_key" ON "QrCode"("qrNumber");

-- CreateIndex
CREATE UNIQUE INDEX "QrCode_token_key" ON "QrCode"("token");
