/*
  Warnings:

  - You are about to drop the column `price` on the `Course` table. All the data in the column will be lost.
  - Added the required column `durationMonths` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyPrice` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationFee` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "monthlyPrice" REAL NOT NULL,
    "registrationFee" REAL NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "schoolId" TEXT NOT NULL,
    CONSTRAINT "Course_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Course" ("id", "name", "schoolId") SELECT "id", "name", "schoolId" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
