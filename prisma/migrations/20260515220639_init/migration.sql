-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('jung', 'alt', 'sds', 'older');

-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "wordKey" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "csvJung" TEXT,
    "csvAlt" TEXT,
    "csvSds" TEXT,
    "csvOlder" TEXT,
    "pdfLabel" TEXT,
    "pdfStartPage" INTEGER,
    "sdsPage" INTEGER,
    "altJungPage" INTEGER,
    "textLabel" TEXT,
    "qrUrl" TEXT,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "siteCode" TEXT NOT NULL,
    "townName" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("siteCode")
);

-- CreateTable
CREATE TABLE "SurveyRecord" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "ageGroup" "AgeGroup" NOT NULL,
    "siteCode" TEXT NOT NULL,
    "secondarySiteCode" TEXT,
    "domVar" TEXT NOT NULL,
    "variants" TEXT[],
    "hexcode1" TEXT NOT NULL,
    "hexcodes" TEXT[],
    "nvar" TEXT NOT NULL,
    "different" BOOLEAN,

    CONSTRAINT "SurveyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_wordKey_key" ON "Word"("wordKey");

-- CreateIndex
CREATE INDEX "SurveyRecord_wordId_idx" ON "SurveyRecord"("wordId");

-- CreateIndex
CREATE INDEX "SurveyRecord_siteCode_idx" ON "SurveyRecord"("siteCode");

-- CreateIndex
CREATE INDEX "SurveyRecord_ageGroup_idx" ON "SurveyRecord"("ageGroup");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyRecord_wordId_ageGroup_siteCode_key" ON "SurveyRecord"("wordId", "ageGroup", "siteCode");

-- AddForeignKey
ALTER TABLE "SurveyRecord" ADD CONSTRAINT "SurveyRecord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyRecord" ADD CONSTRAINT "SurveyRecord_siteCode_fkey" FOREIGN KEY ("siteCode") REFERENCES "Site"("siteCode") ON DELETE RESTRICT ON UPDATE CASCADE;
