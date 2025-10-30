/*
  Warnings:

  - Added the required column `orderDate` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderReference` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productPrice` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "orderDate" TEXT NOT NULL,
ADD COLUMN     "orderReference" TEXT NOT NULL,
ADD COLUMN     "productCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "productPrice" INTEGER NOT NULL;
