# DragLab Germany — Full Website Documentation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [User Roles & Authentication](#4-user-roles--authentication)
5. [Multilingual System](#5-multilingual-system)
6. [Public-Facing Features](#6-public-facing-features)
7. [Lead Generation & Forms](#7-lead-generation--forms)
8. [Admin Panel](#8-admin-panel)
9. [Database Models](#9-database-models)
10. [Routes & Endpoints](#10-routes--endpoints)
11. [Security](#11-security)
12. [Performance & Caching](#12-performance--caching)
13. [SEO System](#13-seo-system)
14. [Email System](#14-email-system)
15. [File Management & Media](#15-file-management--media)
16. [Third-Party Integrations](#16-third-party-integrations)

---

## 1. Project Overview

**DragLab Germany** is a full-featured, production-grade B2B web platform built for a laboratory equipment manufacturer. The platform serves as the company's global digital presence — combining a multilingual product catalog, a lead management pipeline, a rich content publishing system, and a comprehensive admin panel for non-technical staff.

The platform is built with **server-side rendering** (Node.js + EJS), backed by **MongoDB Atlas**, and deployed with a strong focus on security, SEO, and performance across 5 languages: English, German, Spanish, Turkish, and French.

---

## 2. Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20.10.0 | Runtime |
| Express.js | 4.19.2 | Web framework |
| EJS | 3.1.9 | Server-side HTML templating |
| Mongoose | 8.4.0 | MongoDB ODM |
| MongoDB | 6.5.0 | Primary database |
| connect-mongodb-session | — | Session persistence in MongoDB |

### File & Media
| Technology | Purpose |
|---|---|
| Cloudinary | Image CDN, storage, and delivery |
| Multer | Multipart form data handling and file uploads |
| Sharp | Server-side image resizing and compression |

### Document Generation
| Technology | Purpose |
|---|---|
| pdf-lib | PDF template filling and generation |
| pdfkit | Programmatic PDF creation (tables, styles) |
| ExcelJS | Export data (newsletter subscribers, leads) to .xlsx |

### Email
| Technology | Purpose |
|---|---|
| SendGrid | Transactional email delivery to customers |
| Nodemailer | Internal SMTP email alerts |
| nodemailer-sendgrid-transport | Integration layer |

### Security
| Technology | Purpose |
|---|---|
| Helmet | Security headers (HSTS, CSP, X-Frame-Options, etc.) |
| bcryptjs | Password hashing |
| csurf | CSRF token protection on all forms |
| express-validator | Input validation and sanitization |
| dotenv | Environment variable management |

### Utilities & Other Libraries
| Technology | Purpose |
|---|---|
| Slugify | URL-safe slug generation |
| Moment.js | Date formatting and manipulation |
| Axios | HTTP client for external API calls |
| Fuse.js | Client-side fuzzy search |
| geoip-lite | IP-to-geolocation mapping (country, city, ISP) |
| uuid | Unique ID generation |
| cheerio | HTML parsing |
| compression | gzip middleware |
| Morgan | HTTP request logging |
| EasyPost | Shipping label generation API |
| feed | RSS/Atom XML feed generation |

### Frontend Libraries
| Technology | Purpose |
|---|---|
| Three.js | 3D product rendering in the browser |
| Babylon.js | Alternative 3D engine for product visualization |
| TinyMCE | Rich text editor (used by admin for articles, content) |

### Development & Testing
| Technology | Purpose |
|---|---|
| Mocha, Chai, Sinon, Nock | Unit and integration testing |
| Cypress | End-to-end browser testing |
| Webpack & Babel | JS module bundling |
| Vite | Frontend build tool |
| Nodemon | Dev server with auto-restart |

---

## 3. Architecture Overview

The platform follows a classic **MVC (Model-View-Controller)** pattern:

```
routes/        → Define URL paths and HTTP methods
controllers/   → Handle business logic (shop.js, admin.js)
models/        → Mongoose schemas (18 models)
Front-end/     → EJS views, CSS, client JS
middleware/    → Auth, CSRF, multer, error handling
```

**Request flow:**
1. Browser request hits Express router
2. Middleware runs (session check, CSRF, nonce generation)
3. Controller queries MongoDB and processes data
4. EJS template rendered with injected data
5. Compressed HTML response sent to browser

**Caching layers:**
- Navigation products: in-memory cache with 10-minute TTL
- User session data: in-memory cache with 60-second TTL
- Static assets: browser cache 7 days (CSS/JS), 365 days (versioned assets)
- MongoDB: connection pool (max 20 concurrent connections)

---

## 4. User Roles & Authentication

### Roles

| Role | Description |
|---|---|
| **Public** | Any visitor — no login required |
| **subAdmin** | Staff member — can manage products, content, and forms |
| **admin** | Full access — includes user management and system settings |

### Authentication Flow

- Login via email + password (bcryptjs hash comparison)
- Session stored in MongoDB (7-day expiry)
- User data cached in memory (60-second TTL) to reduce DB queries
- Password reset via secure token (`resetToken` + `resetTokenExpiration` fields)
- All protected routes use an `isAuth` middleware that checks session and role

### Account Management (Admin only)
- Create new admin/subAdmin accounts
- Edit name, email, phone number, role
- Delete accounts
- Force password reset for any user

---

## 5. Multilingual System

The entire platform supports **5 languages**: English (EN), German (DE), Spanish (ES), Turkish (TR), French (FR).

### How it works

- All content fields are duplicated per language inside the MongoDB document (e.g., `Language.EN`, `Language.DE`, etc.)
- Each language version has its own **publish status**: a product can be published in EN and DE but still be a draft in ES
- Routes include the language code as a URL prefix: `/en/products/`, `/de/products/`, `/tr/products/`
- Browser `Accept-Language` header is detected on first visit and used for auto-redirect
- Navigation product list is preloaded and cached per language separately

### Per-language fields (across models)
- Product name, description, features, technical specifications, downloads
- Model name, description, overview sections, applications
- Article title, slug, body, summary, tags
- Case study title, client profile, problem, solution, results
- FAQ question and answer
- Glossary term, definition, description
- Testimonial customer quote
- Accessory description
- Slideshow title, description, button label and link
- Industry page hero content, intro section, features list

### SEO per language
- Each product and model has its own `meta.title` and `meta.description` per language
- Localized `tags` (keyword arrays) per language used in weighted text search indexes
- `hreflang` link tags generated in `<head>` for all language variants of each page
- Canonical URL set to the current language version

---

## 6. Public-Facing Features

### 6.1 Home Page
- Hero slideshow with multilingual title, description, and CTA button
- Featured products section
- Industry verticals navigation
- Testimonial display
- Newsletter subscription widget

### 6.2 Product Catalog
- Browsable product listing per language
- Each product contains:
  - Product thumbnail and sketch image
  - Product name and description
  - "Why this product" section
  - Feature cards (image + name + description)
  - Nested models list
- Full-text search across product and model names, descriptions, and keyword tags (weighted MongoDB text index)

### 6.3 Model Detail Page
- Per-model detail page with its own URL slug: `/en/products/{product-slug}/{model-slug}`
- Model thumbnail and photo gallery
- Overview sections (image + title + description)
- Technical specifications table (grouped into sections with rows)
- Industry association list with logos and images
- Downloads section (datasheets, manuals, certificates) organized by category
- 3D product visualization using Three.js or Babylon.js
- Related accessories listed by compatibility
- Inquiry/quote CTA button

### 6.4 Accessories
- Dedicated accessories listing page
- Filter by product or model compatibility
- Accessory detail page with article number, image, multilingual description
- "Compatible with" section showing linked products and models

### 6.5 Articles (Blog)
- Article listing with category filter: News, Products, Industries, Company, Tutorials, Scientific, Other
- Per-article detail page with author, publish date, thumbnail, full body (rich text)
- Tags per article per language
- RSS and Atom feeds for article syndication

### 6.6 Case Studies
- Client success story pages
- Each case study includes:
  - Client profile (type, location, size, industry)
  - Problem description
  - Solution delivered
  - Results achieved
  - Products used (with links)
  - Thumbnail image
- Multilingual with per-language publish status

### 6.7 FAQ
- Categorized knowledge base: Installation, Maintenance, Troubleshooting, Warranty, Product Usage, General
- Each FAQ linked to related products
- Custom ordering (order field)
- JSON-LD FAQPage schema markup for SEO

### 6.8 Glossary
- Alphabetically indexed laboratory terminology dictionary
- Each term has: term name, definition, full description, category, related products
- Searchable, organized by first letter
- Multilingual definitions per term

### 6.9 Testimonials
- Customer reviews with 1–5 star rating
- Customer name, company, country, industry
- Profile photo and company logo
- Linked to specific product and model
- Featured flag (shown on home page or product page)
- Case study flag (linked to a matching case study)

### 6.10 Industry Pages
- Vertical-specific landing pages (e.g., Pharmaceutical, Food Testing, Environmental)
- Each page has:
  - Hero slideshow section with title, subtitle, and description
  - Intro section with image and text
  - Features list (name, description, image)
  - Frequently used products for that industry (per language)
- Up to 4 industry associations per product model

### 6.11 Sitemap
- XML sitemap auto-generated for all published products, models, articles, case studies, glossary terms, and industry pages
- Covers all 5 language URL variants

### 6.12 RSS / Atom Feeds
- Syndication feeds for articles
- Auto-generated from published article content

---

## 7. Lead Generation & Forms

All forms include:
- CSRF token validation
- Google reCAPTCHA Enterprise verification
- IP address logging
- `isSpam` flag for admin moderation
- Language tracking (form submitted in which language)
- SendGrid email confirmation to the submitter
- Internal alert email to the company

### 7.1 Request a Quote
**Fields:** Company name, country, industry, contact name, email, phone, product category, product model, quantity, message, file attachment (up to 10MB), delivery deadline

**Workflow statuses:** `new` → `contacted` → `closed`

**PDF generation:** A styled PDF of the quote details is generated and can be downloaded from the admin panel.

### 7.2 Become a Distributor
**Fields:** Company name, country, website, company overview, year established, current brands, industry focus (multi-select), sales channels (multi-select + other), annual sales volume, distribution territory, target market, contact name, email, phone, company profile document (Cloudinary upload)

**Workflow statuses:** `new` → `under_review` → `accepted` / `rejected`

**PDF generation:** A formatted distributor application PDF is generated automatically.

### 7.3 Warranty Registration
**Fields:** Customer name, email, date of purchase, device category (product), device model, serial number, message

**Workflow statuses:** `pending` → `done`

Linked to the actual Product and Model documents by ObjectId.

### 7.4 Technical Service Request
**Fields:** Info type (company or private), company, department, salutation, first name, last name, postal town, street address, country, telephone, telefax, email, failure date, device category, device model, serial number, notes

**Workflow statuses:** `pending` → `done`

### 7.5 Contact Us
**Fields:** Name, email, subject, message

Includes geolocation tracking (country, region, city, ISP) via geoip-lite.

### 7.6 Newsletter Subscription
**Fields:** Email, language preference

Automatically logs:
- IP address
- Geolocation (country, region, city, ISP)
- Subscribed date
- Extraction status (whether it has been included in an export)

Admin can export all subscribers or only new (not yet extracted) subscribers as an Excel (.xlsx) file.

---

## 8. Admin Panel

The admin panel is a full CMS and lead management system accessible only to authenticated admin and subAdmin users.

### 8.1 Product Management
- Create, edit, delete products
- Manage product slug, thumbnail, sketch image, draft/publish state
- Add and edit product features (image, name, description) per language
- Manage the "Why this product" section per language
- Set per-language publish status independently

### 8.2 Model Management
- Add and edit models nested within a product
- Upload model thumbnail and multiple photo gallery images
- Set model capacity, slug
- Add overview sections (image, title, description)
- Add industry associations (name, image, logo)
- Add technical specifications in sections with title/value rows
- Manage downloadable files (name, path, size, category, product category)
- Set per-language SEO meta title and description
- Add localized keyword tags per language
- Assign up to 4 industry slugs per model
- Set per-language publish status

### 8.3 Accessories Management
- Create, edit, delete accessories
- Set name, article number, image, description per language
- Assign compatibility: select which products and models each accessory applies to
- Set language publish status per language: `none`, `draft`, `published`
- Global status: `draft` or `published`

### 8.4 Quote Management
- View all submitted quote requests
- Filter by status, spam flag, language
- Update status (`new` → `contacted` → `closed`)
- Mark as spam
- Download quote as PDF
- View all form details including IP address and file attachment

### 8.5 Distributor Application Management
- View all distributor applications
- Update status (`new` → `under_review` → `accepted` → `rejected`)
- Mark as spam
- Download application as PDF
- View company profile document

### 8.6 Warranty Registration Management
- View all warranty registrations
- Update status (`pending` → `done`)
- Mark as spam
- View linked product and model info

### 8.7 Technical Service Management
- View all technical service requests
- Update status (`pending` → `done`)
- Mark as spam
- View full contact info and device details

### 8.8 Contact Us Management
- View all contact inquiries
- View geolocation data

### 8.9 Article Management
- Create, edit, delete articles
- Set thumbnail, author, category
- Write full body using TinyMCE rich text editor
- Set title, slug, summary, tags per language
- Set publish status per language: `none`, `draft`, `published`
- Set published date per language

### 8.10 Case Study Management
- Create, edit, delete case studies
- Set client profile (type, location, size, industry)
- Write problem, solution, and results per language
- Link to products used
- Set thumbnail image
- Set per-language publish status

### 8.11 FAQ Management
- Create, edit, delete FAQs
- Set category (Installation, Maintenance, Troubleshooting, Warranty, Product Usage, General)
- Write question and answer per language
- Link to related products
- Set custom display order

### 8.12 Glossary Management
- Create, edit, delete glossary terms
- Set term, slug, definition, description, letter, category
- Write per-language translation (term, definition, description)
- Link to related products
- Set per-language publish status

### 8.13 Testimonial Management
- Create, edit, delete testimonials
- Set customer name, company, country, industry
- Upload profile photo and company logo
- Link to a product and specific models
- Set star rating (1–5)
- Write customer quote per language
- Set featured flag (for homepage display)
- Set case study flag (links to a case study)

### 8.14 Industry Page Management
- Create and edit industry landing pages by slug
- Upload hero slideshow image and intro image
- Set hero title, subtitle, description per language
- Set intro title and description per language
- Add features (name, description, image) per language
- Manage frequently used products per language (linked by product ObjectId)
- Set draft/published state

### 8.15 Slideshow Management
- Create, edit, delete hero banner slides
- Upload slide image
- Set title, description, button label, button link per language
- Set per-language status: `none`, `draft`, `published`

### 8.16 Newsletter Management
- View all newsletter subscribers with geolocation data
- Export all subscribers to Excel
- Export only new (not previously extracted) subscribers to Excel

### 8.17 User Account Management (Admin only)
- View all admin and subAdmin accounts
- Create new accounts
- Edit name, email, phone, role
- Delete accounts
- Trigger password reset

---

## 9. Database Models

The platform uses **18 Mongoose models** in MongoDB.

### 9.1 Product
The core catalog document. Contains top-level product info and an embedded array of Models.

**Key fields:**
- `ProductThumbnail`, `ProductSketch` — Cloudinary image URLs
- `Language.{EN|ES|DE|TR|FR}` — Array of one object containing: product name, name description, description, why description, features list, and per-language publish status
- `tags.{EN|ES|DE|TR|FR}` — Keyword arrays for search
- `meta.{EN|ES|DE|TR|FR}` — SEO title and description per language
- `Models[]` — Embedded array of Model subdocuments
- `isDraft` — Global draft toggle
- `slug` — Unique URL slug

**Text search index:** Weighted across product names (weight 10), descriptions (weight 5), and tags (weight 8) in all 5 languages. Also covers embedded model fields.

### 9.2 Model (subdocument of Product)
Nested inside `Product.Models[]`.

**Key fields:**
- `ModelThumbnail`, `ModelPhotos[]` — Cloudinary image URLs
- `overviewThumbnail`, `modelcapacity`
- `industrySlugs[]` — References to IndustryPage slugs (max 4)
- `Language.{EN|ES|DE|TR|FR}` — Contains: model name, description, overview sections, industry associations, technical specifications (sectioned table), downloads list, per-language publish status
- `tags.{EN|ES|DE|TR|FR}` — Keyword arrays
- `meta.{EN|ES|DE|TR|FR}` — SEO title and description
- `slug` — URL slug for the model page

### 9.3 Accessory
Products add-ons with cross-referenced compatibility.

**Key fields:**
- `name`, `slug`, `articleNumber`, `image`
- `description.{en|es|de|tr|fr}` — Per-language text
- `langStatus.{en|es|de|tr|fr}` — Enum: `none`, `draft`, `published`
- `applicableProducts[]` — Array of `{ productId, productName, productSlug, models[] }` where each model is `{ modelId, modelName, modelSlug }`
- `status` — Global: `draft` or `published`

**Indexes:** Per-language status, applicable product slug, applicable model ID.

### 9.4 Quote
Customer product inquiry.

**Key fields:**
- `companyName`, `country`, `industry`, `contactName`, `email`, `phone`
- `productCategory`, `productModel`, `quantity`, `message`
- `fileAttachment` — Cloudinary URL
- `deliveryDeadline` — Date
- `status` — Enum: `new`, `contacted`, `closed`
- `lang`, `ipAddress`, `isSpam`

### 9.5 DistributorApplication
Partner onboarding application.

**Key fields:**
- `companyName`, `country`, `website`, `companyOverview`
- `companyEstablished`, `currentBrands`
- `industryFocus[]`, `salesChannels[]`, `salesChannelsOther`
- `annualSalesVolume`, `distributionTerritory`, `targetMarket`
- `companyProfileUrl` — Cloudinary document URL
- `contactName`, `email`, `phone`
- `status` — Enum: `new`, `under_review`, `accepted`, `rejected`
- `lang`, `ipAddress`, `isSpam`

### 9.6 WarrantyRegistration
Device warranty claim.

**Key fields:**
- `name`, `email`, `datePurchased`
- `deviceCategory` — ObjectId ref to Product
- `deviceModel` — ObjectId of nested model subdocument
- `serialNo`, `message`
- `status` — Enum: `pending`, `done`
- `lang`, `isSpam`

### 9.7 TechnicalService
Device failure and repair request.

**Key fields:**
- `infoType` — Enum: `company`, `private`
- `company`, `department`, `salutation`, `firstName`, `lastName`
- `postalTown`, `street`, `country`, `telephone`, `telefax`, `email`
- `failureDate`, `deviceCategory` (ref to Product), `deviceModel`, `serialNo`, `note`
- `status` — Enum: `pending`, `done`
- `lang`, `isSpam`

### 9.8 ContactUs
General visitor inquiry.

**Key fields:**
- `name`, `email`, `subject`, `message`
- `ipAddress`, geolocation data
- `isSpam`

### 9.9 Article
Blog post with multilingual content.

**Key fields:**
- `thumbnail`, `author`, `category` — Enum: News, Products, Industries, Company, Tutorials, Scientific, Other
- `translations.{en|es|de|tr|fr}`:
  - `title`, `slug`, `body` (rich HTML), `summary`, `tags[]`
  - `status` — Enum: `none`, `draft`, `published`
  - `publishedAt` — Date

### 9.10 CaseStudy
Customer success story.

**Key fields:**
- `clientType`, `clientLocation`, `clientSize`, `industry`
- `problem`, `solution`, `results`
- `productsUsed[]` — Array of `{ name, link }`
- `thumbnail`
- `translations.{en|es|de|tr|fr}`:
  - `title`, `slug`, `clientProfile`, `problem`, `solution`, `results`, `summary`
  - `status` — Enum: `draft`, `published`

### 9.11 FAQ
Knowledge base entry.

**Key fields:**
- `translations.{en|es|de|tr|fr}`:
  - `question`, `answer`
  - `status` — Enum: `none`, `draft`, `published`
- `category` — Enum: Installation, Maintenance, Troubleshooting, Warranty, Product Usage, General
- `relatedProducts[]`, `relatedProductNames[]`
- `slug`, `order`

### 9.12 Glossary
Laboratory terminology dictionary entry.

**Key fields:**
- `term`, `slug`, `definition`, `description`, `letter`, `category`
- `relatedProducts[]`
- `translations.{en|es|de|tr|fr}`:
  - `term`, `definition`, `description`
  - `status` — Enum: `draft`, `published`

### 9.13 GlossaryCategory
Category grouping for glossary terms.

### 9.14 Testimonial
Customer review with rating.

**Key fields:**
- `name`, `company`, `country`, `industry`
- `productId` (ref to Product), `productName`
- `modelIds[]`, `modelNames[]`
- `rating` — Number 1–5
- `translations.{en|es|de|tr|fr}`:
  - `quote`
  - `status` — Enum: `none`, `draft`, `published`
- `image`, `logo`
- `featured` — Boolean (show on homepage)
- `caseStudy` — Boolean (linked to a case study)

### 9.15 IndustryPage
Industry vertical landing page.

**Key fields:**
- `slug` — Unique URL identifier
- `sharedImages.slideImage`, `sharedImages.introImage`
- `Language.{EN|ES|DE|TR|FR}`:
  - `slideTitle`, `slideSubTitle`, `slideDesc`
  - `introTitle`, `introDesc`
  - `features[]` — Name, description, image per feature
- `frequentlyUsedProducts.{EN|ES|DE|TR|FR}`:
  - Array of `{ productId (ref to Product), text }`
- `isDraft`

### 9.16 Slideshow
Hero banner carousel slide.

**Key fields:**
- `image` — Cloudinary URL
- `translations.{en|es|de|tr|fr}`:
  - `title`, `desc`, `buttonLabel`, `buttonLink`
  - `status` — Enum: `none`, `draft`, `published`

### 9.17 NewsletterSubscriber
Email subscriber with geolocation.

**Key fields:**
- `email` — Unique
- `language`
- `subscribedAt`
- `isExtracted` — Whether included in a previous export
- `ipAddress`
- `geoLocation` — `{ country, region, city, isp }`

### 9.18 User
Admin and subAdmin accounts.

**Key fields:**
- `name`, `email`, `password` (bcrypt hash)
- `phoneNumber`
- `role` — Enum: `subAdmin`, `admin`
- `resetToken`, `resetTokenExpiration`

---

## 10. Routes & Endpoints

### Route Files

| File | Description |
|---|---|
| `routes/shop.js` | All public customer-facing pages |
| `routes/admin.js` | All admin panel pages (protected) |
| `routes/auth.js` | Login, logout, password reset |
| `routes/account.js` | Logged-in user account settings |
| `routes/sitemap.js` | XML sitemap generation |
| `routes/feed.js` | RSS and Atom article feeds |
| `routes/staticpages.js` | About, contact, legal, and other static pages |
| `routes/recommendations.js` | Product recommendation logic |

### Key Public Route Patterns

```
GET  /:lang/                              Home page
GET  /:lang/products                      Product catalog listing
GET  /:lang/products/:productSlug         Product page
GET  /:lang/products/:productSlug/:modelSlug  Model detail page
GET  /:lang/accessories                   Accessories listing
GET  /:lang/accessories/:slug             Accessory detail page
GET  /:lang/articles                      Article listing
GET  /:lang/articles/:slug                Article detail page
GET  /:lang/case-studies                  Case study listing
GET  /:lang/case-studies/:slug            Case study detail page
GET  /:lang/faq                           FAQ listing
GET  /:lang/glossary                      Glossary listing
GET  /:lang/glossary/:slug                Glossary term page
GET  /:lang/industries/:slug              Industry landing page
GET  /:lang/search                        Search results
POST /:lang/quote                         Submit quote request
POST /:lang/become-a-distributor          Submit distributor application
POST /:lang/warranty-registration         Submit warranty registration
POST /:lang/technical-service            Submit technical service request
POST /:lang/contact                       Submit contact form
POST /:lang/newsletter/subscribe          Subscribe to newsletter
GET  /sitemap.xml                         XML sitemap
GET  /feed/rss                            RSS feed
GET  /feed/atom                           Atom feed
```

### Key Admin Route Patterns

```
GET  /admin/                                      Admin dashboard
GET  /admin/products                              Product list
GET  /admin/products/add                          Add product form
POST /admin/products/add                          Create product
GET  /admin/products/:id/edit                     Edit product form
POST /admin/products/:id/edit                     Update product
GET  /admin/products/:id/models/add               Add model form
POST /admin/products/:id/models/add               Create model
GET  /admin/accessories                           Accessories list
POST /admin/accessories/add                       Create accessory
GET  /admin/quotes                                Quote list
POST /admin/quotes/:id/status                     Update quote status
GET  /admin/quotes/:id/pdf                        Download quote PDF
GET  /admin/distributor-applications              Distributor list
GET  /admin/warranty-registrations                Warranty list
GET  /admin/technical-services                    Technical service list
GET  /admin/contact-submissions                   Contact inquiries
GET  /admin/articles                              Article list
POST /admin/articles/add                          Create article
GET  /admin/case-studies                          Case study list
GET  /admin/faqs                                  FAQ list
GET  /admin/glossary                              Glossary list
GET  /admin/testimonials                          Testimonial list
GET  /admin/industry-pages                        Industry page list
GET  /admin/slideshow                             Slideshow management
GET  /admin/newsletter/export-all                 Export all subscribers (xlsx)
GET  /admin/newsletter/export-new                 Export new subscribers (xlsx)
GET  /admin/users                                 User account list (admin only)
POST /admin/users/add                             Create user (admin only)
```

---

## 11. Security

### Transport Security
- **HTTPS enforced** on all production routes
- **HSTS** (HTTP Strict Transport Security) with a 2-year max-age and preload flag
- **Strict-Transport-Security** header set by Helmet

### Content Security Policy
- Nonce-based CSP generated dynamically per request
- Allows only trusted script and style sources
- Blocks inline scripts without a valid nonce
- Prevents XSS by rejecting unauthorized script execution

### Headers (via Helmet)
- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME-type sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — restricts camera, microphone, geolocation API access

### Form Security
- **CSRF tokens** on every form (csurf middleware)
- **Google reCAPTCHA Enterprise** on all public forms to block bots
- **express-validator** for server-side input validation and sanitization
- **File upload restrictions**: allowed MIME types enforced by Multer, 10MB size limit

### Authentication Security
- Passwords hashed with **bcryptjs** (salt rounds configured per environment)
- Session tokens stored in MongoDB with 7-day expiry
- Password reset via time-limited tokens (resetToken + resetTokenExpiration)
- No plaintext credentials stored anywhere

### Spam Prevention
- IP address recorded on every form submission
- Geolocation (country, ISP) tracked via geoip-lite
- User agent and referrer logging
- `isSpam` flag on Quote, Contact, DistributorApplication, TechnicalService, WarrantyRegistration
- Admin can mark submissions as spam without deleting them

### Legacy URL Handling
- 301 permanent redirects for old `.php` and `.shtml` URLs
- 410 Gone responses for permanently removed paths
- Base64 garbage URL detection and rejection

---

## 12. Performance & Caching

### Server-Side Caching
| Cache | TTL | What is cached |
|---|---|---|
| Navigation products | 10 minutes | Products displayed in the site navigation, per language |
| User session data | 60 seconds | Logged-in user object to reduce DB reads |

### Static Asset Caching
- CSS and JS files: `Cache-Control: max-age=604800` (7 days)
- Versioned assets (hashed filenames): `Cache-Control: max-age=31536000` (365 days)
- ETag support for conditional requests (`304 Not Modified`)

### Network Compression
- `compression` middleware with gzip enabled for all text responses
- 1 KB minimum threshold before compression is applied

### Image Optimization
- All images served from **Cloudinary CDN**
- **Sharp** used for server-side resizing before upload
- Lazy loading implemented on article and product listing pages
- Responsive image variants delivered via Cloudinary URL transformations

### Database Performance
- MongoDB connection pool: max 20 concurrent connections
- Compound indexes on frequently queried field combinations:
  - `{ isDraft: 1, slug: 1 }` for product page lookups
  - Per-language publish status indexes
  - Accessory: applicable product slug, model ID indexes
- Weighted text search index covers all 5 languages simultaneously

### Request Logging
- Morgan logger skips static asset requests (CSS, JS, images) to reduce noise
- Access log written to `access.log` file

---

## 13. SEO System

### URL Structure
- Language-prefixed clean URLs: `/en/products/water-bath-series/wb-12-digital`
- Slugs auto-generated from content names via Slugify
- Legacy URL redirects (301) maintain link equity from old site structure

### Meta Tags
- Unique `<title>` and `<meta name="description">` per page per language
- Admin can set custom SEO title and description for every product and model in all 5 languages
- Fallback to product/model name if custom meta is not set

### Multilingual SEO
- `<link rel="hreflang">` tags generated in `<head>` for all 5 language variants of every page
- `<link rel="canonical">` pointing to the current language version

### Structured Data (JSON-LD)
- Organization schema on company pages
- FAQPage schema on FAQ pages
- Product schema on model detail pages

### XML Sitemap
- Auto-generated sitemap covering all published content
- Includes all language variants of every URL
- Updated dynamically as content is published

### RSS / Atom Feeds
- Article syndication via `/feed/rss` and `/feed/atom`
- Helps search engines discover new content faster

### Search (Internal)
- MongoDB full-text search with weighted fields:
  - Product/model name: weight 10
  - Tags/keywords: weight 8
  - Descriptions: weight 5
- Search covers all 5 languages simultaneously in a single query
- Client-side fuzzy search powered by Fuse.js

### Analytics
- Google Analytics
- Google Ads conversion tracking
- Bing Ads tracking
- Microsoft Clarity (session recording, heatmaps) — ENV-gated

---

## 14. Email System

### Architecture
The platform uses a **dual-delivery architecture**:

| Channel | Provider | Purpose |
|---|---|---|
| Customer emails | SendGrid | Order confirmations, form acknowledgements, marketing |
| Internal alerts | Nodemailer + SMTP | Notifications to company staff when a form is submitted |

### SendGrid Templates
- Dynamic templates with placeholder variables
- Separate template IDs per form type (quote, distributor, warranty, etc.)
- Triggered automatically on successful form submission

### Internal SMTP Alerts
- Sent via Nodemailer on every form submission
- Includes all submitted data formatted as plain text or HTML
- Fallback-capable (if SendGrid fails, SMTP alert still fires)

### Developer Utilities
- `mail-dry-run.log` — logs email content without sending during development
- Sandbox mode support for testing without delivering real emails

---

## 15. File Management & Media

### Image Uploads
- All images uploaded to **Cloudinary** via the admin panel
- **Sharp** resizes and compresses images server-side before upload
- Supported formats: JPEG, PNG, WebP

### Document Uploads
- Distributor applications can upload a company profile document
- Stored on Cloudinary with a secure URL
- Quote forms accept file attachments up to 10MB

### File Handling (Multer)
- Multipart form processing for all file upload endpoints
- MIME type validation (only allowed types accepted)
- File size limits enforced at middleware level
- Filename sanitization to prevent path traversal attacks

### PDF Generation
- **pdf-lib**: Fill styled PDF templates (e.g., quote documents with company branding)
- **pdfkit**: Programmatic generation with tables, borders, footers, and styled text
- PDFs generated on demand in the admin panel and downloadable immediately

### Excel Export
- **ExcelJS** generates `.xlsx` files for newsletter subscriber exports
- Columns: email, language, subscribed date, geolocation (country, region, city, ISP)
- Two export types: all subscribers / new subscribers only (not previously extracted)

---

## 16. Third-Party Integrations

| Service | Purpose |
|---|---|
| **Cloudinary** | Image and document CDN, storage, transformation |
| **SendGrid** | Transactional email delivery to customers |
| **Google reCAPTCHA Enterprise** | Spam and bot prevention on all public forms |
| **Google Analytics** | Visitor traffic analytics |
| **Google Ads** | Paid search conversion tracking |
| **Bing Ads** | Microsoft paid search conversion tracking |
| **Microsoft Clarity** | Session recording and heatmaps |
| **Tawk.to** | Live chat widget embedded on public pages |
| **EasyPost** | Shipping label generation API |
| **MongoDB Atlas** | Cloud-hosted MongoDB database |
| **geoip-lite** | IP address to geolocation mapping (country, city, ISP) |

---

*Document generated: June 2026*
*Platform: DragLab Germany — info@drag-lab.de*
