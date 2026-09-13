-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "farm_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "systemType" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "farm_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "registered_crops" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cropName" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "registered_crops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "registeredCropId" TEXT NOT NULL,
    "scheduledDate" DATETIME NOT NULL,
    "repeatRule" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "schedules_registeredCropId_fkey" FOREIGN KEY ("registeredCropId") REFERENCES "registered_crops" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "usage_histories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "registeredCropId" TEXT NOT NULL,
    "appliedDate" DATETIME NOT NULL,
    "dilutionRatio" INTEGER,
    "amountLiters" REAL,
    "memo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "usage_histories_registeredCropId_fkey" FOREIGN KEY ("registeredCropId") REFERENCES "registered_crops" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'ThermaVita Hydro',
    "ingredientSummary" TEXT,
    "filtrationNote" TEXT,
    "phEcStabilityNote" TEXT,
    "imageAssetId" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "guide_contents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cropName" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "dilutionRatio" INTEGER,
    "usageNote" TEXT,
    "mixingSteps" TEXT,
    "ecMin" REAL,
    "ecMax" REAL,
    "phMin" REAL,
    "phMax" REAL,
    "cycleNote" TEXT,
    "sprayMethodNote" TEXT,
    "sprayCycleNote" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "heat_timing_guides" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "notices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EDITOR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "farm_profiles_userId_key" ON "farm_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "guide_contents_cropName_method_key" ON "guide_contents"("cropName", "method");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
