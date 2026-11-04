---
"name": "Pagelove App Foundations"
"colors":
  "primary": "#334155"
  "neutral": "#ffffff"
  "accent": "#1f64f1"
  "border": "#cbd5e1"
"typography":
  "heading":
    "fontFamily": "Source Serif 4"
    "fontSize": "2rem"
    "fontWeight": 400
    "lineHeight": 1.2
  "body":
    "fontFamily": "Inter"
    "fontSize": "1rem"
    "fontWeight": 400
    "lineHeight": 1.5
"rounded":
  "card": "12px"
  "button": "100px"
"spacing":
  "small": "8px"
  "medium": "16px"
  "large": "32px"
---

# Pagelove App Foundations

## Overview

Build calm, readable applications with visible structure and one clear next action per task. Pair editorial serif headings with precise sans-serif controls and monospace technical examples. Prefer meaningful content, neutral separators and generous spacing over decorative panels. The values above describe the selected starting style; the complete scales and roles live in the token files.

Default: the supplied public app library. Dark mode is available through semantic theme roles, not automatic color inversion. Optional editorial and invitation profiles retain a distinct brand palette.

## Colors

Use purpose-named text, background, button, border and status roles. Keep panels neutral. Use functional color on error/focus/selection states with explicit labels, not decorative card rails. The app library provides independent light and dark role mappings. Check contrast in each actual composition; a palette value is not a blanket accessibility approval.

## Typography

Use the declared serif for headings, sans-serif for body and controls, and monospace for code. Start body text at 16px with a 1.5 line-height and normal tracking. Allow headings and labels to wrap. Bundle licensed fonts for exact rendering or keep the documented system fallbacks. Avoid squeezing long content into small captions.

## Layout

Use the published website grid: 4 columns at 320–479px, 8 at 480–1023px, and 12 from 1024px. Gutters are 16px on smaller screens and 24px on desktop. Outer margins are 16px, 32px and 64px by range. Console layouts retain 16px gutters/margins. Stack dense regions on narrow screens; use natural scrolling and preserve browser zoom.

Use meaningful semantic HTML for document-based application content, stable resource IDs and DOM-backed editing. Keep efficient specialized runtimes where justified. Token JSON is design interchange, not the default application domain model. Read docs/document-first.md when implementing persistence and editors.

## Elevation & Depth

Favor flat surfaces, whitespace and thin neutral borders. Use small shadows only when they communicate layering. Avoid glossy device frames, continuous ambient motion and gradients that dominate a reading surface. Honor reduced motion while preserving visible loading and status text.

## Shapes

Buttons may be pill-shaped; utility icon actions can be rounded or squared. Cards have subtly rounded corners. Keep control hit regions at least 44px as a design default, independently of icon size. Do not infer physical size or native dp/sp from CSS pixels.

## Components

Use native buttons for actions and links for navigation. Support default, hover, pressed, focus, disabled and loading states. Keep labels available during pending work. Forms need visible labels, associated hints/errors and current-value serialization. Passwords use native masking; verification codes should support paste and autofill. Group related checkboxes/radios with a legend; use named switches for settings.

Progress must distinguish indeterminate work, actual percent, completion and failure. A local preview or accepted request is not proof of shared persistence or delivery. Preserve dirty work and provide a recovery action after conflicts or failures.

## Do's and Don'ts

- Do use the canonical tokens, public component contracts and meaningful status labels.
- Do make the primary task usable with keyboard, narrow layouts and enlarged text.
- Do show loading, empty, error and recovery states with useful next steps.
- Do retain original design files and add portable exports with explicit conversion limits.
- Do not add decorative northeast arrow icons or colored panel side rails.
- Do not invent backend capabilities, supported imports or verification results.
- Do not include private account metadata, operating procedures or non-Pagelove repository links.
