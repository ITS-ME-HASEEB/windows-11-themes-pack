import { useMemo, useState } from 'react'
import {
  Activity, Cpu, Database, Gauge, History, List, MemoryStick, Network,
  Play, Power, Rocket, Search, Server, Trash2, Users, HardDrive, Wifi,
  ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, Layers, SquareTerminal,
} from 'lucide-react'
import { useHistory, useTicker, wave } from '../../lib/useTicker'

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type ProcSeed = {
  name: string
  cpu: number
  mem: number
  disk: number
  net: number
  gpu: number
  amp: number
  phase: number
  status?: string
}
type GroupSeed = {
  name: string
  glyph: string
  gradient: string
  procs: ProcSeed[]
  note?: string
}

const p = (name: string, cpu: number, mem: number, disk: number, net: number, gpu: number, amp = 1, phase = 0, status?: string): ProcSeed =>
  ({ name, cpu, mem, disk, net, gpu, amp, phase, status })

const GROUP_SEEDS: GroupSeed[] = [
  {
    name: 'File Explorer', glyph: 'FE', gradient: 'linear-gradient(150deg,#ffd968,#e8a317)',
    procs: [
      p('File Explorer', 1.4, 128.4, 0.2, 0, 0.3, 1.2, 1),
      p('File Explorer (8)', 0.6, 96.1, 0.1, 0, 0.1, 0.8, 2),
      p('Windows Search Indexer', 0.3, 44.8, 1.8, 0, 0, 0.5, 3, 'Suspended'),
    ],
  },
  {
    name: 'Microsoft Edge', glyph: 'E', gradient: 'linear-gradient(150deg,#4fd1c5,#0a7ea4)',
    procs: [
      p('Microsoft Edge', 2.8, 214.2, 0.4, 0.6, 1.2, 2.1, 0.4),
      p('Microsoft Edge (12)', 0.9, 188.6, 0.1, 0.2, 0.4, 1.4, 1.8),
      p('Microsoft Edge (GPU)', 0.4, 96.3, 0, 0, 3.1, 1.1, 2.4),
      p('Microsoft Edge (Utility)', 0.2, 61.4, 0, 0.1, 0, 0.6, 3.1),
      p('Microsoft Edge (Renderer)', 1.1, 342.8, 0.2, 0.3, 0.8, 1.6, 4.2),
    ],
  },
  {
    name: 'Liquid Glass Studio', glyph: 'LG', gradient: 'linear-gradient(150deg,#8ed8ff,#6d28d9)',
    procs: [
      p('Liquid Glass Studio', 6.2, 268.5, 0.6, 0.1, 4.8, 2.8, 0.7),
      p('Liquid Glass Renderer', 3.4, 142.9, 0.2, 0, 6.2, 2.2, 1.3),
    ],
  },
  {
    name: 'Task Manager', glyph: 'TM', gradient: 'linear-gradient(150deg,#7ee2a8,#16915a)',
    procs: [p('Task Manager', 2.1, 84.6, 0.3, 0, 0.9, 1.1, 2.2)],
  },
  {
    name: 'Settings', glyph: 'S', gradient: 'linear-gradient(150deg,#92dcff,#1878c8)',
    procs: [
      p('Settings', 0.8, 72.1, 0.1, 0, 0.4, 0.6, 3.4),
      p('System Settings', 0.3, 38.4, 0, 0, 0.1, 0.4, 4.1),
    ],
  },
  {
    name: 'Windows Terminal', glyph: '>_', gradient: 'linear-gradient(150deg,#3b3b48,#16161c)',
    procs: [
      p('Windows Terminal', 1.2, 74.8, 0.1, 0, 0.2, 1.3, 0.9),
      p('OpenSSH Authentication Agent', 0, 4.2, 0, 0, 0, 0.2, 2.8),
    ],
  },
  {
    name: 'Spotify', glyph: '♪', gradient: 'linear-gradient(150deg,#5ce68e,#148a4b)',
    procs: [
      p('Spotify', 1.8, 198.2, 0.2, 1.4, 0.6, 1.9, 1.1),
      p('Spotify (5)', 0.6, 112.4, 0.1, 0.4, 0.2, 1.1, 2.6),
    ],
  },
  {
    name: 'Steam', glyph: 'ST', gradient: 'linear-gradient(150deg,#7fb0ff,#1b4fc4)',
    procs: [
      p('Steam', 1.1, 164.7, 0.4, 0.2, 0.3, 1.4, 3.3),
      p('Steam Service (32 bit)', 0.2, 48.2, 0.1, 0, 0, 0.5, 0.5),
      p('Steam Web Helper', 0.4, 88.9, 0, 0.1, 0.1, 0.7, 1.7),
    ],
  },
  {
    name: 'Discord', glyph: 'D', gradient: 'linear-gradient(150deg,#a5b4fc,#4f46e5)',
    procs: [
      p('Discord', 0.9, 156.3, 0.1, 0.3, 0.4, 1.2, 2.1),
      p('Discord (Renderer)', 0.5, 104.8, 0, 0.1, 0.2, 0.9, 3.9),
    ],
  },
  {
    name: 'NVIDIA Container', glyph: 'NV', gradient: 'linear-gradient(150deg,#b9f18a,#3f7d20)',
    procs: [
      p('NVIDIA Container', 0.3, 42.7, 0, 0, 1.1, 0.5, 4.4),
      p('NVIDIA Overlay', 0.1, 18.2, 0, 0, 0.2, 0.3, 1.9),
    ],
  },
  {
    name: 'Desktop Window Manager', glyph: 'DW', gradient: 'linear-gradient(150deg,#c4b5fd,#6d28d9)',
    procs: [p('Desktop Window Manager', 4.4, 186.4, 0.2, 0, 2.4, 1.8, 0.2)],
  },
  {
    name: 'Service Host: Network', glyph: 'SV', gradient: 'linear-gradient(150deg,#93c5fd,#1d4ed8)',
    procs: [
      p('Service Host: Network Service', 0.2, 18.6, 0, 0.2, 0, 0.4, 2.9),
      p('Service Host: Local Service', 0.1, 12.4, 0, 0, 0, 0.3, 3.7),
      p('DNS Client', 0, 6.8, 0, 0, 0, 0.2, 1.4),
    ],
  },
  {
    name: 'Antimalware Service Executable', glyph: 'AV', gradient: 'linear-gradient(150deg,#94a3b8,#334155)',
    procs: [p('Antimalware Service Executable', 1.6, 214.9, 2.4, 0, 0, 1.5, 4.6)],
  },
]

