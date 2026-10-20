import type { ThemeSettings } from './types'

export type Preset = ThemeSettings & { id: string; tagline: string }

export const PRESETS: Preset[] = [
  {
    id: 'liquid',
    name: 'Liquid Glass',
    tagline: 'Bright rim, deep blur — the signature look',
    mode: 'dark',
    accent: '#4cc2ff',
    wallpaper: 'aurora',
    wallpaperDim: 22,
    wallpaperBlur: 0,
    glass: {
      blur: 30, saturation: 185, brightness: 112, opacity: 14,
      tint: '#dfe9ff', radius: 14, rim: 1.2, specular: 58,
      shadow: 55, noise: 4, lens: 55,
    },
  },
  {
    id: 'frosted',
    name: 'Frosted Mica',
    tagline: 'Close to inbox Windows 11, just softer',
    mode: 'dark',
    accent: '#60cdff',
    wallpaper: 'chrome',
    wallpaperDim: 14,
    wallpaperBlur: 0,
    glass: {
      blur: 44, saturation: 125, brightness: 100, opacity: 62,
      tint: '#1c1c22', radius: 8, rim: 0.4, specular: 16,
      shadow: 38, noise: 2, lens: 15,
    },
  },
  {
    id: 'chrome',
    name: 'Liquid Chrome',
    tagline: 'Polished metal with a hard specular line',
    mode: 'dark',
    accent: '#a9c3d9',
    wallpaper: 'chrome',
    wallpaperDim: 20,
    wallpaperBlur: 0,
    glass: {
      blur: 16, saturation: 135, brightness: 108, opacity: 20,
      tint: '#cfdcea', radius: 18, rim: 2.2, specular: 92,
      shadow: 70, noise: 6, lens: 85,
    },
  },
  {
    id: 'aurora',
    name: 'Aurora Neon',
    tagline: 'Saturated, moody, colour-bleeding glass',
    mode: 'dark',
    accent: '#b46bff',
    wallpaper: 'nebula',
    wallpaperDim: 10,
    wallpaperBlur: 0,
    glass: {
      blur: 24, saturation: 225, brightness: 118, opacity: 22,
      tint: '#170d2c', radius: 22, rim: 1.4, specular: 52,
      shadow: 65, noise: 5, lens: 65,
    },
  },
  {
    id: 'ice',
    name: 'Arctic Day',
    tagline: 'Light mode, cold light, white glass',
    mode: 'light',
    accent: '#0f6cbd',
    wallpaper: 'mint',
    wallpaperDim: 6,
    wallpaperBlur: 0,
    glass: {
      blur: 34, saturation: 140, brightness: 118, opacity: 46,
      tint: '#ffffff', radius: 12, rim: 1, specular: 70,
      shadow: 28, noise: 2, lens: 40,
    },
  },
  {
    id: 'obsidian',
    name: 'Obsidian Smoke',
    tagline: 'Almost opaque, low blur, heavy depth',
    mode: 'dark',
    accent: '#8b8f9a',
    wallpaper: 'nebula',
    wallpaperDim: 4,
    wallpaperBlur: 0,
    glass: {
      blur: 10, saturation: 110, brightness: 96, opacity: 54,
      tint: '#101014', radius: 6, rim: 0.6, specular: 26,
      shadow: 82, noise: 8, lens: 20,
    },
  },
]

export const ACCENTS = [
  '#4cc2ff', '#0078d4', '#0f6cbd', '#8b5cf6', '#b46bff',
  '#e3008c', '#ef4444', '#f97316', '#f5c542', '#22c55e',
  '#0d9488', '#94a3b8',
]

export const baseTheme: ThemeSettings = (() => {
  const { id, tagline, ...rest } = PRESETS[0]
  return structuredClone(rest)
})()

export function presetToTheme(p: Preset): ThemeSettings {
  const { id, tagline, ...theme } = structuredClone(p)
  return theme
}
