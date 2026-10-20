import type { ReactNode } from 'react'
import type { AppId } from './types'
import {
  Activity, Calculator, Calendar, Camera, Clock, FileText, Folder, Gamepad2,
  Globe, Image, Mail, Music, Palette, Settings2, ShoppingBag, Store, Terminal, Video,
} from 'lucide-react'

export type AppDef = {
  id: string
  name: string
  gradient: string
  icon: ReactNode
  launch?: AppId
  color?: string
}

const glyph = (node: ReactNode, size = 17) => (
  <span style={{ display: 'grid', placeItems: 'center', width: size, height: size }}>{node}</span>
)

export const APPS: Record<string, AppDef> = {
  explorer: {
    id: 'explorer', name: 'File Explorer', launch: 'explorer', color: '#f7c948',
    gradient: 'linear-gradient(150deg,#ffd968,#e8a317)',
    icon: glyph(<Folder size={17} fill="rgba(255,255,255,.92)" strokeWidth={1} color="rgba(120,80,0,.35)" />, 18),
  },
  edge: {
    id: 'edge', name: 'Microsoft Edge', color: '#2fb5a8',
    gradient: 'linear-gradient(150deg,#4fd1c5,#0a7ea4)',
    icon: glyph(<Globe size={16} />),
  },
  settings: {
    id: 'settings', name: 'Settings', launch: 'settings', color: '#4cc2ff',
    gradient: 'linear-gradient(150deg,#8ed8ff,#1878c8)',
    icon: glyph(<Settings2 size={16} />),
  },
  taskmanager: {
    id: 'taskmanager', name: 'Task Manager', launch: 'taskmanager', color: '#61d095',
    gradient: 'linear-gradient(150deg,#7ee2a8,#16915a)',
    icon: glyph(<Activity size={16} />),
  },
  terminal: {
    id: 'terminal', name: 'Terminal', color: '#2b2b33',
    gradient: 'linear-gradient(150deg,#3b3b48,#16161c)',
    icon: glyph(<Terminal size={16} />),
  },
  photos: {
    id: 'photos', name: 'Photos', color: '#e879b9',
    gradient: 'linear-gradient(150deg,#f6a8d8,#b02a83)',
    icon: glyph(<Image size={16} />),
  },
  notepad: {
    id: 'notepad', name: 'Notepad', color: '#6ea8fe',
    gradient: 'linear-gradient(150deg,#a8c8ff,#3a6fd8)',
    icon: glyph(<FileText size={16} />),
  },
  paint: {
    id: 'paint', name: 'Paint', color: '#f59e0b',
    gradient: 'linear-gradient(150deg,#ffd08a,#e8760b)',
    icon: glyph(<Palette size={16} />),
  },
  store: {
    id: 'store', name: 'Microsoft Store', color: '#4f8cff',
    gradient: 'linear-gradient(150deg,#7fb0ff,#1b4fc4)',
    icon: glyph(<ShoppingBag size={16} />),
  },
  xbox: {
    id: 'xbox', name: 'Xbox', color: '#3fbf5f',
    gradient: 'linear-gradient(150deg,#8ce99a,#157f3b)',
    icon: glyph(<Gamepad2 size={16} />),
  },
  calculator: {
    id: 'calculator', name: 'Calculator', color: '#38bdf8',
    gradient: 'linear-gradient(150deg,#92dcff,#1273b8)',
    icon: glyph(<Calculator size={16} />),
  },
  camera: {
    id: 'camera', name: 'Camera', color: '#8b5cf6',
    gradient: 'linear-gradient(150deg,#b79bff,#5b21b6)',
    icon: glyph(<Camera size={16} />),
  },
  mail: {
    id: 'mail', name: 'Mail', color: '#38a3f8',
    gradient: 'linear-gradient(150deg,#8ccbff,#1466c4)',
    icon: glyph(<Mail size={16} />),
  },
  music: {
    id: 'music', name: 'Media Player', color: '#ef4444',
    gradient: 'linear-gradient(150deg,#fca5a5,#c02626)',
    icon: glyph(<Music size={16} />),
  },
  calendar: {
    id: 'calendar', name: 'Calendar', color: '#e11d48',
    gradient: 'linear-gradient(150deg,#ff9db0,#b01334)',
    icon: glyph(<Calendar size={16} />),
  },
  clock: {
    id: 'clock', name: 'Clock', color: '#0ea5e9',
    gradient: 'linear-gradient(150deg,#9ad9ff,#0369a1)',
    icon: glyph(<Clock size={16} />),
  },
  clipchamp: {
    id: 'clipchamp', name: 'Clipchamp', color: '#7c3aed',
    gradient: 'linear-gradient(150deg,#c4a6ff,#6d28d9)',
    icon: glyph(<Video size={16} />),
  },
}

export const PINNED = [
  'explorer', 'edge', 'settings', 'terminal', 'photos', 'notepad',
  'paint', 'store', 'xbox', 'calculator', 'camera', 'music',
  'mail', 'calendar', 'clock', 'clipchamp', 'taskmanager', 'paint',
]

export const TASKBAR_PINNED = ['explorer', 'edge', 'terminal', 'photos', 'settings', 'taskmanager']
