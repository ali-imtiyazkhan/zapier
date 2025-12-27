-- CreateTable
CREATE TABLE "ZapRunoutbox" (
    "id" TEXT NOT NULL,
    "zaprunId" TEXT NOT NULL,

    CONSTRAINT "ZapRunoutbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZapRunoutbox_zaprunId_key" ON "ZapRunoutbox"("zaprunId");

-- AddForeignKey
ALTER TABLE "ZapRunoutbox" ADD CONSTRAINT "ZapRunoutbox_zaprunId_fkey" FOREIGN KEY ("zaprunId") REFERENCES "ZapRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
