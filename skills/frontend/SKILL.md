---
name: frontend
description: Governs frontend development, component hierarchy, design system tokens, responsive styling, state management, and web performance optimization.
---

# Frontend Engineering Skill

Activate this skill when creating or modifying user interfaces, client components, styling systems, design tokens, or frontend state.

> **Operational Directive:** *Build responsive, accessible, and high-performance interfaces adhering strictly to the project's single design system.*

---

## 1. Single Design System & Styling Invariant

* **Inspect `.ai/UI.md` first:** Identify the established styling framework (Tailwind CSS, CSS Modules, Styled Components, Vanilla CSS, shadcn/ui).
* **Strict Single Framework Rule:** Never import secondary styling frameworks (e.g. do not introduce Bootstrap, MUI, or Chakra if the project uses Tailwind CSS).
* **Token Consistency:** Use centralized theme variables and design tokens for spacing, typography, colors, shadows, and border radii.

---

## 2. Component Hierarchy & Separation of Concerns

Structure UI components using the **Smart Container vs Presentational Component** pattern:

```
┌────────────────────────────────────────────────────────┐
│ Smart / Container Component                            │
│ - Handles data fetching, URL query params, hooks       │
│ - Passes data and event callbacks to UI components     │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Presentational / Dumb Component                        │
│ - Pure visual rendering, receives data via props       │
│ - Completely stateless or localized animation state    │
│ - High reusability across pages                        │
└────────────────────────────────────────────────────────┘
```

---

## 3. Performance & Core Web Vitals Optimization

* **Cumulative Layout Shift (CLS):** Always set explicit `width` and `height` (or aspect-ratio) on images, videos, and embed frames to eliminate visual jank.
* **Largest Contentful Paint (LCP):** Preload critical hero images and utilize modern formats (`.webp`, `.avif`).
* **Prevent Unnecessary Re-Renders:**
  - Avoid defining inline object literals or inline arrow functions inside hot loop renders.
  - Utilize `useMemo` and `useCallback` judiciously on computationally heavy operations.
* **Loading & Error State Ergonomics:** Every async component must gracefully handle 4 distinct states:
  1. Initial Loading (Skeleton placeholder, no layout shift)
  2. Data Rendered (Normal view)
  3. Empty State (Friendly message with actionable CTA)
  4. Error State (Clear feedback with retry button)
