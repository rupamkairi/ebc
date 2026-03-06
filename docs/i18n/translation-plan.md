# EBC Translation Plan

## Overview

This document outlines the comprehensive i18n (internationalization) strategy for the EBC (ECON Building Centre) project, including the current setup, implementation plan, and prioritized translation keys.

---

## 1. Current i18n Setup

### Technology Stack
- **Library**: i18next + react-i18next
- **Language Detection**: i18next-browser-languagedetector

### Current Configuration

| Component | Location |
|-----------|----------|
| Config | `src/i18n/config.ts` |
| Hook | `src/hooks/useLanguage.ts` |
| Language Switcher | `src/components/LanguageSwitcher.tsx` |

### Supported Languages

| Code | Language | Direction |
|------|----------|-----------|
| `en-IN` | English (India) | LTR |
| `hn-IN` | Hinglish (Hindi in English script) | LTR |

### Current Translation Structure

The translations are currently embedded in `src/i18n/config.ts` as two large objects (`english` and `hinglish`), totaling ~185 keys each.

---

## 2. Implementation Plan

### Step 1: Create Separate Translation Files

**Task**: Move translations from `config.ts` to separate JSON files

**Actions**:
1. Create directory structure: `src/i18n/locales/`
2. Create `src/i18n/locales/en.json` with all English translations
3. Create `src/i18n/locales/hn.json` with all Hinglish translations
4. Remove the inline translation objects from `config.ts`

### Step 2: Update Config to Load from Files

**Task**: Modify `src/i18n/config.ts` to load translations from the new JSON files

**Option A - Direct Import (Recommended)**:
```typescript
import en from './locales/en.json';
import hn from './locales/hn.json';

const resources = {
  'en-IN': { translation: en },
  'hn-IN': { translation: hn },
};
```

**Option B - HTTP Backend**:
- Install `i18next-http-backend`
- Configure backend to load from `/locales/{{lng}}.json`
- Recommended for larger translation files or lazy loading

### Step 3: Add New Translation Keys

**Task**: Identify and add missing translation keys for text content not yet internationalized

**Priority Areas**:
- Footer content (many hardcoded strings)
- Ecosystem section (card titles, subtitles, benefits)
- Advantages section (card content)
- Materials section (section heading, CTA)
- How It Works section (heading, button)
- Navigation components

### Step 4: Update Components to Use Translations

**Task**: Replace hardcoded strings with translation function calls

**Pattern**:
```typescript
// Before
<h1>Build Your Dream Home</h1>

// After
<h1>{t("hero_title")}</h1>
```

---

## 3. Components and Text Content Requiring Translation

### 3.1 Hero Section (`src/components/landing/hero.tsx`)

| Key | Current Text | Priority |
|-----|--------------|----------|
| `hero_title` | Build Your Dream Home with Confidence Not Confusion | HIGH |
| `hero_subtitle` | Know your real construction cost, compare verified sellers... | HIGH |
| `hero_cta_primary` | Consult With an Expert (Free) | HIGH |
| `hero_cta_secondary` | Compare Material Rate (Free) | HIGH |
| `search_placeholder` | What are you looking for... | MEDIUM |

### 3.2 Header/Navigation

**Note**: Navigation links appear to be in separate header components. Need to verify which header components exist and their content.

### 3.3 Footer Section (`src/components/landing/footer-section.tsx`)

