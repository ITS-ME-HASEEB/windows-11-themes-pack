import { useRef, useState, type CSSProperties } from 'react'
import {
  ChevronRight, Copy, Download, Droplets, FileJson, Image as ImageIcon,
  Layers, Palette, RotateCcw, Sparkles, Wand2, X, Check, PanelRightClose, Upload,
} from 'lucide-react'
import type { GlassSettings, ThemeSettings } from '../lib/types'
import { ACCENTS, PRESETS, presetToTheme, type Preset } from '../lib/presets'
import { WALLPAPERS, wallpaperById } from '../lib/wallpapers'
import { copyText, downloadThemeZip, downloadWallpaper, presetJson } from '../lib/exportTheme'
import { toGlassCss } from '../lib/theme'

type Props = {
  theme: ThemeSettings
  onChange: (t: ThemeSettings) => void
  onToast: (m: string) => void
  onClose: () => void
}

type Tab = 'presets' | 'glass' | 'export'

const GLASS_SLIDERS: {
  key: keyof GlassSettings
  label: string
  min: number
  max: number
  step?: number
  unit: string
  tint?: boolean
}[] = [
  { key: 'blur', label: 'Backdrop blur', min: 0, max: 80, unit: 'px' },
  { key: 'opacity', label: 'Glass tint opacity', min: 0, max: 100, unit: '%', tint: true },
  { key: 'saturation', label: 'Saturation', min: 50, max: 300, unit: '%' },
  { key: 'brightness', label: 'Brightness', min: 70, max: 160, unit: '%' },
  { key: 'radius', label: 'Corner radius', min: 0, max: 32, unit: 'px' },
  { key: 'rim', label: 'Rim thickness', min: 0, max: 4, step: 0.1, unit: 'px' },
  { key: 'specular', label: 'Specular highlight', min: 0, max: 100, unit: '%' },
  { key: 'shadow', label: 'Depth shadow', min: 0, max: 100, unit: '%' },
  { key: 'noise', label: 'Frost grain', min: 0, max: 12, unit: '%' },
  { key: 'lens', label: 'Edge lens bend', min: 0, max: 100, unit: '%' },
]

function Slider({
  label, value, min, max, step = 1, unit, fill, onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number
  unit: string; fill?: number; onChange: (v: number) => void
}) {
  const pct = fill ?? ((value - min) / (max - min)) * 100
  return (
    <div className="slider-row">
      <div className="top">
        <span>{label}</span>
        <span className="val">{Number.isInteger(value) ? value : value.toFixed(1)}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        style={{ '--fill': `${pct}%` } as CSSProperties}
        onChange={(e) => onChange(+e.target.value)}
        aria-label={label}
      />
    </div>
  )
}

