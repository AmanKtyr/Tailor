---
name: seo
description: Governs Search Engine Optimization, meta tags, OpenGraph, structured data, canonical URLs, sitemaps, and robots configuration for public web applications.
---

# SEO Engineering Skill

Activate this skill when modifying public-facing web pages, metadata, marketing sites, sitemaps, or structured data (JSON-LD).

## 1. Relevance Gate
- **Public Web / SaaS:** SEO is active. Ensure crawler discovery, fast initial render, and accurate metadata.
- **Private Dashboards / Internal Tools / APIs:** Do NOT inject heavy SEO infrastructure or sitemaps into private authenticated areas.

## 2. Core Technical SEO Checklist
- **Title & Description:** Unique `<title>` (under 60 chars) and `<meta name="description">` (under 160 chars) per indexable page.
- **Heading Hierarchy:** Exactly one `<h1>` per page, followed by logical `<h2>`, `<h3>` order.
- **Canonical URLs:** Specify explicit `<link rel="canonical" href="...">`.
- **Social Metadata:** Provide Open Graph (`og:title`, `og:image`, `og:description`) and Twitter card tags.
- **Sitemap & Robots:** Maintain valid `sitemap.xml` and `robots.txt`.