| Key | Current Text | Priority |
|-----|--------------|----------|
| `footer_brand_name` | Econ Building Centre | HIGH |
| `footer_brand_desc` | India's structured construction marketplace... | MEDIUM |
| `footer_bullet_1` | Verified Sellers & Service Providers | MEDIUM |
| `footer_bullet_2` | Transparent Pricing & RFQs | MEDIUM |
| `footer_bullet_3` | AI-Powered Cost Intelligence | MEDIUM |
| `footer_bullet_4` | Engineer-Guided Decisions | MEDIUM |
| `footer_experience` | Built on real construction experience since 2004 | LOW |
| `footer_marketplace` | Marketplace | HIGH |
| `footer_ai_calculator` | AI Cost Calculator (Free) | MEDIUM |
| `footer_compare_prices` | Compare Material Prices | MEDIUM |
| `footer_request_quote` | Request Quotation (RFQ) | MEDIUM |
| `footer_engage_experts` | Engage with Experts | MEDIUM |
| `footer_conference_hall` | Conference Hall | MEDIUM |
| `footer_find_sellers` | Find Verified Sellers | MEDIUM |
| `footer_find_workers` | Find Skilled Workers | MEDIUM |
| `footer_for_you` | For You | HIGH |
| `footer_how_ebc_helps` | How EBC Helps Families | MEDIUM |
| `footer_planning` | Planning Your Dream Home | MEDIUM |
| `footer_cost_guide` | Cost Estimation Guide | MEDIUM |
| `footer_faqs_builders` | FAQs for Home Builders | MEDIUM |
| `footer_helpful_links` | Helpful Links | HIGH |
| `footer_estimate_cost` | Estimate Cost (Free) | MEDIUM |
| `footer_talk_expert` | Talk to an Expert | MEDIUM |
| `footer_compare_prices_link` | Compare Prices | MEDIUM |
| `footer_support_company` | Support & Company | HIGH |
| `footer_about` | About ECON / EBC | MEDIUM |
| `footer_how_works` | How EBC Works | MEDIUM |
| `footer_contact_support` | Contact Support | MEDIUM |
| `footer_help_faqs` | Help & FAQs | MEDIUM |
| `footer_privacy` | Privacy Policy | MEDIUM |
| `footer_seller_agreement` | Seller Agreement | MEDIUM |
| `footer_safety_policy` | Consumer Safety Policy | MEDIUM |
| `footer_admin_login` | Admin Login | LOW |
| `footer_location` | Location xyz, Kolkata | LOW |
| `footer_phone` | +91 1234567890 | LOW |
| `footer_email` | xyz123.buissness@gmail.com | LOW |
| `footer_disclaimer` | ECON Building Centre (EBC) is a technology-enabled marketplace... | LOW |
| `footer_copyright` | © 2026 ECON Building Centre. All rights reserved. | LOW |
| `footer_made_india` | Made in India • Serving Tier-2 & Tier-3 India | LOW |
| `footer_designed_by` | Designed By : Pink Shadow Media & Entertainment Pvt. Ltd. | LOW |

### 3.4 Problem Section (`src/components/landing/problem-section.tsx`)

| Key | Current Text | Priority |
|-----|--------------|----------|
| `problems_title` | Every home builders faces these problems... | HIGH |
| `problem_1_desc` | Rates vary from shop to shop — impossible to know real price | HIGH |
| `problem_2_desc` | Contractor pushes suppliers where he gets commission | HIGH |
| `problem_3_desc` | Wrong materials lead to cracks, damp, and repairs later | HIGH |
| `problem_4_desc` | Unverified Workers & Contractors | HIGH |
| `problem_5_desc` | Busy scheduled / Working Families feel helpless | HIGH |
| `problem_6_desc` | No proper quotation — just 'aap dekh lijiye' | HIGH |
| `problem_7_desc` | No clear idea of Total Construction Cost | HIGH |
| `problem_8_desc` | Lack of Planning before Starting Construction | HIGH |
| `gamble_text` | Dream home shouldn't feel like a gamble. | HIGH |

### 3.5 Solution/Ecosystem Section (`src/components/landing/ecosystem-section.tsx`)

