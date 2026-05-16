/*
  Warnings:

  - A unique constraint covering the columns `[townName,canton]` on the table `Site` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Site_townName_canton_key" ON "Site"("townName", "canton");
