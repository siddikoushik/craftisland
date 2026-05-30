-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "scentPreference" TEXT DEFAULT 'Woodsy & Earthy',
    "selectedMood" TEXT DEFAULT 'Calm',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "moods" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "variants" TEXT NOT NULL,
    "notesTop" TEXT NOT NULL,
    "notesHeart" TEXT NOT NULL,
    "notesBase" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 5.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "bestseller" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "items" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentDetails" TEXT,
    "date" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HomepageSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'active',
    "heroImage" TEXT NOT NULL,
    "heroTagline" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "heroPrimaryBtnText" TEXT NOT NULL,
    "heroSecondaryBtnText" TEXT NOT NULL,
    "prop1Title" TEXT NOT NULL,
    "prop1Desc" TEXT NOT NULL,
    "prop1Icon" TEXT NOT NULL,
    "prop2Title" TEXT NOT NULL,
    "prop2Desc" TEXT NOT NULL,
    "prop2Icon" TEXT NOT NULL,
    "prop3Title" TEXT NOT NULL,
    "prop3Desc" TEXT NOT NULL,
    "prop3Icon" TEXT NOT NULL,
    "prop4Title" TEXT NOT NULL,
    "prop4Desc" TEXT NOT NULL,
    "prop4Icon" TEXT NOT NULL,
    "craftImage" TEXT NOT NULL,
    "craftTagline" TEXT NOT NULL,
    "craftTitle" TEXT NOT NULL,
    "craftDescription" TEXT NOT NULL,
    "craftBullets" TEXT NOT NULL,
    "craftBtnText" TEXT NOT NULL,
    "scentHeading" TEXT NOT NULL,
    "scentSubtitle" TEXT NOT NULL,
    "scentFloralDesc" TEXT NOT NULL,
    "scentWoodyDesc" TEXT NOT NULL,
    "scentGourmandDesc" TEXT NOT NULL,
    "scentFreshDesc" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
