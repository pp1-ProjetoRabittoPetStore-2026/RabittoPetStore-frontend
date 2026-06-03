/** Brand color tokens — Black & Gold Elegance palette.
 *  Use these for dark surfaces and semantic colors across all pages.
 *  For the gold accent scale, use colorPalette="brand" on Chakra components.
 */
export const tokens = {
  // Surfaces
  pageBg:      'oklch(0.06 0.02 264)',
  panelBg:     '#14213d',
  panelBorder: 'oklch(0.28 0.05 264)',

  // Inputs
  inputBg:     'oklch(0.11 0.03 264)',
  inputBorder: 'oklch(0.24 0.05 264)',

  // Text
  textPrimary: 'oklch(0.97 0.003 264)',
  textMuted:   'oklch(0.50 0.006 264)',

  // Accent (gold)
  accent:      '#fca311',
  accentGlow:  'oklch(0.78 0.16 60 / 0.22)',

  // Error
  errorText:    'oklch(0.65 0.22 25)',
  errorSurface: 'oklch(0.65 0.22 25 / 0.07)',
  errorBorder:  'oklch(0.65 0.22 25 / 0.30)',
  errorGlow:    'oklch(0.65 0.22 25 / 0.18)',
} as const;
