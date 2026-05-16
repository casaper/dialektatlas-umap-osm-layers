/*
  Warnings:

  - You are about to drop the column `wordId` on the `SurveyRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wordKey,ageGroup,siteCode]` on the table `SurveyRecord` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[audioUrl]` on the table `Word` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `wordKey` to the `SurveyRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SurveyRecord" DROP CONSTRAINT "SurveyRecord_wordId_fkey";

-- DropIndex
DROP INDEX "SurveyRecord_wordId_ageGroup_siteCode_key";

-- DropIndex
DROP INDEX "SurveyRecord_wordId_idx";

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "canton" TEXT;

-- AlterTable
ALTER TABLE "SurveyRecord" DROP COLUMN "wordId",
ADD COLUMN     "wordKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "audioUrl" TEXT;

-- CreateTable
CREATE TABLE "WordAudios" (
    "audioUrl" TEXT NOT NULL,
    "title" TEXT,
    "pageNumber" INTEGER,

    CONSTRAINT "WordAudios_pkey" PRIMARY KEY ("audioUrl")
);

-- CreateTable
CREATE TABLE "SiteWordAudio" (
    "id" SERIAL NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "wordKey" TEXT,
    "chWord" TEXT NOT NULL,
    "townName" TEXT NOT NULL,
    "canton" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "audioFileUrl" TEXT,

    CONSTRAINT "SiteWordAudio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteWordAudio_audioUrl_townName_canton_ageGroup_key" ON "SiteWordAudio"("audioUrl", "townName", "canton", "ageGroup");

-- CreateIndex
CREATE INDEX "SurveyRecord_wordKey_idx" ON "SurveyRecord"("wordKey");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyRecord_wordKey_ageGroup_siteCode_key" ON "SurveyRecord"("wordKey", "ageGroup", "siteCode");

-- CreateIndex
CREATE UNIQUE INDEX "Word_audioUrl_key" ON "Word"("audioUrl");

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_audioUrl_fkey" FOREIGN KEY ("audioUrl") REFERENCES "WordAudios"("audioUrl") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteWordAudio" ADD CONSTRAINT "SiteWordAudio_audioUrl_fkey" FOREIGN KEY ("audioUrl") REFERENCES "WordAudios"("audioUrl") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteWordAudio" ADD CONSTRAINT "SiteWordAudio_wordKey_fkey" FOREIGN KEY ("wordKey") REFERENCES "Word"("wordKey") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyRecord" ADD CONSTRAINT "SurveyRecord_wordKey_fkey" FOREIGN KEY ("wordKey") REFERENCES "Word"("wordKey") ON DELETE CASCADE ON UPDATE CASCADE;
