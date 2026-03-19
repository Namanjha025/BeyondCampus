/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `University` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STUDENT');

-- CreateEnum
CREATE TYPE "KnowledgeDocCategory" AS ENUM ('ADMISSIONS', 'COURSES', 'CAMPUS_LIFE', 'SCHOLARSHIPS', 'STAFF');

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "applyUrl" TEXT,
ADD COLUMN     "embeddedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "category" TEXT,
ADD COLUMN     "counselorName" TEXT,
ADD COLUMN     "counselorTitle" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "logoColor" TEXT,
ADD COLUMN     "qsRanking" TEXT,
ADD COLUMN     "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT';

-- CreateTable
CREATE TABLE "UniversityKnowledgeDoc" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "category" "KnowledgeDocCategory" NOT NULL,
    "content" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "embeddedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniversityKnowledgeDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scholarship" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT,
    "description" TEXT,
    "deadline" TIMESTAMP(3),
    "eligibility" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UniversityKnowledgeDoc_universityId_idx" ON "UniversityKnowledgeDoc"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityKnowledgeDoc_universityId_category_key" ON "UniversityKnowledgeDoc"("universityId", "category");

-- CreateIndex
CREATE INDEX "Scholarship_universityId_idx" ON "Scholarship"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "University_name_key" ON "University"("name");

-- AddForeignKey
ALTER TABLE "UniversityKnowledgeDoc" ADD CONSTRAINT "UniversityKnowledgeDoc_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scholarship" ADD CONSTRAINT "Scholarship_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;
