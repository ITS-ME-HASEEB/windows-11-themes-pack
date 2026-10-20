export type FileKind = 'folder' | 'image' | 'doc' | 'video' | 'music' | 'archive' | 'app'

export type VFile = {
  name: string
  kind: FileKind
  size?: string
  modified?: string
  src?: string
  gradient?: string
  meta?: string
}

export const HOME_PATH = 'Home'

const wallpaper = (n: string) => `/wallpapers/${n}`

export const FOLDERS: Record<string, VFile[]> = {
  Home: [
    { name: 'Desktop', kind: 'folder', modified: '10/20/2026 9:12 AM', meta: '4 items' },
    { name: 'Downloads', kind: 'folder', modified: '10/20/2026 8:04 AM', meta: '7 items' },
    { name: 'Documents', kind: 'folder', modified: '10/19/2026 6:41 PM', meta: '9 items' },
    { name: 'Pictures', kind: 'folder', modified: '10/20/2026 10:02 AM', meta: '6 items' },
    { name: 'Liquid Glass Pack', kind: 'folder', modified: '10/20/2026 10:15 AM', meta: '5 items' },
    { name: 'Liquid Aurora.jpg', kind: 'image', size: '4.18 MB', modified: '10/20/2026 10:15 AM', src: wallpaper('aurora.jpg') },
    { name: 'Molten Chrome.jpg', kind: 'image', size: '3.92 MB', modified: '10/20/2026 10:15 AM', src: wallpaper('chrome.jpg') },
    { name: 'Glass tokens.css', kind: 'doc', size: '14 KB', modified: '10/20/2026 10:14 AM' },
    { name: 'Theme notes.md', kind: 'doc', size: '6 KB', modified: '10/19/2026 4:20 PM' },
  ],
  Desktop: [
    { name: 'This PC', kind: 'app', meta: 'System folder' },
    { name: 'Recycle Bin', kind: 'app', meta: 'Empty' },
    { name: 'Liquid Glass Pack', kind: 'folder', meta: '5 items' },
    { name: 'Design screenshots', kind: 'folder', modified: '10/18/2026 2:11 PM', meta: '12 items' },
  ],
  Downloads: [
    { name: 'LiquidGlass-1.2.zip', kind: 'archive', size: '48.2 MB', modified: '10/20/2026 8:04 AM' },
    { name: 'windhawk_mods.json', kind: 'doc', size: '22 KB', modified: '10/19/2026 7:12 PM' },
    { name: 'StartAllBack-setup.exe', kind: 'app', size: '6.8 MB', modified: '10/19/2026 6:58 PM' },
    { name: 'glass-refraction-ref.png', kind: 'image', size: '1.4 MB', modified: '10/19/2026 1:31 PM', src: wallpaper('aurora.jpg') },
    { name: 'chrome-study.jpg', kind: 'image', size: '2.9 MB', modified: '10/18/2026 11:20 AM', src: wallpaper('chrome.jpg') },
    { name: 'Preset backup.json', kind: 'doc', size: '3 KB', modified: '10/17/2026 9:44 AM' },
    { name: 'voiceover-take-3.mp3', kind: 'music', size: '8.1 MB', modified: '10/16/2026 5:02 PM' },
  ],
  Documents: [
    { name: 'Liquid Glass spec.md', kind: 'doc', size: '18 KB', modified: '10/20/2026 9:40 AM' },
    { name: 'Theme pack checklist.txt', kind: 'doc', size: '2 KB', modified: '10/19/2026 6:41 PM' },
    { name: 'Refraction study.pdf', kind: 'doc', size: '3.2 MB', modified: '10/17/2026 3:52 PM' },
    { name: 'Accent palette.png', kind: 'image', size: '840 KB', modified: '10/17/2026 2:20 PM', src: wallpaper('chrome.jpg') },
    { name: 'Wallpaper sources', kind: 'folder', meta: '3 items' },
    { name: 'Glass tokens.css', kind: 'doc', size: '14 KB', modified: '10/20/2026 10:14 AM' },
    { name: 'Explorer mockups', kind: 'folder', meta: '8 items' },
    { name: 'Task Manager heatmap.xlsx', kind: 'doc', size: '44 KB', modified: '10/15/2026 12:09 PM' },
    { name: 'Recording 10-20.mp4', kind: 'video', size: '122 MB', modified: '10/20/2026 10:01 AM' },
  ],
  Pictures: [
    { name: 'Liquid Aurora.jpg', kind: 'image', size: '4.18 MB', modified: '10/20/2026 10:15 AM', src: wallpaper('aurora.jpg') },
    { name: 'Molten Chrome.jpg', kind: 'image', size: '3.92 MB', modified: '10/20/2026 10:15 AM', src: wallpaper('chrome.jpg') },
    { name: 'Nebula render.png', kind: 'image', size: '6.2 MB', modified: '10/18/2026 8:12 PM', gradient: 'radial-gradient(80% 90% at 20% 15%,#5b3fa8,transparent 60%),radial-gradient(80% 80% at 80% 20%,#1a5f86,transparent 60%),#0a0a18' },
    { name: 'Glacier mint.jpg', kind: 'image', size: '2.4 MB', modified: '10/18/2026 7:44 PM', gradient: 'linear-gradient(150deg,#1c6f68,#96d8cf)' },
    { name: 'Screenshots', kind: 'folder', meta: '24 items' },
    { name: 'Lens flare study.jpg', kind: 'image', size: '3.1 MB', modified: '10/14/2026 4:05 PM', gradient: 'linear-gradient(140deg,#2b1c53,#e879b9 70%,#ffd37a)' },
  ],
  Music: [
    { name: 'Glass — ambient loop.wav', kind: 'music', size: '42 MB', modified: '10/12/2026 8:20 PM' },
    { name: 'Refraction (master).flac', kind: 'music', size: '58 MB', modified: '10/11/2026 9:02 PM' },
    { name: 'Studio takes', kind: 'folder', meta: '11 items' },
  ],
  Videos: [
    { name: 'Explorer glass walkthrough.mp4', kind: 'video', size: '88 MB', modified: '10/20/2026 9:58 AM' },
    { name: 'Taskbar motion test.mp4', kind: 'video', size: '24 MB', modified: '10/19/2026 5:12 PM' },
    { name: 'Captures', kind: 'folder', meta: '6 items' },
  ],
  Gallery: [
    { name: 'Liquid Aurora.jpg', kind: 'image', size: '4.18 MB', modified: '10/20/2026 10:15 AM', src: wallpaper('aurora.jpg') },
    { name: 'Molten Chrome.jpg', kind: 'image', size: '3.92 MB', modified: '10/20/2026 10:15 AM', src: wallpaper('chrome.jpg') },
    { name: 'Deep Nebula.jpg', kind: 'image', size: '5.10 MB', modified: '10/19/2026 9:20 PM', src: wallpaper('nebula.jpg') },
    { name: 'Glacier Mint.jpg', kind: 'image', size: '3.44 MB', modified: '10/19/2026 8:02 PM', src: wallpaper('mint.jpg') },
    { name: 'Accent palette.png', kind: 'image', size: '840 KB', modified: '10/17/2026 2:20 PM', src: wallpaper('chrome.jpg') },
    { name: 'Lens flare study.jpg', kind: 'image', size: '3.1 MB', modified: '10/14/2026 4:05 PM', src: wallpaper('aurora.jpg') },
  ],
  'Recycle Bin': [],
  Network: [
    { name: 'DESKTOP-LIQUID', kind: 'app', meta: 'This PC' },
    { name: 'Studio-NAS', kind: 'app', meta: 'Storage · 4.2 TB free' },
    { name: 'Living Room TV', kind: 'app', meta: 'Media device' },
  ],
  'This PC': [
    { name: 'Local Disk (C:)', kind: 'app', meta: '412 GB free of 1 TB' },
    { name: 'Studio SSD (D:)', kind: 'app', meta: '1.6 TB free of 2 TB' },
    { name: 'Documents', kind: 'folder', meta: '9 items' },
    { name: 'Downloads', kind: 'folder', meta: '7 items' },
    { name: 'Pictures', kind: 'folder', meta: '6 items' },
    { name: 'Music', kind: 'folder', meta: '3 items' },
    { name: 'Videos', kind: 'folder', meta: '3 items' },
  ],
  'Liquid Glass Pack': [
    { name: 'Windows 11 Liquid Glass.theme', kind: 'app', size: '6 KB', modified: '10/20/2026 10:15 AM' },
    { name: 'wallpaper.jpg', kind: 'image', size: '4.18 MB', modified: '10/20/2026 10:15 AM', src: wallpaper('aurora.jpg') },
    { name: 'glass-tokens.css', kind: 'doc', size: '14 KB', modified: '10/20/2026 10:14 AM' },
    { name: 'preset.json', kind: 'doc', size: '3 KB', modified: '10/20/2026 10:14 AM' },
    { name: 'README.md', kind: 'doc', size: '5 KB', modified: '10/20/2026 10:14 AM' },
  ],
}

export const NAV_GROUPS: { label?: string; items: { name: string; icon: string; children?: string[] }[] }[] = [
  {
    items: [
      { name: 'Home', icon: 'home' },
      { name: 'Gallery', icon: 'gallery' },
    ],
  },
  {
    items: [
      { name: 'Desktop', icon: 'desktop' },
      { name: 'Downloads', icon: 'download' },
      { name: 'Documents', icon: 'doc' },
      { name: 'Pictures', icon: 'image' },
      { name: 'Music', icon: 'music' },
      { name: 'Videos', icon: 'video' },
    ],
  },
  {
    label: 'This PC',
    items: [
      { name: 'This PC', icon: 'pc' },
      { name: 'Network', icon: 'network' },
      { name: 'Recycle Bin', icon: 'bin' },
    ],
  },
  {
    label: 'Studio',
    items: [{ name: 'Liquid Glass Pack', icon: 'pack' }],
  },
]
