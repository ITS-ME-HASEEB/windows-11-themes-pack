export type Wallpaper = {
  id: string
  name: string
  src: string
  note: string
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'aurora',
    name: 'Liquid Aurora',
    src: '/wallpapers/aurora.jpg',
    note: 'Iridescent glass ribbons on midnight',
  },
  {
    id: 'chrome',
    name: 'Molten Chrome',
    src: '/wallpapers/chrome.jpg',
    note: 'Brushed metal, cool light',
  },
  {
    id: 'nebula',
    name: 'Deep Nebula',
    src: '/wallpapers/nebula.jpg',
    note: 'Violet gas behind glass panes',
  },
  {
    id: 'mint',
    name: 'Glacier Mint',
    src: '/wallpapers/mint.jpg',
    note: 'Sea-glass ice, arctic daylight',
  },
]

export function wallpaperById(id: string): Wallpaper {
  return WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0]
}
