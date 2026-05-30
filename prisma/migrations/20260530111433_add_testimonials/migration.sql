-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HomepageSettings" (
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
    "scentFreshDesc" TEXT NOT NULL,
    "testimonialHeading" TEXT NOT NULL DEFAULT 'Loved by thousands',
    "testimonialTitle" TEXT NOT NULL DEFAULT 'Over 12,000 five-star reviews',
    "testimonial1Body" TEXT NOT NULL DEFAULT 'Amber Noir is the only candle I buy now. My whole house smells like a luxury hotel.',
    "testimonial1Author" TEXT NOT NULL DEFAULT 'Eleanor M.',
    "testimonial1Location" TEXT NOT NULL DEFAULT 'Verified Buyer',
    "testimonial2Body" TEXT NOT NULL DEFAULT 'The scent throw is unreal — I light one in the living room and can smell it upstairs.',
    "testimonial2Author" TEXT NOT NULL DEFAULT 'James T.',
    "testimonial2Location" TEXT NOT NULL DEFAULT 'Verified Buyer',
    "testimonial3Body" TEXT NOT NULL DEFAULT 'Beautifully made and the vessels are gorgeous. I keep them for plants once they’re done.',
    "testimonial3Author" TEXT NOT NULL DEFAULT 'Sofia R.',
    "testimonial3Location" TEXT NOT NULL DEFAULT 'Verified Buyer'
);
INSERT INTO "new_HomepageSettings" ("craftBtnText", "craftBullets", "craftDescription", "craftImage", "craftTagline", "craftTitle", "heroDescription", "heroImage", "heroPrimaryBtnText", "heroSecondaryBtnText", "heroTagline", "heroTitle", "id", "prop1Desc", "prop1Icon", "prop1Title", "prop2Desc", "prop2Icon", "prop2Title", "prop3Desc", "prop3Icon", "prop3Title", "prop4Desc", "prop4Icon", "prop4Title", "scentFloralDesc", "scentFreshDesc", "scentGourmandDesc", "scentHeading", "scentSubtitle", "scentWoodyDesc") SELECT "craftBtnText", "craftBullets", "craftDescription", "craftImage", "craftTagline", "craftTitle", "heroDescription", "heroImage", "heroPrimaryBtnText", "heroSecondaryBtnText", "heroTagline", "heroTitle", "id", "prop1Desc", "prop1Icon", "prop1Title", "prop2Desc", "prop2Icon", "prop2Title", "prop3Desc", "prop3Icon", "prop3Title", "prop4Desc", "prop4Icon", "prop4Title", "scentFloralDesc", "scentFreshDesc", "scentGourmandDesc", "scentHeading", "scentSubtitle", "scentWoodyDesc" FROM "HomepageSettings";
DROP TABLE "HomepageSettings";
ALTER TABLE "new_HomepageSettings" RENAME TO "HomepageSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
