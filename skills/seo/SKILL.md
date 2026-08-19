---
name: seo
description: Governs Search Engine Optimization (SEO), meta tags, OpenGraph, JSON-LD structured data, canonical URLs, sitemaps, and robots configuration for public web applications.
---

# SEO Engineering Skill

Activate this skill when modifying public-facing web pages, metadata, marketing sites, sitemaps, robots configurations, or structured data (JSON-LD).

> **Operational Directive:** *Ensure optimal search engine discovery, social share previews, and fast initial rendering without polluting private authenticated areas.*

---

## 1. Relevance Gate: Public vs Private Routes

* **Public Pages (Marketing, Blog, Docs, Landing Pages, Public Profiles):** SEO is active. Generate clean metadata, OpenGraph tags, sitemaps, and structured JSON-LD schemas.
* **Private Authenticated Areas (Admin Panels, User Dashboards, Billing Settings):** Do NOT inject heavy SEO infrastructure, sitemaps, or structured schemas. Ensure `<meta name="robots" content="noindex, nofollow" />` is set.

---

## 2. Core Technical SEO Checklist

1. **Title & Meta Description:**
   - `<title>`: Unique per page, 50–60 characters max, format: `[Page Title] | [Brand Name]`.
   - `<meta name="description">`: Engaging summary, 140–160 characters max.
2. **Heading Hierarchy:**
   - Exactly one `<h1>` per indexable page representing the primary topic.
   - Follow logical sequential order: `<h1>` -> `<h2>` -> `<h3>` (never skip levels).
3. **Canonical URLs:**
   - Explicit `<link rel="canonical" href="https://example.com/canonical-path" />` on every public page.
4. **Social Sharing Metadata (Open Graph & Twitter Cards):**
   - `og:title`, `og:description`, `og:image` (1200x630px recommended), `og:url`, `og:type`.
   - `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`.

---

## 3. Structured Data Schema (JSON-LD)

For articles, software tools, or organizations, provide valid JSON-LD schemas:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Tailor",
  "operatingSystem": "All",
  "applicationCategory": "DeveloperApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
</script>
```

---

## 4. Sitemaps & Robots Configuration

* Maintain an automatically generated `sitemap.xml` listing all indexable canonical URLs.
* Provide a clean `robots.txt` referencing the sitemap and disallowing private endpoints (`/api/`, `/admin/`, `/dashboard/`).
