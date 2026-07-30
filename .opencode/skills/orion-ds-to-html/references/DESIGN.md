---
name: Orion Design System
version: alpha
description: Professional UI system for planning and resource management tools. Clean, functional, minimal decoration.
colors:
  # Primary
  primary: "#013aba"
  on-primary: "#ffffff"
  primary-container: "#eaf0ff"
  on-primary-container: "#263f7a"
  # Neutral / Surface
  surface: "#ffffff"
  on-surface: "#1d2024"
  on-surface-variant: "#48546d"
  outline: "#dee2e9"
  outline-dark: "#373b44"
  neutral-container: "#e6e8eb"
  muted: "#8e96a3"
  dark-text: "#121316"
  # Info
  info-container: "#e0e7ff"
  on-info: "#150792"
  info-link: "#3e2bc5"
  # Warning
  warning-container: "#fff4e5"
  on-warning: "#8f2800"
  # Error
  error-container: "#ffe5e5"
  on-error: "#9f0712"
  # Success
  success-container: "#e8fdef"
  on-success: "#017437"
  success-link: "#015b2b"
  success-border: "#008236"
  success-border-hover: "#006a2b"
typography:
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1rem
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.25rem
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5rem
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1rem
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.25rem
  label-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.5rem
rounded:
  sm: 6px        # layout/radius/sm — general components (alerts, cards, tags, modals, form fields)
  full: 999px    # layout/radius/full — pill shapes (chips, badges)
  # Note: buttons use 4px (component-scoped: button/filled/container/shape), not a global token
spacing:
  none: 0px      # layout/padding/none
  2xs: 2px       # layout/padding/2xs
  xs: 4px        # layout/padding/xs
  sm: 6px        # layout/padding/sm
  md: 8px        # layout/padding/md
  lg: 12px       # layout/padding/lg
  xl: 14px       # layout/padding/xl
  2xl: 16px      # layout/padding/2xl
  3xl: 18px      # layout/padding/3xl
  4xl: 20px      # layout/padding/4xl
  5xl: 24px      # layout/padding/5xl
---

## Overview

Orion is a professional, structured UI system for planning and resource management tools (home care services). The visual language is clean, functional, and minimal — no decorative flourishes. It follows Material Design 3 conventions for color semantics (container/on-container pairs).

Single font family: **Inter**. Two weights only: 400 (regular) and 500 (medium).

## Colors

The palette follows a container/on-container pattern:

- **Primary (#013aba):** Main actions, active navigation, links, sidelines. On-primary is white.
- **Primary container (#eaf0ff):** Tonal button backgrounds, tag backgrounds. Text uses on-primary-container (#263f7a).
- **On-surface (#1d2024):** Default text color, card titles.
- **On-surface-variant (#48546d):** Secondary text, metadata, outlined button text, muted icons.
- **Outline (#dee2e9):** Borders, dividers, outlined button borders.
- **Semantic colors:** Each type (info, warning, error, success) has a `container` (light tint background) and `on-` (dark text/icon) pair.

## Typography

Only 3 production font sizes: 12px (body-sm/label-sm), 14px (body-md/label-md), 16px (body-lg/label-lg). The difference between body and label is weight (400 vs 500).

## Layout & Spacing

Spacing scale from Figma `layout/padding/*` tokens: 0 / 2 / 4 / 6 / 8 / 12 / 14 / 16 / 18 / 20 / 24 px. Use only these values for padding, margin, and gap. Component CSS may use computed values (e.g., indentation multiples, border compensation) — these are component-scoped, not global tokens.

## Shapes

Two global border-radius values:
- **6px (sm):** General components — alerts, cards, tags, modals, form fields
- **999px (full):** Pill shapes — chips, badges

Buttons use **4px** border-radius, defined as a component-scoped Figma variable (`button/filled/container/shape`), not a global token.

## Components

Component styles are defined in `css/*.css` (one file per component, plus `css/theme.css` for shared tokens). Component documentation is in `components/*.md`. See `components/index.md` for the catalog.

## Do's and Don'ts

- Do use only the defined spacing scale (0/2/4/6/8/12/14/16/18/20/24). Never hardcode arbitrary pixel values outside this scale.
- Do use `primary` for one CTA per screen zone maximum. Secondary actions use `outlined` or `ghost`.
- Do maintain 4.5:1 contrast ratio on all text.
- Don't mix rounded values — buttons get 4px, everything else gets 6px (or 999px for pills).
- Don't use primary color for decorative elements.
- Don't invent new color values — always reference the palette above.
- Do use Material Symbols Outlined for all icons, with `font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20`.
- Do use a universal 150ms transition duration for all interactive state changes (hover, focus, active).

### State Layer Pattern

Interactive elements use a `::after` overlay for hover/focus/active states:
- **Hover:** 8% opacity overlay
- **Focus / Active:** 10% opacity overlay
- **Disabled background:** 12% opacity overlay on on-surface
- **Disabled text:** 38% opacity on the normal text color
