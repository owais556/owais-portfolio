import localFont from 'next/font/local';

/**
 * Fontsource supplies versioned files through npm; next/font/local adds
 * preload tags and metric-adjusted fallbacks without contacting Google during
 * the build. Keep these paths on the Latin variable files so adding a family
 * does not silently preload every script Fontsource ships.
 */
export const bricolage = localFont({
  src: '../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2',
  variable: '--font-bricolage',
  weight: '200 800',
  style: 'normal',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial'],
  adjustFontFallback: 'Arial',
});

export const newsreader = localFont({
  src: '../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2',
  variable: '--font-newsreader',
  weight: '200 800',
  style: 'normal',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman'],
  adjustFontFallback: 'Times New Roman',
});

export const jetbrainsMono = localFont({
  src: '../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
  variable: '--font-jetbrains',
  weight: '100 800',
  style: 'normal',
  display: 'swap',
  fallback: ['SFMono-Regular', 'Consolas'],
  adjustFontFallback: 'Arial',
});

/**
 * Authored italics: the long-form prose in `app/writing` and the hero tagline.
 * `preload: false` is what keeps a 64 KB face off every page's critical path —
 * the variable may hang off `<html>` because defining a custom property costs
 * nothing, and only the pages that actually set `font-style: italic` download
 * the file. Without this face those pages get a browser-synthesized oblique.
 */
export const newsreaderItalic = localFont({
  src: '../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2',
  variable: '--font-newsreader-italic',
  weight: '200 800',
  style: 'italic',
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'Times New Roman'],
  adjustFontFallback: 'Times New Roman',
});
