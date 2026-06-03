# RabittoPetStore — Design System

## Color Palette

| Role | Name | Hex | OKLCH approx | Usage |
|------|------|-----|--------------|-------|
| Primary accent | Gold | #fca311 | oklch(0.78 0.16 60) | Primary CTAs, active states, key highlights |
| Background deep | Black | #000000 | oklch(0.02 0.003 264) | Page backgrounds, strong surfaces |
| Background mid | Prussian Blue | #14213d | oklch(0.18 0.06 264) | Cards, panels, nav backgrounds |
| Surface light | Alabaster Grey | #e5e5e5 | oklch(0.91 0.003 264) | Input backgrounds, dividers, secondary surfaces |
| Text primary | White | #ffffff | oklch(0.99 0.003 264) | Primary text on dark backgrounds |

## Color Strategy

**Committed** — Gold (#fca311) carries 30–50% of interactive surface. Primary buttons, focus rings, key active states. Neutral surfaces (deep navy, near-black) host the gold without competing.

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

1. **Base**: `oklch(0.02 0.003 264)` — page background (near-black)
2. **Panel**: `oklch(0.18 0.06 264)` — cards, panels (Prussian Blue)
3. **Raised**: panel + subtle border `oklch(0.91 0.003 264 / 0.12)` — floating elements

## Component Tokens

- **Primary button**: bg `#fca311`, text `#000000`, font-weight 600
- **Input**: bg transparent, border `oklch(0.91 0.003 264 / 0.2)`, text white, focus ring `#fca311`
- **Input placeholder**: `oklch(0.91 0.003 264 / 0.4)`
- **Error**: `oklch(0.65 0.22 25)` (red, no hex override needed)
- **Border radius**: 6px components, 12px cards, 4px inputs

## Motion

- Transitions: 150ms ease-out for state changes (hover, focus)
- No decorative animation on the auth surface
