# RabittoPetStore — Design System

## Color Palette

| Role | Name | Hex | OKLCH approx | Usage |
|------|------|-----|--------------|-------|
| Primary accent | Light Bronze | #d4a373 | oklch(0.73 0.08 65) | Primary CTAs, focus rings, active states |
| Background page | Cornsilk | #fefae0 | oklch(0.98 0.02 95) | Page background |
| Surface | Papaya Whip | #faedcd | oklch(0.95 0.03 85) | Cards, panels, nav, input fills |
| Border | Beige | #e9edc9 | oklch(0.92 0.03 115) | Dividers, panel borders |
| Input border | Dry Sage | #ccd5ae | oklch(0.83 0.05 120) | Input borders, structural accents |
| Text primary | Warm brown (derived) | — | oklch(0.20 0.03 80) | Primary text |
| Text muted | Medium warm (derived) | — | oklch(0.40 0.05 80) | Labels, descriptions, secondary text |

## Color Strategy

**Restrained** — warm muted neutrals dominate. Light Bronze (`#d4a373`) appears on primary CTAs, focus rings, and key interactive states only. Derived dark warm brown covers all primary text. Olive-green notes (Dry Sage, Beige) handle structure without chromatic noise.

## Typography

System font stack: `Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Scale ratio: 1.2 (tight — product UI with many elements)

| Step | Size | Weight | Usage |
|------|------|--------|-------|
| xs | 12px | 400 | Captions, metadata |
| sm | 14px | 400/500 | Labels, secondary text |
| md | 16px | 400 | Body, inputs |
| lg | 20px | 600 | Section headings |
| xl | 28px | 700 | Page headings |
| 2xl | 36px | 700 | Auth/hero headings |

## Elevation / Surfaces

Light theme. Surfaces step from page to panel; structure through border not shadow.

1. **Base**: `#fefae0` (Cornsilk) — page background
2. **Panel**: `#faedcd` (Papaya Whip) — cards, panels, nav backgrounds
3. **Border**: `#e9edc9` (Beige) — dividers; input borders use Dry Sage (`#ccd5ae`)

## Component Tokens

- **Primary button**: bg `#d4a373`, text `#000000`, font-weight 700
- **Input**: bg `#faedcd`, border `#ccd5ae`, text `oklch(0.20 0.03 80)`, focus ring `#d4a373`
- **Input placeholder**: `oklch(0.58 0.04 80)` (warm muted brown)
- **Error**: `oklch(0.55 0.22 25)` (red)
- **Border radius**: 6px components, 12px cards, 4px inputs

## Motion

- Transitions: 150ms ease-out for state changes (hover, focus)
- No decorative animation on the auth surface
