import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { Copy, Minus, Square, X } from 'lucide-react'
import type { WindowRect, WindowState } from '../lib/types'

type Props = {
  win: WindowState
  focused: boolean
  bounds: { w: number; h: number }
  onFocus: (id: WindowState['id']) => void
  onClose: (id: WindowState['id']) => void
  onMinimize: (id: WindowState['id']) => void
  onToggleMax: (id: WindowState['id']) => void
  onRect: (id: WindowState['id'], rect: WindowRect) => void
  appIcon: ReactNode
  children: ReactNode
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export default function Window({
  win, focused, bounds, onFocus, onClose, onMinimize, onToggleMax, onRect, appIcon, children,
}: Props) {
  const dragRef = useRef<{ px: number; py: number; x: number; y: number } | null>(null)
  const resizeRef = useRef<{ px: number; py: number; rect: WindowRect; edge: string } | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return
      if ((e.target as HTMLElement).closest('button, input, .no-drag')) return
      onFocus(win.id)
      if (win.maximized) return
      dragRef.current = { px: e.clientX, py: e.clientY, x: win.x, y: win.y }
      const move = (ev: PointerEvent) => {
        const d = dragRef.current
        if (!d) return
        const nx = clamp(d.x + ev.clientX - d.px, -win.w + 140, bounds.w - 120)
        const ny = clamp(d.y + ev.clientY - d.py, 0, bounds.h - 46)
        onRect(win.id, { ...win, x: nx, y: ny })
      }
      const up = () => {
        dragRef.current = null
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        document.body.style.userSelect = ''
      }
      document.body.style.userSelect = 'none'
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
    },
    [win, bounds, onFocus, onRect],
  )

  const startResize = (edge: 'e' | 's' | 'se') => (e: React.PointerEvent) => {
    if (win.maximized) return
    e.preventDefault()
    e.stopPropagation()
    resizeRef.current = { px: e.clientX, py: e.clientY, rect: { ...win }, edge }
    const move = (ev: PointerEvent) => {
      const d = resizeRef.current
      if (!d) return
      const dx = ev.clientX - d.px
      const dy = ev.clientY - d.py
      let { x, y, w, h } = d.rect
      if (edge.includes('e')) w = clamp(d.rect.w + dx, 420, bounds.w - x - 4)
      if (edge.includes('s')) h = clamp(d.rect.h + dy, 300, bounds.h - y - 4)
      onRect(win.id, { ...win, x, y, w, h })
    }
    const up = () => {
      resizeRef.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.style.userSelect = ''
    }
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // double click titlebar = maximize
  useEffect(() => () => {
    document.body.style.userSelect = ''
  }, [])

  const rect = win.maximized
    ? { x: 0, y: 0, w: bounds.w, h: bounds.h }
    : { x: win.x, y: win.y, w: win.w, h: win.h }

  return (
    <div
      ref={rootRef}
      className={`win glass ${focused ? 'focused' : ''} ${win.maximized ? 'maximized' : ''}`}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        zIndex: 10 + win.z,
        borderRadius: win.maximized ? 0 : undefined,
      }}
      onPointerDown={() => onFocus(win.id)}
      role="dialog"
      aria-label={win.title}
    >
      <div className="glass-lens" aria-hidden />
      <div className="glass-body">
        <div
          className="titlebar"
          onPointerDown={startDrag}
          onDoubleClick={() => onToggleMax(win.id)}
        >
          <span className="app-ico">{appIcon}</span>
          <span className="win-title">{win.title}</span>
          <div className="win-controls">
            <button aria-label="Minimize" onClick={(e) => { e.stopPropagation(); onMinimize(win.id) }}>
              <Minus size={14} />
            </button>
            <button aria-label={win.maximized ? 'Restore' : 'Maximize'} onClick={(e) => { e.stopPropagation(); onToggleMax(win.id) }}>
              {win.maximized ? <Copy size={12} /> : <Square size={11} />}
            </button>
            <button className="close" aria-label="Close" onClick={(e) => { e.stopPropagation(); onClose(win.id) }}>
              <X size={15} />
            </button>
          </div>
        </div>
        <div className="win-content">{children}</div>
      </div>
      {!win.maximized && (
        <>
          <div className="resizer e" onPointerDown={startResize('e')} />
          <div className="resizer s" onPointerDown={startResize('s')} />
          <div className="resizer se" onPointerDown={startResize('se')} />
        </>
      )}
    </div>
  )
}
