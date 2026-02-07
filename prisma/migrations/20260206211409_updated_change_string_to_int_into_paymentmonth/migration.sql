/*
  Warnings:

  - You are about to alter the column `month` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "penalty" REAL NOT NULL DEFAULT 0,
    "totalPaid" REAL,
    "type" TEXT NOT NULL,
    "month" INTEGER,
    "year" INTEGER,
    "dueDate" DATETIME NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" DATETIME,
    CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "dueDate", "id", "isPaid", "month", "paidAt", "penalty", "studentId", "totalPaid", "type", "year") SELECT "amount", "dueDate", "id", "isPaid", "month", "paidAt", "penalty", "studentId", "totalPaid", "type", "year" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