export default function Studio({ theme, onChange, onToast, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('presets')
  const [copied, setCopied] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const w = wallpaperById(theme.wallpaper)
  const g = theme.glass

  const set = (patch: Partial<ThemeSettings>) => onChange({ ...theme, ...patch })
  const setGlass = (patch: Partial<GlassSettings>) => onChange({ ...theme, glass: { ...g, ...patch } })
  const applyPreset = (p: Preset) => { onChange(presetToTheme(p)); onToast(`Preset “${p.name}” applied`) }

  const flash = (key: string, msg: string) => {
    setCopied(key)
    onToast(msg)
    setTimeout(() => setCopied(null), 1600)
  }

  const doCopyCss = async () => {
    const ok = await copyText(toGlassCss(theme))
    flash('css', ok ? 'Glass CSS copied to clipboard' : 'Copy failed — check clipboard permissions')
  }
  const doCopyJson = async () => {
    const ok = await copyText(presetJson(theme))
    flash('json', ok ? 'Preset JSON copied' : 'Copy failed — check clipboard permissions')
  }
  const importPreset = async (file: File) => {
    try {
      const raw = JSON.parse(await file.text())
      const src = raw?.theme ?? raw
      if (!src || typeof src !== 'object' || !src.glass) throw new Error('bad shape')
      onChange({
        ...theme,
        ...src,
        glass: { ...theme.glass, ...src.glass },
        name: typeof src.name === 'string' && src.name ? src.name.slice(0, 40) : theme.name,
      })
      onToast(`Imported “${src.name ?? 'preset'}”`)
    } catch {
      onToast('That file is not a Liquid Glass preset JSON')
    }
  }

  const doExport = async () => {
    setBusy(true)
    try {
      await downloadThemeZip(theme)
      onToast('Theme pack downloaded — open install.ps1 on Windows 11')
    } catch {
      onToast('Export failed. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <aside className="studio glass" aria-label="Liquid Glass Studio">
      <div className="glass-lens" aria-hidden />
      <div className="glass-body">
        <div className="studio-head">
          <span className="studio-mark"><Wand2 size={15} /></span>
          <div style={{ minWidth: 0 }}>
            <b>Liquid Glass Studio</b>
            <small>{theme.name} · {theme.mode === 'dark' ? 'Dark' : 'Light'}</small>
          </div>
          <button className="icon-btn" style={{ width: 28, height: 28 }} title="Hide design panel" onClick={onClose}>
            <PanelRightClose size={15} />
          </button>
        </div>

        <div className="studio-tabs">
          <button className={tab === 'presets' ? 'on' : ''} onClick={() => setTab('presets')}>
            <Palette size={12} style={{ marginRight: 5, verticalAlign: -1 }} />Theme
          </button>
          <button className={tab === 'glass' ? 'on' : ''} onClick={() => setTab('glass')}>
            <Droplets size={12} style={{ marginRight: 5, verticalAlign: -1 }} />Glass
          </button>
          <button className={tab === 'export' ? 'on' : ''} onClick={() => setTab('export')}>
            <Download size={12} style={{ marginRight: 5, verticalAlign: -1 }} />Export
          </button>
        </div>

        <div className="studio-body">
          {tab === 'presets' && (
            <>
              <div className="panel-section">
                <div className="panel-label">Theme name</div>
                <input
                  className="name-input"
                  value={theme.name}
                  onChange={(e) => set({ name: e.target.value.slice(0, 40) })}
                  placeholder="My liquid glass theme"
                  aria-label="Theme name"
                />
              </div>

              <div className="panel-section" style={{ paddingTop: 6 }}>
                <div className="panel-label">Presets</div>
                <div className="preset-grid">
                  {PRESETS.map((p) => {
                    const wp = wallpaperById(p.wallpaper)
                    const active = theme.name === p.name
                    return (
                      <button
                        key={p.id}
                        className={`preset ${active ? 'on' : ''}`}
                        onClick={() => applyPreset(p)}
                        title={p.tagline}
                      >
                        <span
                          className="preset-art"
                          style={{
                            backgroundImage: `url(${wp.src})`,
                            filter: p.mode === 'light' ? 'brightness(1.15)' : undefined,
                          }}
                        >
                          <span
                            className="preset-chip"
                            style={{
                              background: `rgba(${p.glass.tint === '#ffffff' ? '255,255,255' : p.mode === 'dark' ? '20,24,34' : '255,255,255'}, ${Math.min(0.85, p.glass.opacity / 100 + 0.06)})`,
                              borderColor: `rgba(255,255,255,${0.12 + p.glass.specular / 320})`,
                              borderRadius: Math.max(2, p.glass.radius / 3),
                            }}
                          >
                            <i style={{ background: p.accent }} />
                          </span>
                        </span>
                        <b>{p.name}</b>
                        <small>{p.tagline}</small>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="panel-section">
                <div className="panel-label">Accent</div>
                <div className="swatch-row">
                  {ACCENTS.slice(0, 8).map((c) => (
                    <button
                      key={c}
                      className={`swatch ${theme.accent === c ? 'on' : ''}`}
                      style={{ background: c, color: c }}
                      onClick={() => set({ accent: c })}
                      aria-label={`Accent ${c}`}
                    />
                  ))}
                  <label className="swatch" style={{ background: 'conic-gradient(red,yellow,lime,cyan,blue,magenta,red)', position: 'relative', overflow: 'hidden' }} title="Custom accent">
                    <input
                      type="color" value={theme.accent}
                      onChange={(e) => set({ accent: e.target.value })}
                      style={{ opacity: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                      aria-label="Custom accent colour"
                    />
                  </label>
                </div>
              </div>

              <div className="panel-section">
                <div className="panel-label">Wallpaper</div>
                <div className="wall-grid">
                  {WALLPAPERS.map((wp) => (
                    <button
                      key={wp.id}
                      className={`wall-tile ${theme.wallpaper === wp.id ? 'on' : ''}`}
                      style={{ backgroundImage: `url(${wp.src})` }}
                      title={`${wp.name} — ${wp.note}`}
                      onClick={() => set({ wallpaper: wp.id })}
                    >
                      <span>{wp.name}</span>
                    </button>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                  <div>
                    <div className="micro-label">Darken</div>
                    <Slider label="" value={theme.wallpaperDim} min={0} max={70} unit="%" onChange={(v) => set({ wallpaperDim: v })} />
                  </div>
                  <div>
                    <div className="micro-label">Blur</div>
                    <Slider label="" value={theme.wallpaperBlur} min={0} max={30} unit="px" onChange={(v) => set({ wallpaperBlur: v })} />
                  </div>
                </div>
              </div>

              <div className="panel-section">
                <div className="panel-label">Glass preview</div>
                <div className="glass-demo" style={{ backgroundImage: `url(${w.src})` }}>
                  <div className="glass-demo-card glass">
                    <span className="glass-lens" aria-hidden />
                    <div className="glass-body" style={{ padding: 10 }}>
                      <b style={{ fontSize: 11.5 }}>Live refraction</b>
                      <small className="tiny faint">blur {g.blur} · rim {g.rim}px</small>
                      <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
                        <span className="mini-btn" style={{ background: theme.accent }} />
                        <span className="mini-btn" style={{ background: 'var(--hover)' }} />
                        <span className="mini-btn" style={{ background: 'var(--hover)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'glass' && (
            <>
              <div className="panel-section">
                <div className="panel-label">
                  Glass recipe
                  <button className="reset-link" onClick={() => { applyPreset(PRESETS[0]); onToast('Glass reset to Liquid Glass') }}>
                    <RotateCcw size={11} /> Reset
                  </button>
                </div>
                {GLASS_SLIDERS.map((s) => (
                  <Slider
                    key={s.key}
                    label={s.label}
                    value={Number(g[s.key])}
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    unit={s.unit}
                    onChange={(v) => setGlass({ [s.key]: v } as Partial<GlassSettings>)}
                  />
                ))}
              </div>

              <div className="panel-section">
                <div className="panel-label">Tint colour</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <label className="tint-pick" style={{ background: g.tint }}>
                    <input type="color" value={g.tint} onChange={(e) => setGlass({ tint: e.target.value })} aria-label="Glass tint colour" />
                  </label>
                  <code style={{ fontSize: 11, color: 'var(--text-dim)' }}>{g.tint.toUpperCase()}</code>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
                    {['#dfe9ff', '#0a0e18', '#ffffff', '#170d2c', '#cfdcea'].map((c) => (
                      <button
                        key={c}
                        className="tiny-swatch"
                        style={{ background: c, outline: g.tint === c ? '2px solid var(--accent)' : undefined }}
                        onClick={() => setGlass({ tint: c })}
                        aria-label={`Tint ${c}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel-section">
                <div className="panel-label">Appearance</div>
                <div className="seg" style={{ width: '100%' }}>
                  <button className={theme.mode === 'dark' ? 'on' : ''} style={{ flex: 1 }} onClick={() => set({ mode: 'dark' })}>Dark glass</button>
                  <button className={theme.mode === 'light' ? 'on' : ''} style={{ flex: 1 }} onClick={() => set({ mode: 'light' })}>Light glass</button>
                </div>
              </div>

              <div className="export-note" style={{ marginTop: 4 }}>
                <b>Tip:</b> high blur + a saturated wallpaper gives the most convincing refraction.
                Keep tint opacity low (10–20%) for true liquid glass, higher (50%+) for readability.
              </div>
            </>
          )}

          {tab === 'export' && (
            <>
              <div className="panel-section">
                <div className="panel-label">Export theme pack</div>
                <div className="export-card">
                  <div className="export-thumb" style={{ backgroundImage: `url(${w.src})` }}>
                    <span className="export-badge"><Sparkles size={11} /> {theme.mode}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <b>{theme.name}</b>
                    <div className="tiny faint" style={{ marginTop: 2 }}>
                      {w.name} · blur {g.blur}px · {theme.accent}
                    </div>
                  </div>
                  <button className="btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} onClick={doExport} disabled={busy}>
                    <Download size={14} /> {busy ? 'Building pack…' : 'Download .theme pack'}
                  </button>
                </div>

                <div className="export-actions">
                  <button className="btn sm" onClick={doCopyCss}>
                    {copied === 'css' ? <Check size={13} /> : <Layers size={13} />} Copy CSS
                  </button>
                  <button className="btn sm" onClick={doCopyJson}>
                    {copied === 'json' ? <Check size={13} /> : <FileJson size={13} />} Copy JSON
                  </button>
                  <button className="btn sm" onClick={() => { downloadWallpaper(theme); onToast('Wallpaper download started') }}>
                    <ImageIcon size={13} /> Wallpaper
                  </button>
                  <button className="btn sm" onClick={() => fileRef.current?.click()}>
                    <Upload size={13} /> Import JSON
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/json,.json"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) importPreset(f)
                      e.target.value = ''
                    }}
                  />
                  <button className="btn sm" onClick={() => setTab('glass')}>
                    <Droplets size={13} /> Tune glass
                  </button>
                </div>

                <div className="export-note">
                  <b>Inside the zip</b>
                  <ul>
                    <li><code>{theme.name || 'Liquid Glass'}.theme</code> — accent, mode, wallpaper</li>
                    <li><code>wallpaper.jpg</code> — 16:9, ready for Windows</li>
                    <li><code>install.ps1</code> — one-step Windows 11 installer</li>
                    <li><code>glass-tokens.css</code> — your glass recipe as CSS</li>
                    <li><code>preset.json</code> — round-trips into this Studio</li>
                    <li><code>README.md</code> — install + deeper-glass tools</li>
                  </ul>
                </div>

                <div className="export-note" style={{ marginTop: 8 }}>
                  <b>Heads up:</b> Windows applies wallpaper, accent and mode from a .theme file.
                  Per-window liquid glass needs a compositor tool — the README lists safe options
                  (Windhawk, DWMBlurGlass, TranslucentTB).
                </div>
              </div>
            </>
          )}
        </div>

        <div className="studio-foot">
          <button className="btn primary" style={{ flex: 1, justifyContent: 'center' }} onClick={doExport} disabled={busy}>
            <Download size={14} /> {busy ? 'Building…' : 'Export theme pack'}
          </button>
          <button className="icon-btn" title="Copy glass CSS" onClick={doCopyCss}>
            <Copy size={15} />
          </button>
          <button className="icon-btn" title="Close panel" onClick={onClose}>
            <X size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
