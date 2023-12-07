-- DropForeignKey
ALTER TABLE "list_items" DROP CONSTRAINT "list_items_list_id_fkey";

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
