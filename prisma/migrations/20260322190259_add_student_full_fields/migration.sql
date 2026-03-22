/*
  Warnings:

  - A unique constraint covering the columns `[biNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN "address" TEXT;
ALTER TABLE "Student" ADD COLUMN "biNumber" TEXT;
ALTER TABLE "Student" ADD COLUMN "birthDate" TEXT;
ALTER TABLE "Student" ADD COLUMN "classLevel" TEXT;
ALTER TABLE "Student" ADD COLUMN "fatherName" TEXT;
ALTER TABLE "Student" ADD COLUMN "gender" TEXT;
ALTER TABLE "Student" ADD COLUMN "guardianName" TEXT;
ALTER TABLE "Student" ADD COLUMN "guardianPhone" TEXT;
ALTER TABLE "Student" ADD COLUMN "issuePlace" TEXT;
ALTER TABLE "Student" ADD COLUMN "motherName" TEXT;
ALTER TABLE "Student" ADD COLUMN "previousSchool" TEXT;
ALTER TABLE "Student" ADD COLUMN "validity" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Student_biNumber_key" ON "Student"("biNumber");
