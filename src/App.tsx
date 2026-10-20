import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Activity, Folder, LayoutGrid, Monitor, Settings2, Sparkles, RotateCcw, Trash2 } from 'lucide-react'
import Studio from './components/Studio'
import Window from './components/Window'
import Taskbar, { StartMenu } from './components/Taskbar'
import Explorer from './components/windows/Explorer'
import TaskManager from './components/windows/TaskManager'
import Settings from './components/windows/Settings'
import { baseTheme, PRESETS, presetToTheme } from './lib/presets'
import { applyThemeVars } from './lib/theme'
import { wallpaperById } from './lib/wallpapers'
import { downloadThemeZip } from './lib/exportTheme'
import type { AppId, ThemeSettings, WindowState } from './lib/types'

const TASKBAR_H = 56
const STORE_KEY = 'lgs.theme.v1'

const TITLES: Record<AppId, string> = {
  explorer: 'File Explorer',
  taskmanager: 'Task Manager',
  settings: 'Settings',
}

const ICONS: Record<AppId, ReactNode> = {
  explorer: <Folder size={14} fill="rgba(245,195,75,.35)" style={{ color: '#f5c34b' }} />,
  taskmanager: <Activity size={14} style={{ color: '#61d095' }} />,
  settings: <Settings2 size={14} style={{ color: 'var(--accent)' }} />,
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function loadTheme(): ThemeSettings {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ThemeSettings>
      return {
        ...baseTheme,
        ...parsed,
        glass: { ...baseTheme.glass, ...(parsed.glass ?? {}) },
      }
    }
  } catch {
    /* ignore */
  }
  return structuredClone(baseTheme)
}

function makeLayout(W: number, H: number): Record<AppId, WindowState> {
  const availH = H - TASKBAR_H
  const studioW = W > 1080 ? 360 : 0
  const availW = Math.max(300, W - studioW - 34)
  const tiny = W < 880

  if (tiny) {
    return {
      explorer: { id: 'explorer', title: TITLES.explorer, x: 8, y: 8, w: W - 16, h: availH - 80, z: 3, minimized: false, maximized: false },
      taskmanager: { id: 'taskmanager', title: TITLES.taskmanager, x: 8, y: 8, w: W - 16, h: availH - 80, z: 2, minimized: true, maximized: false },
      settings: { id: 'settings', title: TITLES.settings, x: 8, y: 8, w: W - 16, h: availH - 80, z: 1, minimized: true, maximized: false },
    }
  }

  // cascade: Explorer top-left, Task Manager right, Settings tucked underneath-left
  const wExp = clamp(availW * 0.53, 500, 680)
  const hExp = clamp(availH * 0.52, 340, 470)
  const expX = 74
  const expY = 32
  const wTm = clamp(availW * 0.52, 480, 780)
  const hTm = clamp(availH * 0.6, 340, 600)
  const wSet = clamp(availW * 0.5, 460, 590)
  const setY = Math.min(expY + hExp + 16, availH - 300)
  const setH = Math.max(280, availH - setY - 14)

  return {
    explorer: {
      id: 'explorer', title: TITLES.explorer,
      x: expX, y: expY,
      w: wExp, h: hExp, z: 3, minimized: false, maximized: false,
    },
    taskmanager: {
      id: 'taskmanager', title: TITLES.taskmanager,
      x: clamp(availW - wTm + 20, 6, Math.max(6, availW - 300)),
      y: clamp(availH * 0.14, 56, Math.max(56, availH - hTm - 40)),
      w: wTm, h: hTm, z: 2, minimized: false, maximized: false,
    },
    settings: {
      id: 'settings', title: TITLES.settings,
      x: 80, y: setY,
      w: wSet, h: setH, z: 1, minimized: false, maximized: false,
    },
  }
}

