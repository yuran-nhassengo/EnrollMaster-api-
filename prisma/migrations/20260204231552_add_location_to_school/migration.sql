/*
  Warnings:

  - Added the required column `location` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_School" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "contact" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_School" ("createdAt", "id", "name") SELECT "createdAt", "id", "name" FROM "School";
DROP TABLE "School";
ALTER TABLE "new_School" RENAME TO "School";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
