/*
  Warnings:

  - The `ageGroup` column on the `SiteWordAudio` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SiteWordAudio" ADD COLUMN     "siteCode" TEXT,
DROP COLUMN "ageGroup",
ADD COLUMN     "ageGroup" "AgeGroup";

-- CreateIndex
CREATE UNIQUE INDEX "SiteWordAudio_audioUrl_townName_canton_ageGroup_key" ON "SiteWordAudio"("audioUrl", "townName", "canton", "ageGroup");

-- AddForeignKey
ALTER TABLE "SiteWordAudio" ADD CONSTRAINT "SiteWordAudio_wordKey_ageGroup_siteCode_fkey" FOREIGN KEY ("wordKey", "ageGroup", "siteCode") REFERENCES "SurveyRecord"("wordKey", "ageGroup", "siteCode") ON DELETE SET NULL ON UPDATE CASCADE;