export default function App() {
  const [theme, setTheme] = useState<ThemeSettings>(loadTheme)
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  const [wins, setWins] = useState<Record<AppId, WindowState>>(() =>
    makeLayout(window.innerWidth, window.innerHeight),
  )
  const [running, setRunning] = useState<AppId[]>(['explorer', 'taskmanager', 'settings'])
  const [order, setOrder] = useState<AppId[]>(['settings', 'taskmanager', 'explorer'])
  const [startOpen, setStartOpen] = useState(false)
  const [studioOpen, setStudioOpen] = useState(() => window.innerWidth > 860)
  const [explorerPath, setExplorerPath] = useState('Home')
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | null>(null)
  const firstRun = useRef(true)

  const bounds = { w: vp.w, h: vp.h - TASKBAR_H }

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }, [])

  /* theme -> CSS vars + persistence */
  useEffect(() => {
    applyThemeVars(document.documentElement, theme)
    document.title = `${theme.name} — Liquid Glass Studio`
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(theme))
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => {
    if (!firstRun.current) return
    firstRun.current = false
    const t = window.setTimeout(
      () => showToast('Welcome to Liquid Glass Studio — drag a window, tune the glass, export a real theme.'),
      800,
    )
    return () => window.clearTimeout(t)
  }, [showToast])

  /* viewport */
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    setWins((prev) => {
      const next = { ...prev }
      let changed = false
      ;(Object.keys(next) as AppId[]).forEach((id) => {
        const w = next[id]
        if (w.maximized) return
        const x = clamp(w.x, -w.w + 120, bounds.w - 100)
        const y = clamp(w.y, 0, Math.max(0, bounds.h - 42))
        const width = Math.min(w.w, Math.max(300, bounds.w - 8))
        const height = Math.min(w.h, Math.max(240, bounds.h - 8))
        if (x !== w.x || y !== w.y || width !== w.w || height !== w.h) {
          next[id] = { ...w, x, y, w: width, h: height }
          changed = true
        }
      })
      return changed ? next : prev
    })
  }, [bounds.w, bounds.h])

  /* keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStartOpen(false)
      if (e.key.toLowerCase() === 'd' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault()
        setStudioOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const focusWindow = useCallback((id: AppId) => {
    setOrder((o) => (o[o.length - 1] === id ? o : [...o.filter((x) => x !== id), id]))
  }, [])

  const launch = useCallback((id: AppId) => {
    setRunning((r) => (r.includes(id) ? r : [...r, id]))
    setWins((w) => ({ ...w, [id]: { ...w[id], minimized: false } }))
    setOrder((o) => [...o.filter((x) => x !== id), id])
    setStartOpen(false)
  }, [])

  // Windows behaviour: clicking the active app's taskbar button minimizes it
  const taskbarLaunch = useCallback(
    (id: AppId) => {
      const isTop = order[order.length - 1] === id
      if (isTop && !wins[id].minimized) {
        setWins((w) => ({ ...w, [id]: { ...w[id], minimized: true } }))
        return
      }
      launch(id)
    },
    [order, wins, launch],
  )

  const closeWindow = (id: AppId) => {
    setRunning((r) => r.filter((x) => x !== id))
    setOrder((o) => o.filter((x) => x !== id))
  }

  const minimize = (id: AppId) => {
    setWins((w) => ({ ...w, [id]: { ...w[id], minimized: true } }))
  }

  const toggleMax = (id: AppId) => {
    setWins((w) => {
      const win = w[id]
      if (win.maximized && win.restore) {
        return { ...w, [id]: { ...win, ...win.restore, maximized: false, restore: undefined } }
      }
      return {
        ...w,
        [id]: {
          ...win,
          maximized: true,
          restore: { x: win.x, y: win.y, w: win.w, h: win.h },
        },
      }
    })
  }

  const setRect = (id: AppId, rect: { x: number; y: number; w: number; h: number }) => {
    setWins((w) => ({ ...w, [id]: { ...w[id], ...rect } }))
  }

  const resetLayout = () => {
    setWins(makeLayout(vp.w, vp.h))
    setRunning(['explorer', 'taskmanager', 'settings'])
    setOrder(['settings', 'taskmanager', 'explorer'])
    showToast('Layout reset — all three apps restored')
  }

  const exportTheme = async () => {
    try {
      await downloadThemeZip(theme)
      showToast('Theme pack downloaded — open install.ps1 on Windows 11')
    } catch {
      showToast('Export failed. Please try again.')
    }
  }

  const w = wallpaperById(theme.wallpaper)
  const activeId = order[order.length - 1] ?? null
  const openWindows = useMemo(
    () => (Object.keys(wins) as AppId[]).filter((id) => running.includes(id) && !wins[id].minimized),
    [wins, running],
  )

  return (
    <div className={`desktop ${studioOpen ? "designing" : ""}`}>
      <div className="wallpaper" style={{ backgroundImage: `url(${w.src})` }} />
      <div className="wallpaper-shade" />

      <div className="desk-icons">
        <button className="desk-icon" onDoubleClick={() => { setExplorerPath('This PC'); launch('explorer') }} onClick={() => setExplorerPath('This PC')} title="This PC — double-click to open">
          <span className="desk-glyph"><Monitor size={26} strokeWidth={1.4} style={{ color: '#cfe8ff' }} /></span>
          <span>This PC</span>
        </button>
        <button className="desk-icon" onClick={() => { setExplorerPath('Recycle Bin'); launch('explorer') }} title="Recycle Bin">
          <span className="desk-glyph"><Trash2 size={25} strokeWidth={1.4} style={{ color: '#dbe8f7' }} /></span>
          <span>Recycle Bin</span>
        </button>
        <button className="desk-icon" onClick={() => { setExplorerPath('Liquid Glass Pack'); launch('explorer') }} title="Liquid Glass Pack">
          <span className="desk-glyph"><Folder size={26} strokeWidth={1.4} fill="rgba(245,195,75,.85)" style={{ color: '#f5c34b' }} /></span>
          <span>Liquid Glass Pack</span>
        </button>
      </div>

      <div className="desk-hint glass">
        <button className={activeId === 'explorer' ? 'on' : ''} onClick={() => launch('explorer')}>
          <Folder size={13} style={{ color: '#f5c34b' }} /> Explorer
        </button>
        <button className={activeId === 'taskmanager' ? 'on' : ''} onClick={() => launch('taskmanager')}>
          <Activity size={13} style={{ color: '#61d095' }} /> Task Manager
        </button>
        <button className={activeId === 'settings' ? 'on' : ''} onClick={() => launch('settings')}>
          <Settings2 size={13} style={{ color: 'var(--accent)' }} /> Settings
        </button>
        <span style={{ width: 1, height: 16, background: 'var(--line)', margin: '0 3px' }} />
        <button onClick={resetLayout} title="Reset window layout">
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      <div className="win-layer">
        {openWindows.map((id) => (
          <Window
            key={id}
            win={{ ...wins[id], z: order.indexOf(id) + 1 }}
            focused={activeId === id}
            bounds={bounds}
            onFocus={focusWindow}
            onClose={closeWindow}
            onMinimize={minimize}
            onToggleMax={toggleMax}
            onRect={setRect}
            appIcon={ICONS[id]}
          >
            {id === 'explorer' && (
              <Explorer key={explorerPath} initialPath={explorerPath} onToast={showToast} />
            )}
            {id === 'taskmanager' && <TaskManager onToast={showToast} />}
            {id === 'settings' && (
              <Settings theme={theme} onChange={setTheme} onExport={exportTheme} onToast={showToast} />
            )}
          </Window>
        ))}
      </div>

      {studioOpen ? (
        <Studio theme={theme} onChange={setTheme} onToast={showToast} onClose={() => setStudioOpen(false)} />
      ) : (
        <button className="float-studio-btn glass" onClick={() => setStudioOpen(true)} title="Open the design panel (Ctrl+Shift+D)">
          <Sparkles size={14} style={{ color: 'var(--accent)' }} />
          Design
        </button>
      )}

      {startOpen && (
        <StartMenu accent={theme.accent} onClose={() => setStartOpen(false)} onLaunch={launch} />
      )}

      <Taskbar
        open={startOpen}
        openApps={running.filter((id) => !wins[id].minimized)}
        activeId={activeId}
        onLaunch={taskbarLaunch}
        onToggleStart={() => setStartOpen((v) => !v)}
        studioOpen={studioOpen}
        onToggleStudio={() => setStudioOpen((v) => !v)}
        mode={theme.mode}
        onToggleMode={() => setTheme((t) => ({ ...t, mode: t.mode === 'dark' ? 'light' : 'dark' }))}
        accent={theme.accent}
        onToast={showToast}
      />

      {toast && (
        <div className="toast glass" role="status">
          <Sparkles size={14} style={{ color: 'var(--accent)', flex: 'none' }} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}
