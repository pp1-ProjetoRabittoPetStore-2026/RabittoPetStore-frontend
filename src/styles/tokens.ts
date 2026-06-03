/** Brand color tokens — Golden Summer Fields palette.
 *  Warm muted olive-greens and golden beige; Light Bronze accent for primary actions.
 */
export const tokens = {
  // Surfaces
  pageBg:      '#fefae0',                // Cornsilk — page background
  panelBg:     '#faedcd',                // Papaya Whip — cards, panels, nav
  panelBorder: '#e9edc9',                // Beige — dividers, borders

  // Inputs
  inputBg:     '#faedcd',                // Papaya Whip — slight depth vs page bg
  inputBorder: '#ccd5ae',                // Dry Sage — warm visible border

  // Text
  textPrimary: 'oklch(0.20 0.03 80)',    // dark warm brown (derived)
  textMuted:   'oklch(0.40 0.05 80)',    // medium warm brown (derived)

  // Accent (Light Bronze)
  accent:      '#d4a373',
  accentGlow:  'oklch(0.73 0.08 65 / 0.25)',

  // Error
  errorText:    'oklch(0.55 0.22 25)',
  errorSurface: 'oklch(0.55 0.22 25 / 0.07)',
  errorBorder:  'oklch(0.55 0.22 25 / 0.30)',
  errorGlow:    'oklch(0.55 0.22 25 / 0.18)',
} as const;
