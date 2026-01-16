-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tariff" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "minUsage" INTEGER NOT NULL,
    "maxUsage" INTEGER,
    "rate" DOUBLE PRECISION NOT NULL,
    "fixedFee" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Tariff_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tariff" ADD CONSTRAINT "Tariff_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
