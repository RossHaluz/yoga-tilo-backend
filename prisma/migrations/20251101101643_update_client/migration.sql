/*
  Warnings:

  - A unique constraint covering the columns `[orderReference]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client_orderReference_key" ON "Client"("orderReference");
