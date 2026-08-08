import { useEffect, useState, type ReactNode } from 'react'
import { CheckCircle2, Clock, Hourglass, type LucideIcon } from 'lucide-react'

export const sectorPalette = [
  '#2563eb',
  '#0ea5e9',
  '#16a34a',
  '#f97316',
  '#a855f7',
  '#ec4899',
  '#14b8a6',
  '#ef4444',
  '#3b82f6',
  '#71717a',
]

function useMountedAfter(delay: number) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(id)
  }, [delay])

  return mounted
}

export function LiveClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500">
      <Clock className="h-4 w-4 text-emerald-600" aria-hidden="true" />
      <span>{now.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
      <span className="tabular-nums text-zinc-950">{now.toLocaleTimeString('en-KE', { hour12: false })}</span>
    </div>
  )
}

export function DashboardTabs<TKey extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: TKey; label: string; icon: LucideIcon }[]
  active: TKey
  onChange: (key: TKey) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = tab.key === active

        return (
          <button
            className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-sm font-semibold transition ${
              isActive ? 'bg-emerald-700 text-white shadow-sm' : 'text-zinc-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
            key={tab.key}
            type="button"
            title={tab.label}
            onClick={() => onChange(tab.key)}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon
  label: string
  value: string
  tone: string
}) {
  return (
    <article className="reveal rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-2 truncate text-2xl font-bold text-zinc-950">{value}</p>
        </div>
        <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </article>
  )
}

export function ChartCard({
  title,
  subtitle,
  tag,
  children,
}: {
  title: string
  subtitle: string
  tag: string
  children: ReactNode
}) {
  return (
    <section className="reveal rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-zinc-950">{title}</h3>
          <p className="text-xs text-zinc-500">{subtitle}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{tag}</span>
      </div>
      {children}
    </section>
  )
}

const CHART_HEIGHT = 180

export function SectorBarChart({ data }: { data: { label: string; value: number }[] }) {
  const mounted = useMountedAfter(60)
  const max = Math.max(1, ...data.map((item) => item.value))

  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-zinc-500">No data for the current filters</p>
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-end gap-3 overflow-x-auto" style={{ height: CHART_HEIGHT + 28 }}>
        {data.map((item, index) => {
          const targetHeight = Math.max(4, Math.round((item.value / max) * CHART_HEIGHT))

          return (
            <div
              className="flex min-w-12 flex-1 flex-col items-center justify-end gap-1"
              key={item.label}
              style={{ height: CHART_HEIGHT + 28 }}
            >
              <span className="text-xs font-semibold text-zinc-600">{item.value}</span>
              <div
                className="w-full rounded-t-md transition-[height] duration-700 ease-out"
                style={{
                  height: mounted ? targetHeight : 4,
                  backgroundColor: sectorPalette[index % sectorPalette.length],
                }}
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-3 overflow-x-auto text-[11px] font-medium text-zinc-500">
        {data.map((item) => (
          <span className="min-w-12 flex-1 truncate text-center" key={item.label} title={item.label}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function StatusDonutChart({
  segments,
  total,
}: {
  segments: { label: string; value: number; color: string }[]
  total: number
}) {
  let cumulative = 0
  const stops = segments.map((segment) => {
    const start = total > 0 ? (cumulative / total) * 360 : 0
    cumulative += segment.value
    const end = total > 0 ? (cumulative / total) * 360 : 0
    return `${segment.color} ${start}deg ${end}deg`
  })
  const gradient = total > 0 ? `conic-gradient(${stops.join(', ')})` : 'conic-gradient(#e4e4e7 0deg 360deg)'

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative h-48 w-48 rounded-full transition-[background] duration-700"
        style={{ background: gradient }}
      >
        <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-white text-center">
          <span className="text-2xl font-bold text-zinc-950">{total}</span>
          <span className="text-xs text-zinc-500">Total</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-zinc-600">
        {segments.map((segment) => (
          <span className="inline-flex items-center gap-1.5" key={segment.label}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
            {segment.label} ({segment.value})
          </span>
        ))}
      </div>
    </div>
  )
}

export function TrendLineChart({ data }: { data: { label: string; value: number }[] }) {
  const mounted = useMountedAfter(80)
  const width = 720
  const height = 220
  const paddingX = 24
  const paddingY = 20
  const max = Math.max(1, ...data.map((item) => item.value))
  const stepX = data.length > 1 ? (width - paddingX * 2) / (data.length - 1) : 0

  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-zinc-500">No data for the current filters</p>
  }

  const points = data.map((item, index) => ({
    ...item,
    x: paddingX + index * stepX,
    y: height - paddingY - (item.value / max) * (height - paddingY * 2),
  }))
  const pathD = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ')
  const lastPoint = points[points.length - 1]
  const areaD = `${pathD} L${lastPoint.x},${height - paddingY} L${paddingX},${height - paddingY} Z`

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[640px]" role="img" aria-label="Projects by financial year">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#trendFill)" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease' }} />
        {points.length > 1 ? (
          <path
            d={pathD}
            fill="none"
            stroke="#2563eb"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: mounted ? 0 : 1,
              transition: 'stroke-dashoffset 1.1s ease',
            }}
          />
        ) : null}
        {points.map((point) => (
          <circle
            key={point.label}
            cx={point.x}
            cy={point.y}
            r={3.5}
            fill="#2563eb"
            style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease' }}
          />
        ))}
        {points.map((point) => (
          <text key={`${point.label}-label`} x={point.x} y={height - 4} fontSize="10" textAnchor="middle" fill="#71717a">
            {point.label}
          </text>
        ))}
      </svg>
    </div>
  )
}

export function SubcountyBreakdown({
  rows,
}: {
  rows: { name: string; total: number; completed: number; ongoing: number; percent: number; color: string }[]
}) {
  if (rows.length === 0) {
    return <p className="py-10 text-center text-sm text-zinc-500">No data for the current filters</p>
  }

  return (
    <div className="grid gap-5">
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-zinc-100">
        {rows.map((row) => (
          <div
            className="h-full transition-[width] duration-700"
            key={row.name}
            style={{ width: `${row.percent}%`, backgroundColor: row.color }}
            title={`${row.name}: ${row.percent}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-zinc-600">
        {rows.map((row) => (
          <span className="inline-flex items-center gap-1.5" key={row.name}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
            {row.name} ({row.percent}%)
          </span>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {rows.map((row) => (
          <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm" key={row.name}>
            <p className="truncate text-sm font-bold text-zinc-950">{row.name}</p>
            <p className="mt-1 text-xs text-zinc-500">Total: {row.total}</p>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold">
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> {row.completed}
              </span>
              <span className="inline-flex items-center gap-1 text-sky-700">
                <Hourglass className="h-3.5 w-3.5" aria-hidden="true" /> {row.ongoing}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
