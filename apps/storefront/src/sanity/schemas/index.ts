// Shared types
import { localizedString, localizedText, ctaObject } from "./shared/localizedFields"

// Page builder blocks
import { heroSectionSchema } from "./blocks/heroSection"
import { trustBarSectionSchema } from "./blocks/trustBarSection"
import { ctaImageSectionSchema } from "./blocks/ctaImageSection"
import { testimonialsSectionSchema } from "./blocks/testimonialsSection"
import { newsletterSectionSchema } from "./blocks/newsletterSection"
import { featuredProductsSectionSchema } from "./blocks/featuredProductsSection"
import { categoryGridSectionSchema } from "./blocks/categoryGridSection"
import { blogPreviewSectionSchema } from "./blocks/blogPreviewSection"
import { buildYourDeskSectionSchema } from "./blocks/buildYourDeskSection"

// Singletons + documents
import { siteSettingsSchema } from "./siteSettings"
import { announcementBarSchema } from "./announcementBar"
import { headerNavSchema } from "./headerNav"
import { footerNavSchema } from "./footerNav"
import { homepageSchema } from "./homepage"
import { blogPostSchema } from "./blogPost"
import { commercialSectorSchema } from "./commercialSector"
import { pageSchema } from "./page"

export const schemas = [
  // Shared object types (must be registered before they're referenced)
  localizedString,
  localizedText,
  ctaObject,

  // Page builder blocks
  heroSectionSchema,
  trustBarSectionSchema,
  ctaImageSectionSchema,
  testimonialsSectionSchema,
  newsletterSectionSchema,
  featuredProductsSectionSchema,
  categoryGridSectionSchema,
  blogPreviewSectionSchema,
  buildYourDeskSectionSchema,

  // Documents
  siteSettingsSchema,
  announcementBarSchema,
  headerNavSchema,
  footerNavSchema,
  homepageSchema,
  blogPostSchema,
  commercialSectorSchema,
  pageSchema,
]
