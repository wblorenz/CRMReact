---
name: styling-and-design
description: Guidelines for styling React components using premium HSL palettes, smooth transitions, and modern typography.
---

# Styling & Visual Design System

Use this skill when designing or updating frontend components in [crmreact.client](file:///E:/Fontes/CRMReact/crmreact.client) to ensure a stunning, high-end visual aesthetic.

## HSL Tailored Palette
Avoid generic colors. Use carefully selected HSL color tokens defined as CSS variables in [index.css](file:///E:/Fontes/CRMReact/crmreact.client/src/index.css):
*   **Backgrounds**: Dark charcoal/slate (`hsl(222, 47%, 11%)`) and clean whites (`hsl(0, 0%, 100%)`).
*   **Accents**: Premium indigo (`hsl(243, 75%, 59%)`) or violet (`hsl(263, 70%, 50%)`).
*   **Cards**: Semi-transparent overlays (glassmorphism) using `backdrop-filter: blur(10px)`.

## Micro-Animations
Implement fluid transitions to make the UI feel responsive and alive:
*   Use `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)` on hover/active states.
*   Animate sidebar link hover indicators and popup entries using CSS keyframes.

## Typography
*   Import and use modern typography (e.g., Inter, Outfit) instead of browser defaults.
*   Enforce structured font-weights (regular: 400, medium: 500, bold: 700).
