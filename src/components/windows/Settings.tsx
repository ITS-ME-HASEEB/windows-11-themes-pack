import { useState, type CSSProperties, type ReactNode } from 'react'
import {
  Accessibility, Bell, Bluetooth, ChevronRight, Cloud, Contrast, Cpu, Download,
  Gamepad2, Globe2, Info, Keyboard, Languages, Lock, Monitor, Moon, Palette,
  Plane, Power, Printer, Search, ShieldCheck, Smartphone, Sparkles, Store,
  Sun, User, Wifi, Grid2x2, SlidersHorizontal, Droplets, Layers, Lightbulb,
  AppWindow, Paintbrush, RefreshCw, CircleHelp, HardDrive, Zap,
} from 'lucide-react'
import type { GlassSettings, ThemeSettings } from '../../lib/types'
import { ACCENTS, PRESETS, presetToTheme, type Preset } from '../../lib/presets'
import { WALLPAPERS } from '../../lib/wallpapers'

type Props = {
  theme: ThemeSettings
  onChange: (t: ThemeSettings) => void
  onExport: () => void
  onToast: (m: string) => void
}

type SectionId =
  | 'system' | 'bluetooth' | 'network' | 'personalization' | 'apps' | 'accounts'
  | 'time' | 'gaming' | 'accessibility' | 'privacy' | 'update' | 'about'

const SECTIONS: { id: SectionId; name: string; icon: typeof Sun }[] = [
  { id: 'system', name: 'System', icon: Monitor },
  { id: 'bluetooth', name: 'Bluetooth & devices', icon: Bluetooth },
  { id: 'network', name: 'Network & internet', icon: Wifi },
  { id: 'personalization', name: 'Personalization', icon: Palette },
  { id: 'apps', name: 'Apps', icon: AppWindow },
  { id: 'accounts', name: 'Accounts', icon: User },
  { id: 'time', name: 'Time & language', icon: Languages },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
  { id: 'accessibility', name: 'Accessibility', icon: Accessibility },
  { id: 'privacy', name: 'Privacy & security', icon: ShieldCheck },
  { id: 'update', name: 'Windows Update', icon: Download },
]

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      className="toggle"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={(e) => { e.stopPropagation(); onChange() }}
    />
  )
}