| Key | Current Text | Priority |
|-----|--------------|----------|
| `ecosystem_title` | Local Construction Eco-System of India | HIGH |
| `ecosystem_subtitle` | ECON Building Centre, Benefits for ALL | HIGH |
| `ecosystem_join_cta` | Join EBC for a Smart & Stress-Free Home Building Journey | HIGH |
| `ecosystem_homeowner_title` | HOMEOWNER (End User) | HIGH |
| `ecosystem_homeowner_subtitle` | Build Better, Save More | MEDIUM |
| `ecosystem_homeowner_benefit_1` | Save Budget & Costs | MEDIUM |
| `ecosystem_homeowner_benefit_2` | Access Verified Professionals | MEDIUM |
| `ecosystem_homeowner_benefit_3` | Get Engineer Guidance & Quality Checks | MEDIUM |
| `ecosystem_homeowner_benefit_4` | Avoid Confusion, Ensure Transparency | MEDIUM |
| `ecosystem_retailer_title` | RETAILER / DEALER (B2C Seller) | HIGH |
| `ecosystem_retailer_subtitle` | Expand Your Reach | MEDIUM |
| `ecosystem_retailer_benefit_1` | Gain New Customers & Orders | MEDIUM |
| `ecosystem_retailer_benefit_2` | Zero Marketing Cost | MEDIUM |
| `ecosystem_retailer_benefit_3` | Fair Price Discovery Platform | MEDIUM |
| `ecosystem_retailer_benefit_4` | Increased Online Visibility | MEDIUM |
| `ecosystem_wholesaler_title` | WHOLESALER (B2B Seller) | HIGH |
| `ecosystem_wholesaler_subtitle` | Bulk Business Made Easy | MEDIUM |
| `ecosystem_wholesaler_benefit_1` | Receive Bulk Leads & Inquiries | MEDIUM |
| `ecosystem_wholesaler_benefit_2` | Data-Driven Pricing Insights | MEDIUM |
| `ecosystem_wholesaler_benefit_3` | Connect with Multiple Dealers | MEDIUM |
| `ecosystem_wholesaler_benefit_4` | Streamlined Logistics Support | MEDIUM |
| `ecosystem_manufacturer_title` | MANUFACTURER (B2B Seller) | HIGH |
| `ecosystem_manufacturer_subtitle` | Strengthen Your Channel | MEDIUM |
| `ecosystem_manufacturer_benefit_1` | Direct Channel Access & Visibility | MEDIUM |
| `ecosystem_manufacturer_benefit_2` | Push Technical Documents & Offers | MEDIUM |
| `ecosystem_manufacturer_benefit_3` | Transparent Market Strength Data | MEDIUM |
| `ecosystem_manufacturer_benefit_4` | Brand Promotion to End Users | MEDIUM |
| `ecosystem_service_title` | SERVICE PROVIDER (Professional) | HIGH |
| `ecosystem_service_subtitle` | Secure More Jobs | MEDIUM |
| `ecosystem_service_benefit_1` | Access Verified Job Requirements | MEDIUM |
| `ecosystem_service_benefit_2` | Better Income & Reliable Payments | MEDIUM |
| `ecosystem_service_benefit_3` | Build Reputation with Ratings & Reviews | MEDIUM |
| `ecosystem_service_benefit_4` | Quality Supervision & Standards | MEDIUM |

### 3.6 How It Works Section (`src/components/landing/how-it-works-section.tsx`)

| Key | Current Text | Priority |
|-----|--------------|----------|
| `how_it_works_title` | How It Works? | HIGH |
| `how_it_works_subtitle` | 3 Simple Steps | MEDIUM |
| `how_it_works_cta` | Start Your Home Journey | HIGH |

### 3.7 Advantages Section (`src/components/landing/advantages-section.tsx`)

| Key | Current Text | Priority |
|-----|--------------|----------|
| `advantages_title` | Top Advantages of EBC | HIGH |
| `advantage_1_title` | Save money | HIGH |
| `advantage_1_desc` | Avoid wrong purchases | MEDIUM |
| `advantage_1_detail` | Save ₹50,000-₹3,00,000 by avoiding wrong purchases | MEDIUM |
| `advantage_2_title` | Everything Online | HIGH |
| `advantage_2_desc` | From quotes to hiring | MEDIUM |
| `advantage_2_detail` | Everything from online from quotations to hiring | MEDIUM |
| `advantage_3_title` | Engineer Help | HIGH |
| `advantage_3_desc` | Seamless constructions | MEDIUM |
| `advantage_3_detail` | Enjoy seamless constructions without errors | MEDIUM |
| `advantage_4_title` | Trusted Hirement | HIGH |
| `advantage_4_desc` | Rated and reviewed | MEDIUM |
| `advantage_4_detail` | Rated and reviewed manpower, no random hiring | MEDIUM |
| `advantages_footer` | A better home. A better decision. A better sleep at night. | MEDIUM |

