import { useMemo, useState } from 'react'
import {
  ArrowLeft, ArrowRight, ArrowUp, ChevronRight, ChevronDown, Cloud,
  Copy, Download, FileArchive, FileText, Film, Folder, FolderOpen, GalleryVerticalEnd,
  HardDrive, Home, Image as ImageIcon, LayoutGrid, List, Music, Network,
  Monitor, MoreHorizontal, Plus, RefreshCw, Scissors, Search, Share2, Star,
  Trash2, Wifi, X, Clock3, File, SortAsc, PanelRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { FOLDERS, NAV_GROUPS, type VFile } from '../../lib/files'

const NAV_ICONS: Record<string, LucideIcon> = {
  home: Home, gallery: GalleryVerticalEnd, desktop: Monitor, download: Download,
  doc: FileText, image: ImageIcon, music: Music, video: Film, pc: HardDrive,
  network: Network, bin: Trash2, pack: Star,
}

function fileIcon(f: VFile): LucideIcon {
  switch (f.kind) {
    case 'image': return ImageIcon
    case 'video': return Film
    case 'music': return Music
    case 'archive': return FileArchive
    case 'folder': return Folder
    case 'doc': return FileText
    default: return File
  }
}

const FILE_COLOR: Record<string, string> = {
  folder: '#f5c34b', image: '#61d095', doc: '#6ea8fe', video: '#c084fc',
  music: '#f472b6', archive: '#fbbf24', app: '#8ab4f8',
}

function Thumb({ f, small }: { f: VFile; small?: boolean }) {
  const Icon = fileIcon(f)
  if (f.src) return <img src={f.src} alt="" loading="lazy" />
  if (f.gradient) return <div style={{ width: '100%', height: '100%', background: f.gradient }} />
  return (
    <Icon
      size={small ? 18 : f.kind === 'folder' ? 40 : 30}
      strokeWidth={f.kind === 'folder' ? 1.4 : 1.6}
      style={{ color: FILE_COLOR[f.kind] }}
      fill={f.kind === 'folder' ? 'rgba(245,195,75,.16)' : 'none'}
    />
  )
}

export default function Explorer({ onToast, initialPath = 'Home' }: { onToast: (m: string) => void; initialPath?: string }) {
  const [path, setPath] = useState(initialPath)
  const [history, setHistory] = useState<string[]>([initialPath])
  const [hi, setHi] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [query, setQuery] = useState('')
  const [showDetails, setShowDetails] = useState(true)
  const [sortDesc, setSortDesc] = useState(false)

  const go = (p: string) => {
    const next = history.slice(0, hi + 1)
    next.push(p)
    setHistory(next)
    setHi(next.length - 1)
    setPath(p)
    setSelected(null)
    setQuery('')
  }

  const back = () => {
    if (hi <= 0) return
    setHi(hi - 1)
    setPath(history[hi - 1])
    setSelected(null)
  }
  const forward = () => {
    if (hi >= history.length - 1) return
    setHi(hi + 1)
    setPath(history[hi + 1])
    setSelected(null)
  }
  const up = () => {
    if (path !== 'Home') go('Home')
  }

  const items = useMemo(() => {
    let list = FOLDERS[path] ?? []
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((f) => f.name.toLowerCase().includes(q))
      if (!list.length) {
        const all = Object.values(FOLDERS).flat().filter((f) => f.name.toLowerCase().includes(q))
        list = Array.from(new Map(all.map((f) => [f.name, f])).values())
      }
    }
    if (path === 'Home' || !FOLDERS[path]) {
      // keep folder-first ordering
      list = [...list].sort((a, b) => (a.kind === 'folder' ? -1 : 0) - (b.kind === 'folder' ? -1 : 0))
    }
    if (sortDesc) list = [...list].reverse()
    return list
  }, [path, query, sortDesc])

  const sel = items.find((f) => f.name === selected) ?? null
  const openItem = (f: VFile) => {
    setSelected(f.name)
    if (f.kind === 'folder') go(f.name)
  }

  return (
    <div className="exp">
      <div className="exp-tabstrip">
        <div className="exp-tab on">
          <Folder size={13} style={{ color: FILE_COLOR.folder }} fill="rgba(245,195,75,.2)" />
          <span>{path}</span>
          <X size={12} className="faint" />
        </div>
        <div className="exp-tab">
          <Folder size={13} style={{ color: FILE_COLOR.folder }} fill="rgba(245,195,75,.2)" />
          <span>Liquid Glass Pack</span>
          <X size={12} className="faint" />
        </div>
        <button className="icon-btn" style={{ width: 26, height: 26 }} title="New tab" onClick={() => onToast('New tab — not needed in this preview')}>
          <Plus size={15} />
        </button>
      </div>

      <div className="exp-nav">
        <button className="icon-btn" onClick={back} disabled={hi <= 0} style={{ opacity: hi <= 0 ? 0.4 : 1 }} title="Back">
          <ArrowLeft size={16} />
        </button>
        <button className="icon-btn" onClick={forward} disabled={hi >= history.length - 1} style={{ opacity: hi >= history.length - 1 ? 0.4 : 1 }} title="Forward">
          <ArrowRight size={16} />
        </button>
        <button className="icon-btn" onClick={up} title="Up"><ArrowUp size={16} /></button>
        <div className="exp-crumbs">
          <button onClick={() => go('Home')}>Home</button>
          {path !== 'Home' && (
            <>
              <ChevronRight size={12} className="faint" />
              <span className="crumb-here">{path}</span>
            </>
          )}
          <ChevronDown size={12} className="faint" style={{ marginLeft: 4 }} />
        </div>
        <button className="icon-btn" onClick={() => { setQuery(''); setSelected(null) }} title="Refresh">
          <RefreshCw size={15} />
        </button>
        <label className="exp-search">
          <Search size={14} className="faint" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" aria-label="Search files" />
          {query && <button className="no-drag" onClick={() => setQuery('')} aria-label="Clear"><X size={12} /></button>}
        </label>
      </div>

      <div className="exp-command">
        <button className="cmd" style={{ background: 'var(--accent)', color: 'var(--accent-on)', fontWeight: 600, padding: '5px 10px' }} onClick={() => onToast('New item — this is a preview')}>
          <Plus size={14} /> New
        </button>
        <span className="command-sep" />
        <button className="cmd" onClick={() => onToast('Cut')}><Scissors size={14} /> Cut</button>
        <button className="cmd" onClick={() => onToast('Copied selection')}><Copy size={14} /> Copy</button>
        <button className="cmd" onClick={() => onToast('Nothing to paste')}><FileText size={14} /> Paste</button>
        <button className="cmd" onClick={() => onToast('Renamed — preview only')}><FileText size={14} /> Rename</button>
        <button className="cmd" onClick={() => onToast('Share sheet opened')}><Share2 size={14} /> Share</button>
        <button className="cmd danger" onClick={() => onToast(sel ? `“${sel.name}” sent to Recycle Bin (preview)` : 'Select an item first')}><Trash2 size={14} /> Delete</button>
        <span className="command-sep" />
        <button className="cmd" onClick={() => setSortDesc((v) => !v)}><SortAsc size={14} /> Sort</button>
        <button className="cmd" onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
          {view === 'grid' ? <List size={14} /> : <LayoutGrid size={14} />} View
        </button>
        <button className="cmd" onClick={() => onToast('More options')}><MoreHorizontal size={14} /></button>
      </div>

      <div className="exp-main">
        <div className="exp-side">
          {NAV_GROUPS.map((g, gi) => (
            <div className="side-group" key={gi}>
              {g.label && (
                <div className="faint tiny" style={{ padding: '8px 10px 4px', fontWeight: 600 }}>{g.label}</div>
              )}
              {g.items.map((it) => {
                const Icon = NAV_ICONS[it.icon] ?? Folder
                return (
                  <button
                    key={it.name}
                    className={`side-item ${path === it.name ? 'on' : ''}`}
                    onClick={() => go(it.name)}
                  >
                    <Icon size={15} style={{ color: path === it.name ? 'var(--accent)' : FILE_COLOR[it.icon] ?? undefined }} />
                    {it.name}
                  </button>
                )
              })}
            </div>
          ))}
          <div className="divider" />
          <div className="side-item" style={{ opacity: 0.9 }}>
            <Cloud size={15} style={{ color: '#60a5fa' }} />
            OneDrive
            <ChevronRight size={13} className="chev" />
          </div>
          <div className="side-item" style={{ opacity: 0.9 }}>
            <Wifi size={15} style={{ color: '#34d399' }} />
            Studio-NAS
            <ChevronRight size={13} className="chev" />
          </div>
        </div>

        <div className="exp-list">
          {path === 'Home' && !query && (
            <div className="exp-section-title"><Clock3 size={13} /> Quick access</div>
          )}
          {path === 'Gallery' && (
            <div className="exp-section-title"><ImageIcon size={13} /> Gallery — all pictures</div>
          )}
          {path === 'Liquid Glass Pack' && (
            <div className="exp-section-title"><Star size={13} /> Exported assets ready for Windows 11</div>
          )}
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="ring"><Trash2 size={22} className="faint" /></div>
              {path === 'Recycle Bin' ? 'Recycle Bin is empty' : 'Nothing matches your search'}
              <span className="tiny">Try a different folder or search term.</span>
            </div>
          ) : (
            <div className={`files ${view === 'list' ? 'list' : ''}`}>
              {items.map((f) => (
                <button
                  key={f.name}
                  className={`file ${selected === f.name ? 'on' : ''}`}
                  onClick={() => setSelected(f.name)}
                  onDoubleClick={() => openItem(f)}
                  title={f.name}
                >
                  <div className="thumb"><Thumb f={f} small={view === 'list'} /></div>
                  <span className="name">{f.name}</span>
                  {view === 'grid' && (f.meta ?? f.size) && (
                    <span className="meta">{f.meta ?? f.size}</span>
                  )}
                  {view === 'list' && <span className="meta">{f.size ?? f.meta ?? '—'}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {showDetails && (
          <div className="exp-details">
            {sel ? (
              <>
                <div className="detail-thumb">
                  {sel.src ? <img src={sel.src} alt="" /> : <Thumb f={sel} />}
                </div>
                <div className="detail-name">{sel.name}</div>
                <div className="detail-row"><span>Type</span><b>{sel.kind === 'folder' ? 'File folder' : sel.name.split('.').pop()?.toUpperCase() + ' file'}</b></div>
                <div className="detail-row"><span>Size</span><b>{sel.size ?? sel.meta ?? '—'}</b></div>
                <div className="detail-row"><span>Modified</span><b>{sel.modified ?? '—'}</b></div>
                <div className="detail-row"><span>Location</span><b>{path}</b></div>
                <div className="divider" />
                <button className="btn sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => openItem(sel)}>
                  <FolderOpen size={13} /> Open
                </button>
                <div className="tiny faint" style={{ marginTop: 10, lineHeight: 1.5 }}>
                  Preview pane styling follows the glass theme tokens — same radius, rim and specular sweep as the window.
                </div>
              </>
            ) : (
              <>
                <div className="detail-thumb"><ImageIcon size={30} className="faint" /></div>
                <div className="detail-name">No item selected</div>
                <div className="tiny faint" style={{ lineHeight: 1.55 }}>
                  Select a file to inspect it. Thumbnails, the command bar and this pane all inherit your glass settings in real time.
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="exp-status">
        <span>{items.length} items</span>
        <span>{sel ? '1 item selected' : ''}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button title="Grid" onClick={() => setView('grid')} style={{ opacity: view === 'grid' ? 1 : 0.45 }}><LayoutGrid size={13} /></button>
          <button title="List" onClick={() => setView('list')} style={{ opacity: view === 'list' ? 1 : 0.45 }}><List size={13} /></button>
        </span>
      </div>
    </div>
  )
}
