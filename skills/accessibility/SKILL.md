---
name: accessibility
description: Enforces web accessibility (a11y), WCAG 2.1 AA guidelines, keyboard navigation, focus management, semantic HTML, and ARIA patterns.
---

# Accessibility (a11y) Skill

Activate this skill when creating or modifying interactive UI components, forms, modal dialogs, menus, navigation, or visual styling.

## 1. Semantic HTML First
- Prefer native HTML elements (`<button>`, `<nav>`, `<main>`, `<dialog>`, `<header>`, `<article>`) over `<div>` or `<span>` with click handlers.
- Do NOT add redundant ARIA attributes when native HTML elements provide implicit roles (e.g. avoid `<button role="button">`).

## 2. Keyboard & Focus Management
- Ensure all interactive controls are reachable and operable via keyboard (`Tab`, `Enter`, `Space`, `Escape`, arrow keys).
- Trap focus inside active modal dialogs and restore focus to the triggering element upon closure.
- Provide clear visible `:focus-visible` styling.

## 3. Forms & Media
- Ensure every form input has an associated `<label for="...">` or `aria-labelledby`.
- Provide meaningful `alt` text for informative images; use empty `alt=""` for purely decorative images.
- Ensure color contrast meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text).