const RESOURCES = [
  { key: 'cpu', name: 'CPU', sub: 'Intel Core i7-13700H', icon: Cpu, color: '#4cc2ff' },
  { key: 'mem', name: 'Memory', sub: '32.0 GB DDR5', icon: MemoryStick, color: '#b46bff' },
  { key: 'disk', name: 'Disk 0 (C:)', sub: 'NVMe SSD 1 TB', icon: HardDrive, color: '#61d095' },
  { key: 'wifi', name: 'Wi-Fi', sub: 'Liquid-Glass-5G', icon: Wifi, color: '#fbbf24' },
  { key: 'gpu', name: 'GPU 0', sub: 'NVIDIA RTX 4070', icon: Layers, color: '#f472b6' },
] as const

type ResourceKey = (typeof RESOURCES)[number]['key']

/* ------------------------------------------------------------------ */
/* Bits                                                                */
/* ------------------------------------------------------------------ */

function Spark({ data, color, height = 26, fill = true }: { data: number[]; color: string; height?: number; fill?: boolean }) {
  const w = 100
  const h = 30
  const step = w / Math.max(1, data.length - 1)
  const pts = data.map((v, i) => `${(i * step).toFixed(2)},${(h - (v / 100) * h).toFixed(2)}`)
  const line = pts.join(' ')
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height }} aria-hidden>
      {fill && <polygon points={`0,${h} ${line} ${w},${h}`} fill={color} opacity={0.18} />}
      <polyline points={line} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function BigGraph({ data, color }: { data: number[]; color: string }) {
  const W = 600
  const H = 200
  const step = W / Math.max(1, data.length - 1)
  const pts = data.map((v, i) => [i * step, H - (v / 100) * H])
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden>
      <defs>
        <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${line} ${W},${H}`} fill="url(#perfFill)" />
      <polyline points={line} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      {pts.length > 0 && (
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={4} fill={color} stroke="#fff" strokeWidth={1.5} />
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function TaskManager({ onToast }: { onToast: (m: string) => void }) {
  const tick = useTicker(1500)
  const [tab, setTab] = useState<'processes' | 'performance'>('processes')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('Microsoft Edge')
  const [ended, setEnded] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['Microsoft Edge', 'Liquid Glass Studio']))
  const [perfKey, setPerfKey] = useState<ResourceKey>('cpu')

  const values = useMemo(() => {
    const cpu = wave(18, 9, tick, 0.4, 2, 74)
    const mem = wave(62, 3.4, tick, 1.7, 40, 88)
    const disk = wave(7, 6, tick, 2.1, 0, 46)
    const wifi = wave(3.2, 2.4, tick, 3.2, 0, 22)
    const gpu = wave(12, 8, tick, 4.1, 0, 68)
    return { cpu, mem, disk, wifi, gpu }
  }, [tick])

  const histories = {
    cpu: useHistory(values.cpu, 40),
    mem: useHistory(values.mem, 40),
    disk: useHistory(values.disk, 40),
    wifi: useHistory(values.wifi, 40),
    gpu: useHistory(values.gpu, 40),
  }

  const groups = useMemo(
    () =>
      GROUP_SEEDS.map((g) => {
        const procs = g.procs
          .filter((pr) => !ended.has(pr.name))
          .map((pr) => ({
            ...pr,
            cpu: wave(pr.cpu, pr.amp, tick, pr.phase, 0, 100),
            disk: wave(pr.disk, pr.amp * 0.4, tick, pr.phase + 1, 0, 100),
            net: wave(pr.net, pr.amp * 0.3, tick, pr.phase + 2, 0, 20),
            gpu: wave(pr.gpu, pr.amp * 0.5, tick, pr.phase + 3, 0, 100),
          }))
        return { ...g, procs }
      }).filter((g) => g.procs.length > 0),
    [tick, ended],
  )

  const q = query.trim().toLowerCase()
  const visible = groups
    .map((g) => ({
      ...g,
      procs: q ? g.procs.filter((pr) => pr.name.toLowerCase().includes(q) || g.name.toLowerCase().includes(q)) : g.procs,
    }))
    .filter((g) => g.procs.length > 0)

  const totalCpu = groups.reduce((a, g) => a + g.procs.reduce((b, pr) => b + pr.cpu, 0), 0)
  const totalMem = groups.reduce((a, g) => a + g.procs.reduce((b, pr) => b + pr.mem, 0), 0)
  const selectedProc = groups.flatMap((g) => g.procs).find((pr) => pr.name === selected)

  const processCount = groups.reduce((a, g) => a + g.procs.length, 0)

  const cards = [
    { label: 'CPU', value: `${Math.round(values.cpu)}%`, sub: `${(3.9 + values.cpu / 42).toFixed(1)} GHz`, data: histories.cpu, color: '#4cc2ff', icon: Cpu },
    { label: 'Memory', value: `${Math.round(values.mem)}%`, sub: `${((values.mem / 100) * 32).toFixed(1)}/32.0 GB`, data: histories.mem, color: '#b46bff', icon: MemoryStick },
    { label: 'Disk 0', value: `${Math.round(values.disk)}%`, sub: `${(values.disk * 12).toFixed(0)} MB/s`, data: histories.disk, color: '#61d095', icon: HardDrive },
    { label: 'Wi-Fi', value: `S${values.wifi < 2 ? '0' : values.wifi < 8 ? '1' : '2'}`, sub: `${(values.wifi * 9).toFixed(0)} Mbps`, data: histories.wifi, color: '#fbbf24', icon: Wifi },
  ]

  const heat = (v: number, max = 40) => {
    const t = Math.min(1, v / max)
    if (t < 0.06) return {}
    const col = t > 0.62 ? '239,68,68' : t > 0.34 ? '251,191,36' : '76,194,255'
    return {
      background: `rgba(${col}, ${(0.1 + t * 0.42).toFixed(3)})`,
      color: t > 0.5 ? '#fff' : 'var(--text)',
    }
  }

  const endTask = () => {
    if (!selectedProc) return
    setEnded((prev) => new Set(prev).add(selectedProc.name))
    onToast(`Ended task “${selectedProc.name}” (preview only)`)
  }

  const perf = RESOURCES.find((r) => r.key === perfKey)!
  const perfData = histories[perfKey]
  const perfValue = values[perfKey]

  const toggleGroup = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  return (
    <div className="tm">
      <div className="tm-tabs">
        <button className={`tm-tab ${tab === 'processes' ? 'on' : ''}`} onClick={() => setTab('processes')}>
          <Activity size={13} /> Processes
        </button>
        <button className={`tm-tab ${tab === 'performance' ? 'on' : ''}`} onClick={() => setTab('performance')}>
          <Gauge size={13} /> Performance
        </button>
        <button className="tm-tab" onClick={() => onToast('App history is a mock in this studio')}><History size={13} /> App history</button>
        <button className="tm-tab" onClick={() => onToast('Startup apps: 4 enabled')}><Rocket size={13} /> Startup apps</button>
        <button className="tm-tab dt-only" onClick={() => onToast('2 users signed in')}><Users size={13} /> Users</button>
        <button className="tm-tab dt-only" onClick={() => onToast('Details tab')}><List size={13} /> Details</button>
        <button className="tm-tab dt-only" onClick={() => onToast('114 services · 62 running')}><Server size={13} /> Services</button>
        <button className="icon-btn" style={{ marginLeft: 'auto', width: 26, height: 26 }} title="Run new task" onClick={() => onToast('Run new task (preview)')}>
          <SquareTerminal size={14} />
        </button>
      </div>

      <div className="tm-main">
        <div className="tm-rail">
          <button className={tab === 'processes' ? 'on' : ''} title="Processes" onClick={() => setTab('processes')}><Activity size={16} /></button>
          <button className={tab === 'performance' ? 'on' : ''} title="Performance" onClick={() => setTab('performance')}><Gauge size={16} /></button>
          <button title="App history" onClick={() => onToast('App history')}><History size={16} /></button>
          <button title="Startup apps" onClick={() => onToast('4 startup apps enabled')}><Rocket size={16} /></button>
          <button title="Users" onClick={() => onToast('2 users')}><Users size={16} /></button>
          <button title="Details" onClick={() => onToast('Details')}><List size={16} /></button>
          <div className="spacer" />
          <button title="Settings" onClick={() => onToast('Task Manager settings')}><Power size={15} /></button>
        </div>

        {tab === 'processes' ? (
          <>
            <div className="tm-content">
              <div className="tm-head">
                <h2>Processes</h2>
                <label className="exp-search" style={{ marginLeft: 'auto', width: 180 }}>
                  <Search size={13} className="faint" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search processes" aria-label="Search processes" />
                </label>
                <button className="btn sm" onClick={() => onToast('New task dialog (preview)')}><Play size={12} /> Run new task</button>
                <button className="icon-btn" style={{ width: 28, height: 28 }} title="Collapse all" onClick={() => setExpanded(new Set())}>
                  <ChevronsDownUp size={15} />
                </button>
                <button className="icon-btn" style={{ width: 28, height: 28 }} title="Expand all" onClick={() => setExpanded(new Set(groups.map((g) => g.name)))}>
                  <ChevronsUpDown size={15} />
                </button>
              </div>

              <div className="tm-cards">
                {cards.map((c) => (
                  <div className="stat-card" key={c.label}>
                    <div className="label">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <c.icon size={11} style={{ color: c.color }} /> {c.label}
                      </span>
                      <span style={{ color: c.color, fontSize: 9 }}>{Math.round(c.data[c.data.length - 1])}%</span>
                    </div>
                    <div className="value">{c.value}</div>
                    <div className="sub">{c.sub}</div>
                    <Spark data={c.data} color={c.color} height={24} />
                  </div>
                ))}
              </div>

              <div className="tm-table-wrap">
                <table className="proc-table">
                  <colgroup>
                    <col style={{ width: '38%' }} />
                    <col style={{ width: '11%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '9%' }} />
                    <col style={{ width: '9%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>CPU</th>
                      <th style={{ textAlign: 'right' }}>Memory</th>
                      <th style={{ textAlign: 'right' }}>Disk</th>
                      <th style={{ textAlign: 'right' }}>Network</th>
                      <th style={{ textAlign: 'right' }}>GPU</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((g) => {
                      const isOpen = expanded.has(g.name) || !!q
                      const gCpu = g.procs.reduce((a, b) => a + b.cpu, 0)
                      const gMem = g.procs.reduce((a, b) => a + b.mem, 0)
                      return [
                        <tr key={`g:${g.name}`} className="group-row" onClick={() => toggleGroup(g.name)}>
                          <td>
                            <span className="proc-name">
                              {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              <span className="app-dot" style={{ background: g.gradient }}>{g.glyph}</span>
                              <span>{g.name} ({g.procs.length})</span>
                            </span>
                          </td>
                          <td className="faint">Running</td>
                          <td style={{ textAlign: 'right' }}>{gCpu.toFixed(1)}%</td>
                          <td style={{ textAlign: 'right' }}>{gMem.toFixed(1)} MB</td>
                          <td style={{ textAlign: 'right' }}>0 MB/s</td>
                          <td style={{ textAlign: 'right' }}>0 Mbps</td>
                          <td style={{ textAlign: 'right' }}>0%</td>
                        </tr>,
                        ...(isOpen
                          ? g.procs.map((pr) => (
                              <tr
                                key={`p:${g.name}:${pr.name}`}
                                className={selected === pr.name ? 'on' : ''}
                                onClick={() => setSelected(pr.name)}
                              >
                                <td>
                                  <span className="proc-name" style={{ paddingLeft: 20 }}>
                                    <span className="app-dot" style={{ background: g.gradient, opacity: 0.9 }}>{g.glyph}</span>
                                    <span>{pr.name}</span>
                                  </span>
                                </td>
                                <td className={pr.status ? 'faint' : ''}>{pr.status ?? 'Running'}</td>
                                <td style={{ textAlign: 'right' }}>
                                  <span className="heat-cell" style={heat(pr.cpu)}>{pr.cpu.toFixed(1)}%</span>
                                </td>
                                <td style={{ textAlign: 'right' }}>{pr.mem.toFixed(1)} MB</td>
                                <td style={{ textAlign: 'right' }}>
                                  <span className="heat-cell" style={heat(pr.disk, 20)}>{pr.disk.toFixed(1)} MB/s</span>
                                </td>
                                <td style={{ textAlign: 'right' }}>{pr.net.toFixed(1)} Mbps</td>
                                <td style={{ textAlign: 'right' }}>
                                  <span className="heat-cell" style={heat(pr.gpu, 30)}>{pr.gpu.toFixed(1)}%</span>
                                </td>
                              </tr>
                            ))
                          : []),
                      ]
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tm-side dt-only">
              {selectedProc ? (
                <>
                  <div className="big-icon" style={{ background: 'linear-gradient(150deg,#4fd1c5,#0a7ea4)' }}>
                    <SquareTerminal size={20} />
                  </div>
                  <h3>{selectedProc.name}</h3>
                  <div className="faint tiny">Process · Running</div>
                  <div className="meta-list">
                    <div><span>CPU</span><b>{selectedProc.cpu.toFixed(1)}%</b></div>
                    <div><span>Memory</span><b>{selectedProc.mem.toFixed(1)} MB</b></div>
                    <div><span>Disk</span><b>{selectedProc.disk.toFixed(1)} MB/s</b></div>
                    <div><span>GPU</span><b>{selectedProc.gpu.toFixed(1)}%</b></div>
                    <div><span>PID</span><b>{Math.abs(selected.length * 137 % 9000) + 1024}</b></div>
                  </div>
                  <button className="btn sm" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={endTask}>
                    <Power size={13} /> End task
                  </button>
                  <button className="btn sm ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} onClick={() => onToast('Efficiency mode enabled')}>
                    <Activity size={13} /> Efficiency mode
                  </button>
                  <button className="btn sm ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} onClick={() => onToast('Properties (preview)')}>
                    <Trash2 size={13} /> Open file location
                  </button>
                  <div className="divider" />
                  <div className="tiny faint" style={{ lineHeight: 1.55 }}>
                    {processCount} processes · {Math.round(values.mem)}% memory in use.
                    Values refresh with the glass render loop.
                  </div>
                </>
              ) : (
                <div className="empty-state" style={{ height: '100%' }}>
                  <div className="ring"><Activity size={20} /></div>
                  Select a process
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="perf-layout">
            <div className="perf-list">
              {RESOURCES.map((r) => (
                <button key={r.key} className={`perf-item ${perfKey === r.key ? 'on' : ''}`} onClick={() => setPerfKey(r.key)}>
                  <span className="mini">
                    <Spark data={histories[r.key]} color={r.color} height={28} fill={false} />
                  </span>
                  <span className="txt">
                    <b>{r.name}</b>
                    <small>{r.sub}</small>
                  </span>
                  <span className="pct">{Math.round(values[r.key])}%</span>
                </button>
              ))}
              <div className="divider" />
              <button className="perf-item" onClick={() => onToast('Resource monitor (preview)')}>
                <span className="mini" style={{ display: 'grid', placeItems: 'center' }}><Server size={16} className="faint" /></span>
                <span className="txt"><b>Open Resource Monitor</b><small>Advanced view</small></span>
              </button>
            </div>

            <div className="perf-detail">
              <h3>{perf.name}</h3>
              <div className="faint tiny" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: 99, background: perf.color, display: 'inline-block' }} />
                {perf.sub} · updated just now
              </div>

              <div className="big-graph">
                <BigGraph data={perfData} color={perf.color} />
                <div
                  style={{
                    position: 'absolute', top: 10, left: 12, fontSize: 24, fontWeight: 600,
                    color: perf.color, letterSpacing: '-0.5px', textShadow: '0 2px 10px rgba(0,0,0,.25)',
                  }}
                >
                  {Math.round(perfValue)}%
                </div>
              </div>

              <div className="perf-stats">
                <div>Utilization<b>{Math.round(perfValue)}%</b></div>
                {perfKey === 'cpu' && <div>Speed<b>{(3.9 + perfValue / 42).toFixed(2)} GHz</b></div>}
                {perfKey === 'cpu' && <div>Processes<b>{processCount}</b></div>}
                {perfKey === 'cpu' && <div>Up time<b>2:14:06:31</b></div>}
                {perfKey === 'mem' && <div>In use<b>{((perfValue / 100) * 32).toFixed(1)} GB</b></div>}
                {perfKey === 'mem' && <div>Available<b>{(32 - (perfValue / 100) * 32).toFixed(1)} GB</b></div>}
                {perfKey === 'mem' && <div>Cached<b>8.4 GB</b></div>}
                {perfKey === 'disk' && <div>Active time<b>{Math.round(perfValue)}%</b></div>}
                {perfKey === 'disk' && <div>Read<b>{(perfValue * 6).toFixed(0)} KB/s</b></div>}
                {perfKey === 'disk' && <div>Write<b>{(perfValue * 2.4).toFixed(0)} KB/s</b></div>}
                {perfKey === 'wifi' && <div>Send<b>{(perfValue * 1.8).toFixed(1)} Mbps</b></div>}
                {perfKey === 'wifi' && <div>Receive<b>{(perfValue * 8.2).toFixed(1)} Mbps</b></div>}
                {perfKey === 'wifi' && <div>Signal<b>Excellent</b></div>}
                {perfKey === 'gpu' && <div>3D<b>{Math.round(perfValue * 0.8)}%</b></div>}
                {perfKey === 'gpu' && <div>Copy<b>{Math.round(perfValue * 0.2)}%</b></div>}
                {perfKey === 'gpu' && <div>Memory<b>{(3.2 + perfValue * 0.05).toFixed(1)}/12 GB</b></div>}
                <div>Peak<b>{(Math.max(...perfData)).toFixed(0)}%</b></div>
              </div>

              <div className="divider" style={{ margin: '14px 0 10px' }} />
              <div className="tiny faint" style={{ lineHeight: 1.6 }}>
                Task Manager is drawn with the same liquid-glass surface as Explorer and Settings:
                {' '}{Math.round(totalCpu)}% total CPU across {processCount} processes, {(totalMem / 1024).toFixed(1)} GB working set.
                The graphs animate live so you can judge legibility through the blur.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