### 3.8 Materials Section (`src/components/landing/materials-section.tsx`)

| Key | Current Text | Priority |
|-----|--------------|----------|
| `materials_title` | Major Construction Materials | HIGH |
| `materials_cta` | Select your Products | HIGH |

**Note**: Material names (Ultratech Cement, TMT bar, etc.) and categories should remain in English as they are brand/product names.

### 3.9 Services Section

**Note**: Need to verify if a separate Services section component exists. Check `src/components/landing/services-section.tsx`.

### 3.10 Pricing Section

**Note**: Need to verify if a Pricing section component exists. Check `src/components/landing/pricing-section.tsx`.

### 3.11 FAQ Section (`src/components/landing/faq-section.tsx`)

All FAQ content is already translated in `config.ts`:

| Key | Priority |
|-----|----------|
| `faq_title` | HIGH |
| `faq_1_q` / `faq_1_a` | HIGH |
| `faq_2_q` / `faq_2_a` | HIGH |
| `faq_3_q` / `faq_3_a` | HIGH |
| `faq_4_q` / `faq_4_a` | HIGH |
| `faq_5_q` / `faq_5_a` | HIGH |
| `faq_6_q` / `faq_6_a` | HIGH |
| `faq_7_q` / `faq_7_a` | HIGH |
| `faq_8_q` / `faq_8_a` | HIGH |
| `faq_9_q` / `faq_9_a` | HIGH |
| `faq_10_q` / `faq_10_a` | HIGH |
| `faq_bonus_q` / `faq_bonus_a` | MEDIUM |
| `faq_still_questions` | MEDIUM |

### 3.12 Reviews Section

**Note**: Need to verify if a Reviews section component exists. Check `src/components/landing/reviews-section.tsx`.

---

## 4. Priority Classification

### HIGH Priority
- All H1, H2 headings
- Primary CTA buttons
- Navigation menu items
- Section titles
- Footer column headers

### MEDIUM Priority
- Card headers and titles
- Descriptions and body text
- Secondary CTAs
- Feature bullet points
- Footer links

### LOW Priority
- Small labels
- Helper text
- Placeholder text
- Copyright notices
- Social media labels

---

## 5. File Structure

```
src/i18n/
├── config.ts          # Updated i18next configuration
├── locales/
│   ├── en.json        # English translations (en-IN)
│   └── hn.json        # Hinglish translations (hn-IN)
```

### Proposed JSON Structure

```json
// src/i18n/locales/en.json
{
  "common": {
    "language": "Language",
    "english": "English",
    "hinglish": "Hinglish",
    "login": "Login"
  },
  "nav": {
    "home": "Home",
    "materials": "Materials",
    "services": "Services",
    ...
  },
  "hero": {
    "title": "...",
    "subtitle": "...",
    ...
  },
  "footer": {
    "brand": { ... },
    "columns": { ... },
    ...
  }
}
```

---

## 6. Next Steps

1. **Extract translations** from `config.ts` into `en.json` and `hn.json`
2. **Restructure JSON** by feature/section for better maintainability
3. **Add missing keys** identified in Section 3
4. **Update components** to use translation keys
5. **Test language switching** thoroughly
6. **Add TypeScript types** for translation keys
7. **Consider adding** Hindi script support (hi-IN) in the future

---

## 7. Notes

- The current Hinglish (`hn-IN`) uses Hindi words written in English script (Roman Hindi). This is the preferred approach for the target audience.
- Some content like brand names (Ultratech, TMT), technical terms, and product names should remain in English.
- Consider using namespacing in JSON files for better organization as the translation file grows.