function Row({
  icon, title, sub, right, onClick,
}: { icon?: ReactNode; title: string; sub?: string; right?: ReactNode; onClick?: () => void }) {
  return (
    <div className={`set-row ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      {icon && <span className="ico">{icon}</span>}
      <span className="txt">
        <b>{title}</b>
        {sub && <small>{sub}</small>}
      </span>
      {right ?? (onClick ? <ChevronRight size={15} className="faint" /> : null)}
    </div>
  )
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select className="set-select" value={value} onChange={(e) => onChange(e.target.value)} onClick={(e) => e.stopPropagation()}>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  )
}

export default function Settings({ theme, onChange, onExport, onToast }: Props) {
  const [section, setSection] = useState<SectionId>('personalization')
  const [q, setQ] = useState('')
  const [reduceTransparency, setReduceTransparency] = useState(false)
  const [animations, setAnimations] = useState(true)

  const g = theme.glass
  const set = (patch: Partial<ThemeSettings>) => onChange({ ...theme, ...patch })
  const setGlass = (patch: Partial<GlassSettings>) => onChange({ ...theme, glass: { ...g, ...patch } })
  const applyPreset = (p: Preset) => { onChange(presetToTheme(p)); onToast(`Applied “${p.name}”`) }

  const nav = SECTIONS.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()))

  const gpu = [theme.glass.blur, theme.glass.opacity, theme.glass.rim]

  return (
    <div className="settings">
      <div className="set-side">
        <div className="set-user">
          <span className="avatar">AM</span>
          <div>
            <b>Alex Morgan</b>
            <small>alex@liquidglass.studio</small>
          </div>
        </div>
        <label className="start-search set-search" style={{ height: 30 }}>
          <Search size={14} className="faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a setting" aria-label="Find a setting" />
        </label>
        <div className="set-nav">
          {nav.map((s) => (
            <button
              key={s.id}
              className={`set-nav-item ${section === s.id ? 'on' : ''}`}
              onClick={() => setSection(s.id)}
              title={s.name}
            >
              <s.icon size={15} />
              <span>{s.name}</span>
            </button>
          ))}
          <div className="divider" />
          <button className={`set-nav-item ${section === 'about' ? 'on' : ''}`} onClick={() => setSection('about')}>
            <CircleHelp size={15} />
            <span>About & Studio</span>
          </button>
        </div>
      </div>

      <div className="set-main">
        {section === 'personalization' ? (
          <>
            <h2 className="set-title">Personalization</h2>
            <div className="set-sub">
              Live glass design — every change applies instantly to Explorer, Task Manager and this window.
            </div>

            <div className="set-card">
              <div className="set-row">
                <span className="ico"><Palette size={14} /></span>
                <span className="txt">
                  <b>Liquid Glass Studio</b>
                  <small>Your theme is editable in the Design panel and in the previews.</small>
                </span>
                <span className="chip"><Sparkles size={11} /> Live</span>
              </div>
              <div className="set-row">
                <span className="ico">{theme.mode === 'dark' ? <Moon size={14} /> : <Sun size={14} />}</span>
                <span className="txt">
                  <b>Appearance</b>
                  <small>Choose your mode. Glass adapts its tint and text contrast.</small>
                </span>
                <div className="seg">
                  <button className={theme.mode === 'dark' ? 'on' : ''} onClick={() => set({ mode: 'dark' })}>Dark</button>
                  <button className={theme.mode === 'light' ? 'on' : ''} onClick={() => set({ mode: 'light' })}>Light</button>
                </div>
              </div>
            </div>

            <div className="card-title"><Palette size={14} /> Background</div>
            <div className="set-card">
              <div style={{ padding: '12px 14px 0' }}>
                <div className="set-wall-grid" style={{ padding: 0 }}>
                  {WALLPAPERS.map((w) => (
                    <button
                      key={w.id}
                      className={`set-wall ${theme.wallpaper === w.id ? 'on' : ''}`}
                      style={{ backgroundImage: `url(${w.src})` }}
                      title={`${w.name} — ${w.note}`}
                      aria-label={w.name}
                      onClick={() => set({ wallpaper: w.id })}
                    />
                  ))}
                </div>
              </div>
              <div className="glass-mini">
                <div className="slider-row">
                  <div className="top"><span>Darken wallpaper</span><span className="val">{theme.wallpaperDim}%</span></div>
                  <input type="range" min={0} max={70} value={theme.wallpaperDim}
                    style={{ '--fill': `${(theme.wallpaperDim / 70) * 100}%` } as CSSProperties}
                    onChange={(e) => set({ wallpaperDim: +e.target.value })} aria-label="Darken wallpaper" />
                </div>
                <div className="slider-row" style={{ marginBottom: 0 }}>
                  <div className="top"><span>Background blur</span><span className="val">{theme.wallpaperBlur}px</span></div>
                  <input type="range" min={0} max={30} value={theme.wallpaperBlur}
                    style={{ '--fill': `${(theme.wallpaperBlur / 30) * 100}%` } as CSSProperties}
                    onChange={(e) => set({ wallpaperBlur: +e.target.value })} aria-label="Background blur" />
                </div>
              </div>
            </div>

            <div className="card-title"><Droplets size={14} /> Colors</div>
            <div className="set-card">
              <div className="accent-grid">
                {ACCENTS.map((c) => (
                  <button
                    key={c}
                    className={`swatch ${theme.accent === c ? 'on' : ''}`}
                    style={{ background: c, color: c }}
                    onClick={() => set({ accent: c })}
                    aria-label={`Accent ${c}`}
                  />
                ))}
                <label className="swatch" style={{ background: 'conic-gradient(red,yellow,lime,cyan,blue,magenta,red)', position: 'relative', overflow: 'hidden' }}>
                  <input type="color" value={theme.accent} onChange={(e) => set({ accent: e.target.value })}
                    style={{ opacity: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer' }} aria-label="Custom accent" />
                </label>
              </div>
            </div>

            <div className="card-title"><Layers size={14} /> Liquid glass effects</div>
            <div className="set-card">
              <Row
                icon={<Contrast size={14} />}
                title="Transparency effects"
                sub="Frosted blur on windows, taskbar and the Start menu"
                right={<Toggle on={!reduceTransparency} label="Transparency effects" onChange={() => {
                  setReduceTransparency((v) => !v)
                  setGlass(reduceTransparency ? { blur: 30, opacity: 14 } : { blur: 0, opacity: 96 })
                }} />}
              />
              <Row
                icon={<Lightbulb size={14} />}
                title="Specular highlights"
                sub="Bright rim light that follows the top-left edge"
                right={<Toggle on={g.specular > 0} label="Specular highlights" onChange={() => setGlass({ specular: g.specular > 0 ? 0 : 58 })} />}
              />
              <Row
                icon={<Layers size={14} />}
                title="Refractive lens rim"
                sub="The thick glass edge that bends the wallpaper underneath"
                right={<Toggle on={g.rim > 0} label="Refractive lens rim" onChange={() => setGlass({ rim: g.rim > 0 ? 0 : 1.2 })} />}
              />
              <div className="glass-mini">
                {([
                  ['Background blur', g.blur, 0, 80, 'px', (v: number) => setGlass({ blur: v })],
                  ['Glass tint opacity', g.opacity, 0, 100, '%', (v: number) => setGlass({ opacity: v })],
                  ['Saturation', g.saturation, 50, 300, '%', (v: number) => setGlass({ saturation: v })],
                  ['Corner radius', g.radius, 0, 32, 'px', (v: number) => setGlass({ radius: v })],
                  ['Rim thickness', g.rim, 0, 4, 'px', (v: number) => setGlass({ rim: v })],
                ] as const).map(([label, value, min, max, unit, fn]) => (
                  <div className="slider-row" key={label}>
                    <div className="top"><span>{label}</span><span className="val">{value}{unit}</span></div>
                    <input
                      type="range" min={min} max={max} value={value}
                      style={{ '--fill': `${((value - min) / (max - min)) * 100}%` } as CSSProperties}
                      onChange={(e) => fn(+e.target.value)}
                      aria-label={label}
                    />
                  </div>
                ))}
                <div className="tiny faint" style={{ marginTop: -2 }}>
                  Blur {g.blur}px · Tint {g.tint.toUpperCase()} · GPU {gpu.join(' / ')}
                </div>
              </div>
            </div>

            <div className="card-title"><Grid2x2 size={14} /> Themes</div>
            <div className="set-card">
              {PRESETS.map((p) => (
                <Row
                  key={p.id}
                  icon={<span style={{ width: 16, height: 16, borderRadius: 4, background: p.accent, display: 'block' }} />}
                  title={p.name}
                  sub={p.tagline}
                  right={
                    <button className="btn sm" onClick={(e) => { e.stopPropagation(); applyPreset(p) }}>Apply</button>
                  }
                />
              ))}
            </div>

            <div className="set-card">
              <Row
                icon={<Download size={14} />}
                title="Export theme pack"
                sub=".theme file, wallpaper, glass tokens CSS and preset JSON in a zip"
                onClick={onExport}
              />
            </div>
          </>
        ) : section === 'about' ? (
          <>
            <h2 className="set-title">About & Studio</h2>
            <div className="set-sub">A design tool for a liquid glass take on Windows 11.</div>
            <div className="about-hero">
              <div className="mark"><Sparkles size={26} style={{ color: 'var(--accent)' }} /></div>
              <div>
                <h3>Liquid Glass Studio</h3>
                <p>
                  Tune the glass once, preview it across Explorer, Task Manager and Settings,
                  then export a real Windows 11 theme pack.
                </p>
                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className="chip">v1.0</span>
                  <span className="chip">{PRESETS.length} presets</span>
                  <span className="chip">{WALLPAPERS.length} wallpapers</span>
                </div>
              </div>
            </div>
            <div className="set-card">
              <Row icon={<Layers size={14} />} title="Current theme" sub={theme.name} />
              <Row icon={<Droplets size={14} />} title="Glass recipe"
                sub={`blur ${g.blur}px · tint ${g.tint} · rim ${g.rim}px · specular ${g.specular}%`} />
              <Row icon={<Palette size={14} />} title="Accent" sub={theme.accent} />
              <Row icon={<HardDrive size={14} />} title="Export" sub="Windows .theme + assets + CSS" onClick={onExport} />
              <Row icon={<RefreshCw size={14} />} title="Reset to Liquid Glass defaults"
                sub="Restores the Liquid Glass preset and Aurora wallpaper"
                onClick={() => { applyPreset(PRESETS[0]); onToast('Theme reset to Liquid Glass defaults') }} />
            </div>
            <div className="set-card">
              <Row icon={<Info size={14} />} title="How to install on Windows 11"
                sub="Open the exported .theme file, or run install.ps1 inside the pack." />
              <Row icon={<ShieldCheck size={14} />} title="Note"
                sub="Windows does not allow per-window acrylic without tools such as Windhawk or DWMBlurGlass. The pack includes guidance." />
            </div>
          </>
        ) : (
          <GenericSection section={section} onToast={onToast} onExport={onExport} />
        )}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */

const GENERIC: Record<string, { title: string; sub: string; rows: { icon: any; title: string; sub?: string; right?: 'toggle' | 'chevron' | string }[] }> = {
  system: {
    title: 'System',
    sub: 'Display, sound, notifications, power',
    rows: [
      { icon: Monitor, title: 'Display', sub: 'LG UltraFine 32" · 2560 × 1440 · 120 Hz', right: 'chevron' },
      { icon: Sun, title: 'Night light', sub: 'Schedule: 9:00 PM – 7:00 AM', right: 'toggle' },
      { icon: Bell, title: 'Notifications', sub: 'Focus assist during presentations', right: 'chevron' },
      { icon: Power, title: 'Power & battery', sub: 'Balanced · 86% · 4h 12m remaining', right: 'chevron' },
      { icon: HardDrive, title: 'Storage', sub: '412 GB free of 1 TB', right: 'chevron' },
      { icon: Zap, title: 'Energy recommendations', sub: '2 suggestions available', right: 'chevron' },
    ],
  },
  bluetooth: {
    title: 'Bluetooth & devices',
    sub: 'Manage phones, mice, pens, printers',
    rows: [
      { icon: Bluetooth, title: 'Bluetooth', sub: 'On · discoverable as DESKTOP-LIQUID', right: 'toggle' },
      { icon: Keyboard, title: 'MX Keys Mini', sub: 'Connected · 78% battery', right: 'chevron' },
      { icon: Printer, title: 'Printers & scanners', sub: '2 printers', right: 'chevron' },
      { icon: Smartphone, title: 'Phone Link', sub: 'Pixel 9 · notifications on', right: 'chevron' },
    ],
  },
  network: {
    title: 'Network & internet',
    sub: 'Wi-Fi, Ethernet, VPN',
    rows: [
      { icon: Wifi, title: 'Liquid-Glass-5G', sub: 'Connected, secured · signal excellent', right: 'chevron' },
      { icon: Globe2, title: 'Wi-Fi properties', sub: '802.11ax · 5 GHz · 1.2 Gbps', right: 'chevron' },
      { icon: Plane, title: 'Airplane mode', sub: 'Off', right: 'toggle' },
      { icon: ShieldCheck, title: 'VPN', sub: 'No active connection', right: 'chevron' },
    ],
  },
  apps: {
    title: 'Apps',
    sub: 'Installed apps, defaults, startup',
    rows: [
      { icon: Store, title: 'Installed apps', sub: '62 apps · 48.2 GB used', right: 'chevron' },
      { icon: AppWindow, title: 'Default apps', sub: 'Explorer, Edge, Photos', right: 'chevron' },
      { icon: Layers, title: 'Startup', sub: '4 apps enabled', right: 'chevron' },
      { icon: Sparkles, title: 'Liquid Glass Studio', sub: 'Theme pack · 48.2 MB', right: 'chevron' },
    ],
  },
  accounts: {
    title: 'Accounts',
    sub: 'Windows backup, family, other users',
    rows: [
      { icon: User, title: 'Alex Morgan', sub: 'alex@liquidglass.studio · Administrator', right: 'chevron' },
      { icon: Cloud, title: 'Windows backup', sub: 'Last synced 20 minutes ago', right: 'chevron' },
      { icon: Lock, title: 'Sign-in options', sub: 'Windows Hello face, PIN', right: 'chevron' },
      { icon: AppWindow, title: 'Family & other users', sub: '1 other account', right: 'chevron' },
    ],
  },
  time: {
    title: 'Time & language',
    sub: 'Date, time, region, typing',
    rows: [
      { icon: Globe2, title: 'Region', sub: 'Pakistan · English (Pakistan)', right: 'chevron' },
      { icon: Languages, title: 'Language & region', sub: 'English (United States)', right: 'chevron' },
      { icon: Keyboard, title: 'Typing', sub: 'Touch keyboard, text suggestions', right: 'chevron' },
    ],
  },
  gaming: {
    title: 'Gaming',
    sub: 'Game Bar, captures, game mode',
    rows: [
      { icon: Gamepad2, title: 'Game Bar', sub: 'Open with Win + G', right: 'toggle' },
      { icon: Monitor, title: 'Game Mode', sub: 'Prioritises your game', right: 'toggle' },
      { icon: Cpu, title: 'Captures', sub: 'Record at 1080p 60 fps · 30 s clips', right: 'chevron' },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    sub: 'Vision, hearing, interaction',
    rows: [
      { icon: Contrast, title: 'Visual effects', sub: 'Transparency, animations, scrollbars', right: 'chevron' },
      { icon: Sparkles, title: 'Transparency effects', sub: 'Adds frosted glass depth', right: 'toggle' },
      { icon: Accessibility, title: 'Text size', sub: '100%', right: 'chevron' },
      { icon: Keyboard, title: 'Keyboard', sub: 'Sticky keys, filter keys', right: 'chevron' },
      { icon: Bell, title: 'Captions', sub: 'Off', right: 'chevron' },
    ],
  },
  privacy: {
    title: 'Privacy & security',
    sub: 'Windows Security, permissions',
    rows: [
      { icon: ShieldCheck, title: 'Windows Security', sub: 'No actions needed · protected', right: 'chevron' },
      { icon: Lock, title: 'Device encryption', sub: 'On · BitLocker', right: 'chevron' },
      { icon: Bell, title: 'Notifications & permissions', sub: '18 apps', right: 'chevron' },
      { icon: HardDrive, title: 'Find my device', sub: 'On', right: 'toggle' },
    ],
  },
  update: {
    title: 'Windows Update',
    sub: 'You are up to date',
    rows: [
      { icon: Download, title: 'Check for updates', sub: 'Last checked today, 9:14 AM', right: 'chevron' },
      { icon: ShieldCheck, title: 'Windows 11, version 24H2', sub: 'Installed 10/12/2026', right: 'chevron' },
      { icon: Zap, title: 'Get the latest updates as soon as they’re available', sub: 'On', right: 'toggle' },
      { icon: Info, title: 'Pause updates', sub: 'For 1 week', right: 'chevron' },
    ],
  },
}

function GenericSection({
  section, onToast, onExport,
}: { section: SectionId; onToast: (m: string) => void; onExport: () => void }) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({})
  const [pick, setPick] = useState('Recommended')
  const cfg = GENERIC[section]
  if (!cfg) return null

  return (
    <>
      <h2 className="set-title">{cfg.title}</h2>
      <div className="set-sub">{cfg.sub}</div>
      <div className="set-card">
        {cfg.rows.map((r) => (
          <Row
            key={r.title}
            icon={<r.icon size={14} />}
            title={r.title}
            sub={r.sub}
            right={
              r.right === 'toggle' ? (
                <Toggle
                  on={toggles[r.title] ?? true}
                  label={r.title}
                  onChange={() => {
                    setToggles((t) => ({ ...t, [r.title]: !(t[r.title] ?? true) }))
                    onToast(`${r.title} ${(toggles[r.title] ?? true) ? 'disabled' : 'enabled'}`)
                  }}
                />
              ) : r.right === 'chevron' || !r.right ? (
                <ChevronRight size={15} className="faint" />
              ) : undefined
            }
            onClick={r.right === 'toggle' ? undefined : () => onToast(`${r.title} — preview only`)}
          />
        ))}
      </div>

      <div className="set-card">
        <Row
          icon={<Sparkles size={14} />}
          title="Liquid Glass styling"
          sub="Explorer, Task Manager and Settings inherit the same glass recipe"
          right={<Select value={pick} options={['Recommended', 'High contrast', 'Subtle']} onChange={(v) => { setPick(v); onToast(`Glass density: ${v}`) }} />}
        />
        <Row icon={<Paintbrush size={14} />} title="Export current theme" sub="Download a .theme pack with assets" onClick={onExport} />
      </div>
      <div className="export-note">
        <b>{cfg.title}</b> is a visual mock. The design tokens you set in Personalization
        still apply here — notice the same corner radius, rim light and tint through the rows above.
      </div>
    </>
  )
}
