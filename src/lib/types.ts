export type Mode = 'dark' | 'light'

export type GlassSettings = {
  blur: number
  saturation: number
  brightness: number
  opacity: number
  tint: string
  radius: number
  rim: number
  specular: number
  shadow: number
  noise: number
  lens: number
}

export type ThemeSettings = {
  name: string
  mode: Mode
  accent: string
  wallpaper: string
  wallpaperDim: number
  wallpaperBlur: number
  glass: GlassSettings
}

export type AppId = 'explorer' | 'taskmanager' | 'settings'

export type WindowRect = { x: number; y: number; w: number; h: number }

export type WindowState = WindowRect & {
  id: AppId
  title: string
  z: number
  minimized: boolean
  maximized: boolean
  restore?: WindowRect
}
