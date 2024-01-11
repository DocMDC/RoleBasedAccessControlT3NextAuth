/*
  Warnings:

  - You are about to drop the column `node_id` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "login" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user'
);
INSERT INTO "new_User" ("email", "emailVerified", "id", "image", "login", "name", "role") SELECT "email", "emailVerified", "id", "image", "login", "name", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
