-- CreateTable
CREATE TABLE "list_participants" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "list_id" TEXT NOT NULL,

    CONSTRAINT "list_participants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "list_participants" ADD CONSTRAINT "list_participants_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_participants" ADD CONSTRAINT "list_participants_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
