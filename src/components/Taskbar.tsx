import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BatteryFull, Bell, ChevronRight, CloudSun, LayoutGrid, Moon, Search,
  Settings2, SlidersHorizontal, Sun, Volume2, Wifi, X, Sparkles, Folder,
} from 'lucide-react'
import type { AppId, Mode } from '../lib/types'
import { APPS } from '../lib/apps'
import { PRESETS } from '../lib/presets'

function AppTile({ id, size = 21 }: { id: string; size?: number }) {
  const app = APPS[id]
  if (!app) return null
  return (
    <span
      className="app-tile"
      style={{ width: size, height: size, background: app.gradient, fontSize: size * 0.7 }}
    >
      {app.icon}
    </span>
  )
}

type Props = {
  open: boolean
  openApps: AppId[]
  activeId: AppId | null
  onLaunch: (id: AppId) => void
  onToggleStart: () => void
  studioOpen: boolean
  onToggleStudio: () => void
  mode: Mode
  onToggleMode: () => void
  accent: string
  onToast: (msg: string) => void
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 15)
    return () => clearInterval(t)
  }, [])
  return now
}

const fmtTime = (d: Date) =>
  d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })

export default function Taskbar({
  open, openApps, activeId, onLaunch, onToggleStart, studioOpen, onToggleStudio,
  mode, onToggleMode, accent, onToast,
}: Props) {
  const now = useClock()

  return (
    <div className="taskbar-wrap">
      <div className="taskbar glass" role="toolbar" aria-label="Taskbar">
        <div className="glass-lens" aria-hidden />
        <div
          className="tb-btn"
          title="Widgets"
          onClick={() => onToast('Widgets are disabled in this theme — cleaner glass.')}
          style={{ width: 'auto', padding: '0 9px', display: 'flex', gap: 7 }}
        >
          <CloudSun size={19} />
          <span className="dt-only" style={{ fontSize: 11, lineHeight: 1.15, textAlign: 'left' }}>
            24°
            <br />
            <span className="faint">Sunny</span>
          </span>
        </div>

        <div className="tb-center">
          <button
            className={`tb-btn ${open ? 'active' : ''}`}
            onClick={onToggleStart}
            aria-label="Start"
            aria-expanded={open}
            title="Start"
          >
            <span className="winlogo blue">
              <i /><i /><i /><i />
            </span>
          </button>

          <button
            className={`tb-btn ${openApps.includes('explorer') ? 'running' : ''} ${activeId === 'explorer' ? 'active' : ''}`}
            onClick={() => onLaunch('explorer')}
            title="File Explorer"
            aria-label="File Explorer"
          >
            <AppTile id="explorer" />
          </button>

          <button
            className={`tb-btn ${openApps.includes('settings') ? 'running' : ''} ${activeId === 'settings' ? 'active' : ''}`}
            onClick={() => onLaunch('settings')}
            title="Settings"
            aria-label="Settings"
          >
            <AppTile id="settings" />
          </button>

          <button
            className={`tb-btn ${openApps.includes('taskmanager') ? 'running' : ''} ${activeId === 'taskmanager' ? 'active' : ''}`}
            onClick={() => onLaunch('taskmanager')}
            title="Task Manager"
            aria-label="Task Manager"
          >
            <AppTile id="taskmanager" />
          </button>

          <span className="tb-divider dt-only" />

          {(['edge', 'terminal', 'photos', 'notepad'] as const).map((id) => (
            <button
              key={id}
              className="tb-btn dt-only"
              title={APPS[id].name}
              onClick={() => onToast(`${APPS[id].name} isn't part of this studio preview`)}
            >
              <AppTile id={id} />
            </button>
          ))}
        </div>

        <div className="tray">
          <button
            className="tray-btn"
            title="Design controls"
            onClick={onToggleStudio}
            style={studioOpen ? { color: 'var(--accent)', background: 'var(--hover)' } : undefined}
          >
            <LayoutGrid size={15} />
            <span className="dt-only">Design</span>
          </button>

          <button className="tray-btn" title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`} onClick={onToggleMode}>
            {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button className="tray-btn" title="Network" onClick={() => onToast('Connected — Liquid-Glass-5G · signal excellent')}>
            <Wifi size={16} />
          </button>
          <button className="tray-btn" title="Volume" onClick={() => onToast('Volume 42% · Liquid Glass audio theme')}>
            <Volume2 size={16} />
          </button>
          <button className="tray-btn dt-only" title="Battery 86%" onClick={() => onToast('Battery 86% · 4h 12m remaining')}>
            <BatteryFull size={17} />
          </button>
          <button className="tray-btn" title="Notifications" onClick={() => onToast('No new notifications')}>
            <Bell size={15} />
          </button>
          <button
            className="tray-btn clock"
            title="Date and time"
            style={{ flexDirection: 'column', gap: 0, alignItems: 'flex-end' }}
            onClick={() => onToast(fmtDate(now) + ' · ' + fmtTime(now))}
          >
            <span>{fmtTime(now)}</span>
            <span>{fmtDate(now)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function StartMenu({
  onClose, onLaunch, accent,
}: {
  onClose: () => void
  onLaunch: (id: AppId) => void
  accent: string
}) {
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const pins = useMemo(
    () => Object.values(APPS).filter((a) => a.id !== 'taskmanager'),
    [],
  )
  const results = useMemo(
    () => (q ? pins.filter((a) => a.name.toLowerCase().includes(q.toLowerCase())) : []),
    [q, pins],
  )

  return (
    <>
      <div className="start-scrim" onClick={onClose} />
      <div className="start glass" role="dialog" aria-label="Start">
        <div className="glass-lens" aria-hidden />
        <div className="glass-body">
          <div className="start-head">
            <label className="start-search">
              <Search size={15} className="faint" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for apps, settings, and documents"
                aria-label="Search"
              />
              {q && (
                <button className="icon-btn" style={{ width: 22, height: 22 }} onClick={() => setQ('')} aria-label="Clear">
                  <X size={13} />
                </button>
              )}
            </label>
          </div>

          {q ? (
            <div className="scroll" style={{ padding: '4px 18px 18px' }}>
              <div className="start-section" style={{ padding: '8px 10px' }}>
                <span>Best match</span>
              </div>
              {results.length === 0 && (
                <div className="empty-state" style={{ height: 180 }}>
                  No results for “{q}”
                </div>
              )}
              {results.map((a) => (
                <button
                  key={a.id}
                  className="reco-item"
                  onClick={() => { onLaunch(a.launch ?? 'explorer'); onClose() }}
                >
                  <span className="reco-thumb" style={{ background: a.gradient, color: '#fff' }}>{a.icon}</span>
                  <span className="reco-txt">
                    {a.name}
                    <small>App</small>
                  </span>
                  <ChevronRight size={14} className="faint" style={{ marginLeft: 'auto' }} />
                </button>
              ))}
            </div>
          ) : (
            <div className="scroll">
              <div className="start-section">
                <span>Pinned</span>
                <button className="btn ghost sm" style={{ color: 'var(--accent)' }}>
                  All apps <ChevronRight size={13} />
                </button>
              </div>
              <div className="start-pins">
                {pins.slice(0, 15).map((a) => (
                  <button
                    key={a.id}
                    className="pin"
                    onClick={() => { onLaunch(a.launch ?? 'explorer'); onClose() }}
                    title={a.name}
                  >
                    <span className="glyph" style={{ background: a.gradient }}>{a.icon}</span>
                    <span>{a.name}</span>
                  </button>
                ))}
              </div>

              <div className="start-section">
                <span>Recommended</span>
                <button className="btn ghost sm" style={{ color: 'var(--accent)' }} onClick={() => onLaunch('explorer')}>
                  More <ChevronRight size={13} />
                </button>
              </div>
              <div className="reco">
                <button className="reco-item" onClick={() => onLaunch('explorer')}>
                  <span className="reco-thumb"><img src="/wallpapers/aurora.jpg" alt="" /></span>
                  <span className="reco-txt">
                    Liquid Aurora.jpg
                    <small>Recently added · 4.18 MB</small>
                  </span>
                </button>
                <button className="reco-item" onClick={() => onLaunch('explorer')}>
                  <span className="reco-thumb"><img src="/wallpapers/chrome.jpg" alt="" /></span>
                  <span className="reco-txt">
                    Molten Chrome.jpg
                    <small>10:15 AM · 3.92 MB</small>
                  </span>
                </button>
                <button className="reco-item" onClick={() => onLaunch('settings')}>
                  <span className="reco-thumb" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                    <Sparkles size={16} />
                  </span>
                  <span className="reco-txt">
                    Liquid Glass Studio
                    <small>{PRESETS.length} presets · live export</small>
                  </span>
                </button>
                <button className="reco-item" onClick={() => onLaunch('explorer')}>
                  <span className="reco-thumb" style={{ background: 'var(--hover)', color: 'var(--text-dim)' }}>
                    <Folder size={16} />
                  </span>
                  <span className="reco-txt">
                    Windows 11 Liquid Glass.theme
                    <small>Theme file · 6 KB</small>
                  </span>
                </button>
              </div>
            </div>
          )}

          <div className="start-foot">
            <button className="start-user">
              <span className="avatar">AM</span>
              Alex Morgan
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              <button className="icon-btn" title="Studio" onClick={() => { onLaunch('settings'); onClose() }} style={{ color: accent }}>
                <Sparkles size={16} />
              </button>
              <button className="icon-btn" title="Settings" onClick={() => { onLaunch('settings'); onClose() }}>
                <Settings2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
