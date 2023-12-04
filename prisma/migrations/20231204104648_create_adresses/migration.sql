-- CreateTable
CREATE TABLE "adresses" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "address_identifier" TEXT NOT NULL,
    "complement" TEXT,

    CONSTRAINT "adresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "adresses_owner_id_key" ON "adresses"("owner_id");

-- AddForeignKey
ALTER TABLE "adresses" ADD CONSTRAINT "adresses_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
