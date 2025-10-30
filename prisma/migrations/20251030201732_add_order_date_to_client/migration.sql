/*
  Warnings:

  - Changed the type of `orderDate` on the `Client` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "orderDate",
ADD COLUMN     "orderDate" INTEGER NOT NULL;
