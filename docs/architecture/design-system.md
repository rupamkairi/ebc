# Design System Documentation

This document provides comprehensive guidance for maintaining design consistency across the EBC application. All developers should follow these guidelines to ensure a cohesive user experience.

---

## 1. Design System Overview

### Brand Colors

| Role | Color | Hex Code | Usage |
|------|-------|----------|-------|
| **Primary** | Blue | `#3d52a0` | Headings, CTAs, primary actions, sidebar, focus rings |
| **Secondary** | Orange/Amber | `#ffa500` | Accent elements, badges, highlights, secondary buttons |
| **Background** | Light Gray | `#f8f9fc` | Page background |
| **Surface** | White | `#ffffff` | Cards, popovers, dropdowns |
| **Text Primary** | Dark Gray | `#2b2a2a` | Body text, headings |
| **Text Muted** | Blue-Gray | `#5a6080` | Secondary text, captions |
| **Border** | Light Blue-Gray | `#dde0ec` | Input borders, dividers |

### Semantic Tokens

The design system uses CSS custom properties (CSS variables) as semantic tokens. These tokens abstract the actual color values, allowing for easy theming and maintenance.

**Available Semantic Tokens:**

| Token | Purpose |
|-------|---------|
| `--primary` | Primary brand color (#3d52a0) |
| `--primary-foreground` | Text color on primary (#ffffff) |
| `--secondary` | Secondary accent color (#ffa500) |
| `--secondary-foreground` | Text on secondary (#1a1a1a) |
| `--background` | Page background (#f8f9fc) |
| `--foreground` | Primary text (#2b2a2a) |
| `--card` | Card surface (#ffffff) |
| `--card-foreground` | Text on card |
| `--muted` | Muted backgrounds (#e8eaf0) |
| `--muted-foreground` | Muted text (#5a6080) |
| `--accent` | Hover states (#eef0f8) |
| `--accent-foreground` | Text on accent |
| `--border` | Border color (#dde0ec) |
| `--input` | Input background/border |
| `--destructive` | Error states (#d32f2f) |
| `--ring` | Focus ring color |

---

## 2. Color Usage Guidelines

### DO: Use Semantic Tokens

Always use Tailwind's semantic token utilities when applying colors. This ensures consistency and makes future theme changes easy.

```tsx
// ✅ CORRECT - Using semantic tokens
<div className="bg-primary text-primary-foreground">
  Primary background with white text
</div>

<button className="bg-secondary text-secondary-foreground">
  Orange accent button
</button>

<div className="bg-card border-border">
  Card with border
</div>

<button className="hover:bg-primary/90">
  Hover state with opacity
</button>
```

### DON'T: Use Hardcoded Hex Colors

Avoid hardcoding the brand colors directly in components. This creates inconsistency and makes theming difficult.

```tsx
// ❌ INCORRECT - Hardcoded colors
<div className="bg-[#3d52a0] text-white">
  Hardcoded primary
</div>

<button className="bg-[#ffa500] text-[#1a1a1a]">
  Hardcoded secondary
</button>
```

### Exception: Custom Component Styles

The `src/styles/app-theme.css` file contains some legacy hardcoded colors for specific component patterns (combobox, dropdown). These are documented here for reference but should be migrated to use semantic tokens when those components are next updated.

---

## 3. Component Patterns

### Cards

Use the `.card-app` class or the `bg-card` token for card surfaces.

```tsx
// ✅ Using .card-app class (from app-theme.css)
<div className="card-app p-6">
  Content
</div>

// ✅ Using semantic tokens
<div className="bg-card border-border rounded-2xl p-6 shadow-md">
  Content
</div>
```

### Buttons

Always use `buttonVariants` from the UI button component. Never style buttons directly with Tailwind classes.

```tsx
import { buttonVariants } from "@/components/ui/button"

// Primary button (default)
<button className={buttonVariants()}>
  Submit
</button>

// Secondary variant
<button className={buttonVariants({ variant: "secondary" })}>
  Cancel
</button>

// Outline variant
<button className={buttonVariants({ variant: "outline" })}>
  View Details
</button>

// Destructive variant
<button className={buttonVariants({ variant: "destructive" })}>
  Delete
</button>

// Ghost variant
<button className={buttonVariants({ variant: "ghost" })}>
  Edit
</button>

// Link variant
<button className={buttonVariants({ variant: "link" })}>
  Learn more
</button>
```

### Inputs

Use the `Input` component from the UI library.

```tsx
import { Input } from "@/components/ui/input"

// Basic input
<Input placeholder="Enter your name" />

// With custom styling via className
<Input 
  className="bg-background border-border" 
  placeholder="Search..." 
/>
```

### Other UI Components

The UI library (`src/components/ui/`) provides consistent, themed components:

- `Button` - Themed button with variants
- `Input` - Styled text input
- `Card` - Card container components
- `Dialog` - Modal dialogs
- `DropdownMenu` - Dropdown menus
- `Select` - Selection dropdowns
- `Combobox` - Searchable selection

**Always prefer using these UI components over building custom styled elements.**

---

## 4. Theme Variants

EBC uses two theme configurations depending on the section of the application:

### Default Theme (Admin Dashboard)

**File:** `src/app/globals-admin.css`

The admin dashboard uses the default Shadcn/UI theme with these key differences:

| Token | Admin Theme | App Theme |
|-------|-------------|-----------|
| Primary | `#024caa` | `#3d52a0` |
| Secondary | `#ec8305` | `#ffa500` |
| Background | `#f5f2f2` | `#f8f9fc` |

**Route:** `src/app/(dashboard)/admin-dashboard/**`

### App Theme (EBC Brand)

**File:** `src/app/globals.css`

The main application uses EBC's brand colors for buyer, seller, and public-facing pages.

**Routes:** All routes except admin dashboard

---

## 5. CSS Files Reference

### `src/app/globals.css`

Main application theme with EBC brand colors.

- Primary: `#3d52a0` (blue)
- Secondary: `#ffa500` (orange)
- Background: `#f8f9fc` (light gray)
- Card: `#ffffff` (white)

### `src/app/globals-admin.css`

Admin dashboard theme (default Shadcn colors).

- Primary: `#024caa` (darker blue)
- Secondary: `#ec8305` (darker orange)
- Background: `#f5f2f2` (warm gray)

### `src/styles/app-theme.css`

Custom component styles that extend the base theme.

Contains:
- `.card-app` - Premium card styling
- `.combobox-*` - Custom combobox styles
- `.dropdown-content-app` - Styled dropdowns
- `.dialog-content-app` - Styled dialogs

---

## 6. How to Apply Colors

### Primary Color Applications

```tsx
// Background
<div className="bg-primary">...</div>

// Text
<p className="text-primary">...</p>

// Border
<div className="border-primary">...</div>

// Hover states
<button className="hover:bg-primary/90">...</button>
```

### Secondary Color Applications

```tsx
// Background
<div className="bg-secondary">...</div>

// Text
<p className="text-secondary">...</p>

// Hover
<button className="hover:bg-secondary/90">...</button>
```

### Using Opacity Modifiers

Tailwind's opacity modifiers work with CSS variables:

```tsx
// Semi-transparent text
<p className="text-primary/60">Muted primary text</p>

// Subtle backgrounds
<div className="bg-primary/5">Very light primary tint</div>

// Subtle borders
<div className="border-primary/10">Subtle primary border</div>

// Hover with opacity
<button className="hover:bg-primary/90">...</button>
```

### Complete Example

```tsx
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ExampleForm() {
  return (
    <div className="bg-card p-6 rounded-2xl border-border shadow-md">
      <h2 className="text-primary text-xl font-semibold mb-4">
        Contact Us
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-foreground text-sm font-medium">
            Email
          </label>
          <Input 
            className="mt-1" 
            placeholder="you@example.com" 
          />
        </div>
        <button className={buttonVariants()}>
          Submit
        </button>
      </div>
    </div>
  )
}
```

---

## 7. Files Using Consistent Design System

The following files have been updated to follow the design system guidelines:

### Core Theme Files
- `src/app/globals.css` - Main app theme with EBC brand colors
- `src/app/globals-admin.css` - Admin theme (Shadcn defaults)
- `src/styles/app-theme.css` - Custom component styles

### UI Components
- `src/components/ui/button.tsx` - Button with variants
- `src/components/ui/input.tsx` - Styled input
- `src/components/ui/card.tsx` - Card components
- `src/components/ui/dialog.tsx` - Dialog/modal
- `src/components/ui/dropdown-menu.tsx` - Dropdown menus

### Layout Components
- `src/components/layouts/*` - Dashboard layouts use semantic tokens
- `src/components/shared/footer.tsx` - Footer with brand colors
- `src/components/landing/*` - Landing page sections

### Dashboard Components
- `src/components/dashboard/admin/*` - Admin dashboard widgets
- `src/components/dashboard/buyer/*` - Buyer dashboard
- `src/components/dashboard/seller/*` - Seller dashboard

---

## 8. Admin Dashboard Exception

The admin dashboard section uses a different theme from the rest of the application.

### What Stays on Default Theme

**Route:** `src/app/(dashboard)/admin-dashboard/**`

This section uses `globals-admin.css` which has different color values:

| Token | App Theme | Admin Theme |
|-------|-----------|-------------|
| Primary | `#3d52a0` | `#024caa` |
| Secondary | `#ffa500` | `#ec8305` |
| Background | `#f8f9fc` | `#f5f2f2` |

### Why This Exists

The admin dashboard was built with Shadcn/UI defaults and serves internal operations. The different theme:

- Provides visual distinction between public-facing pages and internal tools
- Maintains compatibility with admin-specific components
- Allows for future admin-specific theming without affecting the main app

### Adding New Admin Pages

When creating new admin dashboard pages, ensure they use the admin layout which applies `globals-admin.css`:

```tsx
// src/app/(dashboard)/admin-dashboard/users/page.tsx
export default function AdminUsersPage() {
  // This page automatically uses admin theme
  return <div className="p-6">Admin content</div>
}
```

---

## Quick Reference Card

| Task | Use This |
|------|----------|
| Card background | `bg-card` or `.card-app` |
| Primary button | `buttonVariants()` |
| Secondary button | `buttonVariants({ variant: "secondary" })` |
| Input field | `<Input />` from ui/input |
| Page background | `bg-background` |
| Text color | `text-foreground`, `text-muted-foreground` |
| Border | `border-border` |
| Hover primary | `hover:bg-primary/90` |
| Hover secondary | `hover:bg-secondary/90` |
| Admin pages | Uses `globals-admin.css` automatically |

---

## Questions?

If you're unsure about design system usage:

1. Check existing components in `src/components/ui/` for patterns
2. Review `src/app/globals.css` for available tokens
3. Look at `docs/architecture/codemap.md` for component locations
4. Examine similar pages in the codebase for implementation examples
