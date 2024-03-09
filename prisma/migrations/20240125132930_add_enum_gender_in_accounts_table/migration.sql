-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MAN', 'WOMAN', 'OTHERS');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "gender" "Gender";
