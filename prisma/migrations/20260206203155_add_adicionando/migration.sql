-- CreateTable
CREATE TABLE "CoursePriceRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subjectCount" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "courseId" TEXT NOT NULL,
    CONSTRAINT "CoursePriceRule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Enrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "subjectCount" INTEGER NOT NULL DEFAULT 1,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Enrollment" ("courseId", "createdAt", "id", "startDate", "status", "studentId") SELECT "courseId", "createdAt", "id", "startDate", "status", "studentId" FROM "Enrollment";
DROP TABLE "Enrollment";
ALTER TABLE "new_Enrollment" RENAME TO "Enrollment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
