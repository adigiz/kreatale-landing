# Setting Up a Multilingual Website for International Business

If your business operates in multiple countries or targets customers who speak different languages, you need a website that serves content in those languages. This article covers the technical options, SEO implications, and practical considerations as of 2026.

We build multilingual sites regularly at Kreatale — our own site runs in English and Indonesian, and we've built multilingual projects for clients in Japan, the Netherlands, Australia, and Kuwait. The details here come from that experience.

## URL Structure: The First Decision

How you organize different language versions of your site affects SEO, maintenance, and user experience. There are three main approaches:

### Subdirectories (Recommended for Most Businesses)

**Example:** `yoursite.com/en/`, `yoursite.com/id/`, `yoursite.com/ja/`

This keeps everything on one domain. All SEO authority consolidates on a single site. It's the simplest to set up and maintain.

**Pros:** One domain to manage, shared SEO equity, simplest hosting setup, lowest cost.
**Cons:** Less strong local signal than a country-code domain.

### Subdomains

**Example:** `en.yoursite.com`, `id.yoursite.com`, `ja.yoursite.com`

Each language version is a subdomain. Search engines treat subdomains as somewhat separate sites, which means SEO equity is partially split.

**Pros:** Can be hosted separately if needed, reasonable organizational separation.
**Cons:** SEO equity splits across subdomains, more complex DNS management, search engines may not associate them as strongly with the main domain.

### Country-Code Top-Level Domains (ccTLDs)

**Example:** `yoursite.com.au`, `yoursite.co.id`, `yoursite.nl`

Separate domains for each country. Strongest local trust signal for search engines.

**Pros:** Strongest local SEO signal, clear country targeting.
**Cons:** Most expensive (each domain is a separate registration), SEO equity is completely separate per domain, most maintenance overhead, requires separate hosting or complex routing.

**For most small-to-medium businesses, subdirectories are the right choice.** They're cheaper, simpler, and keep your SEO equity in one place. Country-code domains only make sense if you have dedicated teams and budgets for each market.

## Hreflang Tags: Essential but Easy to Get Wrong

Hreflang tags tell search engines which language version of a page to show to which audience. Without them, Google might show your English page to Indonesian users, or treat your language versions as duplicate content.

**Implementation:**
```html
<link rel="alternate" hreflang="en" href="https://yoursite.com/en/about" />
<link rel="alternate" hreflang="id" href="https://yoursite.com/id/about" />
<link rel="alternate" hreflang="x-default" href="https://yoursite.com/en/about" />
```

Every page needs hreflang tags pointing to all its language versions, and every language version must point back to all others (return links). The `x-default` tag specifies which version to show when no language match exists.

**The common mistakes:** Over 65% of international websites have significant hreflang errors. The most common are missing return links (page A points to page B, but page B doesn't point back to page A) and incorrect language/country codes.

Frameworks like Next.js with next-intl handle this automatically when configured correctly. WordPress requires a plugin like WPML or Polylang, which adds complexity and cost ($99–199/year for WPML).

## Content Strategy: Translation vs. Localization

This is where most multilingual sites go wrong. There's a difference between translating your content and actually localizing it.

**Translation** means converting text from one language to another. Your English "About" page becomes a Japanese "About" page with the same content.

**Localization** means adapting content for a specific market. This might include different pricing (in local currency), different payment methods, different case studies or testimonials relevant to that market, different legal information, and cultural adjustments to imagery and messaging.

In 2026, search engines are increasingly sophisticated about detecting translated-but-not-localized content. Google's AI and AI search engines like ChatGPT treat pages with identical structure and simply swapped languages as less authoritative than pages with genuine market-specific content. Content that reflects actual local differences — pricing, shipping options, compliance, local references — performs better in search.

**Practical approach:** Start with translation for your most important pages (homepage, services, contact). Then gradually add localized content for each market — local case studies, market-specific pricing, content addressing questions that are specific to that region.

## Technical Implementation

### With Next.js

Next.js supports internationalized routing natively. Libraries like `next-intl` provide:
- Locale detection based on browser language
- URL-based locale switching (`/en/`, `/id/`, `/ja/`)
- Automatic hreflang tag generation
- Translation file management (typically JSON files per locale)
- Server-side rendering of localized content (important for SEO)

This is how we build multilingual sites at Kreatale. The routing, SEO tags, and content switching are handled at the framework level, which means better performance and fewer moving parts than plugin-based solutions.

### With WordPress

WPML ($99/year) or Polylang (free with limited features, $99/year for premium) add multilingual support. Both create separate posts/pages per language and handle hreflang tags.

WPML is more complete but adds database overhead and can slow down large sites. Polylang is lighter but has fewer features. Both require careful configuration to avoid SEO issues.

### With Website Builders

Wix supports multilingual sites natively with Wix Multilingual (from $3/month add-on). Squarespace has limited multilingual support — typically requires duplicate pages or third-party integrations. Hostinger's builder has basic multi-language features.

The limitation with builders is that you can't control hreflang implementation, server-side rendering, or content delivery at a technical level. For a 2-language site with simple content, they work. For 3+ languages or SEO-sensitive implementations, custom development gives you more control.

## SEO Considerations for 2026

**AI search engines and multilingual content.** This is a newer consideration. AI tools like ChatGPT and Perplexity generally respond in the language the user queries in. If someone asks a question in Japanese, the AI will prefer Japanese-language sources. Having content in the languages your target markets speak increases the chances of being cited by AI search engines in those markets.

**Hreflang effectiveness in AI search.** Traditional hreflang signals help Google serve the right version. But AI search engines may not evaluate hreflang the same way — they tend to select content based on language and relevance at the retrieval stage, before hreflang signals are considered. This means the quality and relevance of your localized content matters more than the technical tags alone.

**Local authority signals.** For each market, build authority signals: local backlinks, local business listings, region-specific content, and reviews in the local language. A Japanese-language page on your .com domain with no Japanese backlinks or local citations will struggle against locally established competitors.

## What It Costs

| Component | Cost |
|---|---|
| Subdirectory setup (Next.js) | Included in development cost |
| next-intl or similar library | Free (open-source) |
| WPML (WordPress) | $99–199/year |
| Professional translation (per page) | $30–100 depending on language pair and length |
| AI-assisted translation + human review | $10–30 per page |
| Country-code domain registration | $10–50/year per domain |
| Wix Multilingual add-on | From $3/month |

AI translation tools (DeepL, Google Translate, ChatGPT) have improved significantly and work well for initial drafts. For published content, a native speaker should review for accuracy and natural phrasing. The cost difference between AI-only and AI + human review is small relative to the quality improvement.

## Building a Multilingual Site?

At Kreatale, multilingual support is a core part of our workflow. Our own site runs in English and Indonesian, and we've built multilingual projects for clients across Australia, Japan, the Netherlands, and Kuwait.

We use Next.js with next-intl for internationalized routing, automatic hreflang generation, and server-rendered localized content. Our international project experience includes [Zushino](/projects/zushino) (Japan), [Study Gorilla](/projects/study-gorilla) and [Gemoedje.nl](/projects/gemoedje) (Netherlands), [Gala Esports](/projects/gala-esports) (Australia), [Neon](/projects/neon) (Kuwait), and [Ayo Bareng](/projects/ayobareng) (Indonesia). We handle the technical setup, SEO configuration, and content structure — you provide the translations (or we can coordinate translation services).

If you're expanding into new markets and need a website that works across languages and regions, we can help plan the architecture and build it.

**[Discuss your multilingual project →](/contact)**

Or message us on WhatsApp: [+62 878-5281-9078](https://wa.me/6287852819078)
