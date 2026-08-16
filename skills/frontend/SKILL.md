---
name: frontend
description: Governs frontend development, component hierarchy, design system tokens, responsive styling, and state management.
---

# Frontend Engineering Skill

Activate this skill when creating or modifying user interfaces, client components, styles, design tokens, or frontend state.

## 1. UI Reuse & Styling Policy
- **Check `.ai/UI.md` first:** Identify the established styling system (Tailwind CSS, CSS Modules, Styled Components, shadcn/ui, MUI, etc.).
- **Do NOT introduce secondary styling frameworks:** If the project uses Tailwind, do not import Bootstrap or Emotion.
- **Component Reuse:** Reuse existing buttons, dialogs, form fields, toasts, and loading skeletons before building new primitives.

## 2. Component Design & State
- Separate presentation components from business logic and data fetching.
- Keep components focused and single-responsibility.
- Handle loading, error, and empty states cleanly.
- Use framework-recommended data fetching patterns (e.g. Next.js Server Components, React Query / SWR).
