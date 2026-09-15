-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EDITOR',
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_admins" ("createdAt", "email", "id", "passwordHash", "role") SELECT "createdAt", "email", "id", "passwordHash", "role" FROM "admins";
DROP TABLE "admins";
ALTER TABLE "new_admins" RENAME TO "admins";
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_users" ("createdAt", "email", "id", "name", "passwordHash") SELECT "createdAt", "email", "id", "name", "passwordHash" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
