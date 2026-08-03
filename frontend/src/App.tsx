import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import {
  Activity,
  ArrowUpRight,
  Bell,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CirclePause,
  CircleSlash,
  Construction,
  Gauge,
  Home,
  Layers3,
  LayoutDashboard,
  LogOut,
  LockKeyhole,
  Map,
  MapPinned,
  Menu,
  Megaphone,
  Plus,
  Save,
  Search,
  Settings,
  Timer,
  UserCog,
  Users,
  WalletCards,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  initialData,
  initialSettings,
  priorities,
  projectStatuses,
  sexes,
} from './data'
import {
  createRecord,
  loadPortalData,
  markAllNotificationsReadRequest,
  markNotificationReadRequest,
} from './api'
import type {
  Citizen,
  Notification,
  PortalData,
  PortalUser,
  Priority,
  Project,
  ProjectStatus,
  SettingsState,
  Sex,
} from './data'

type ModuleKey =
  | 'dashboard'
  | 'citizens'
  | 'subcounties'
  | 'projects'
  | 'reports'
  | 'users'
  | 'settings'
  | 'notifications'

type NavItem = {
  key: ModuleKey
  label: string
  icon: LucideIcon
}

type Role = PortalUser['role']

type AuthUser = {
  name: string
  email: string
  password: string
  role: Role
}

type TableColumn<T> = {
  header: string
  value: (row: T) => ReactNode
  className?: string
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'citizens', label: 'Citizen Management', icon: Users },
  { key: 'subcounties', label: 'Subcounty Management', icon: MapPinned },
  { key: 'projects', label: 'Projects', icon: Construction },
  { key: 'reports', label: 'Reports & Analytics', icon: Activity },
  { key: 'users', label: 'User Management', icon: UserCog },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'notifications', label: 'Notifications', icon: Bell },
]

const demoUsers: AuthUser[] = [
  {
    name: 'System Administrator',
    email: 'admin@county.go.ke',
    password: 'admin123',
    role: 'System Administrator',
  },
  {
    name: 'County Governor',
    email: 'governor@county.go.ke',
    password: 'governor123',
    role: 'Governor',
  },
  {
    name: 'Clerk / Secretary',
    email: 'clerk@county.go.ke',
    password: 'clerk123',
    role: 'Clerk / Secretary',
  },
]

const roleModuleAccess: Record<Role, ModuleKey[]> = {
  'System Administrator': navItems.map((item) => item.key),
  Governor: [
    'dashboard',
    'citizens',
    'subcounties',
    'projects',
    'reports',
    'notifications',
  ],
  'Clerk / Secretary': ['dashboard', 'citizens', 'subcounties', 'projects', 'notifications'],
}

const roleWriteAccess: Record<Role, ModuleKey[]> = {
  'System Administrator': navItems.map((item) => item.key),
  Governor: [],
  'Clerk / Secretary': ['citizens', 'notifications'],
}

const wardLockedSubcounties = new Set(['Nambale', 'Budalangi', 'Butula', 'Funyula', 'Matayos', 'Teso North', 'Teso South'])

const statusStyles: Record<ProjectStatus, string> = {
  PLANNED: 'bg-sky-100 text-sky-800 border-sky-200',
  IN_PROGRESS: 'bg-amber-100 text-amber-800 border-amber-200',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  ON_HOLD: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  CANCELLED: 'bg-rose-100 text-rose-800 border-rose-200',
}

const statusIcons: Record<ProjectStatus, LucideIcon> = {
  PLANNED: Timer,
  IN_PROGRESS: Gauge,
  COMPLETED: CircleCheck,
  ON_HOLD: CirclePause,
  CANCELLED: CircleSlash,
}

const priorityStyles: Record<Priority, string> = {
  LOW: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  MEDIUM: 'bg-sky-100 text-sky-800 border-sky-200',
  HIGH: 'bg-rose-100 text-rose-800 border-rose-200',
}

const defaultProjectDraft = {
  name: '',
  description: '',
  status: 'PLANNED' as ProjectStatus,
  priority: 'MEDIUM' as Priority,
  ward_id: '1',
  start_date: '',
  due_date: '',
  completion_date: '',
  progress: '0',
  budget: '',
  actual_cost: '',
}

const defaultCitizenDraft = {
  full_name: '',
  sex: 'MALE' as Sex,
  phone_number: '',
  village_id: '1',
}

const defaultUpdateDraft = {
  project_id: '1',
  title: '',
  update_text: '',
  progress: '0',
  status: 'IN_PROGRESS' as ProjectStatus,
}

const defaultUserDraft = {
  name: '',
  email: '',
  role: 'Clerk / Secretary' as PortalUser['role'],
  status: 'Invited' as PortalUser['status'],
}

const defaultNotificationDraft = {
  title: '',
  message: '',
  type: 'System' as Notification['type'],
}

const currencyFormatter = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  maximumFractionDigits: 0,
})

function clampProgress(value: string | number) {
  const numeric = Number(value)

  if (Number.isNaN(numeric)) {
    return 0
  }

  return Math.max(0, Math.min(100, Math.round(numeric)))
}

function money(value: number) {
  return currencyFormatter.format(value)
}

function labelFromCode(value: string) {
  return value
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ')
}

function namedById<T extends { id: number; name: string }>(items: T[], id: number) {
  return items.find((item) => item.id === id)?.name ?? 'Unassigned'
}

function canViewModule(role: Role, module: ModuleKey) {
  return roleModuleAccess[role].includes(module)
}

function canWriteModule(role: Role, module: ModuleKey) {
  return roleWriteAccess[role].includes(module)
}

function canWriteProjectUpdates(role: Role) {
  return role === 'System Administrator' || role === 'Clerk / Secretary'
}

function matchesQuery(values: ReactNode[], query: string) {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return true
  }

  return values.join(' ').toLowerCase().includes(normalized)
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const Icon = statusIcons[status]

  return (
    <span
      className={`inline-flex h-7 items-center gap-1 rounded-md border px-2 text-xs font-semibold ${statusStyles[status]}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {labelFromCode(status)}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-md border px-2 text-xs font-semibold ${priorityStyles[priority]}`}
    >
      {labelFromCode(priority)}
    </span>
  )
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: LucideIcon
  children: ReactNode
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="flex min-h-14 items-center gap-3 border-b border-zinc-200 px-4 py-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

function TextField({
  label,
  value,
  onChange,
  type = 'text',
  required = true,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      <span>{label}</span>
      <input
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700 md:col-span-2 xl:col-span-3">
      <span>{label}</span>
      <textarea
        className="min-h-24 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        value={value}
        required
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      <span>{label}</span>
      <select
        className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        value={value}
        required
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function SubmitButton({ label, disabled = false }: { label: string; disabled?: boolean }) {
  return (
    <button
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-zinc-300 disabled:text-zinc-500"
      type="submit"
      title={label}
      disabled={disabled}
    >
      <Plus className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}

function DataTable<T extends { id: number }>({
  columns,
  rows,
  emptyLabel,
}: {
  columns: TableColumn<T>[]
  rows: T[]
  emptyLabel: string
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50 text-xs font-semibold uppercase text-zinc-500">
            <tr>
              {columns.map((column) => (
                <th className={`px-4 py-3 ${column.className ?? ''}`} key={column.header}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((row) => (
              <tr className="align-top transition hover:bg-emerald-50/40" key={row.id}>
                {columns.map((column) => (
                  <td className={`px-4 py-3 text-zinc-700 ${column.className ?? ''}`} key={column.header}>
                    {column.value(row)}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-sm text-zinc-500" colSpan={columns.length}>
                  {emptyLabel}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  tone,
}: {
  label: string
  value: string
  note: string
  icon: LucideIcon
  tone: string
}) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-zinc-950">{value}</p>
        </div>
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-md ${tone}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm text-zinc-500">{note}</p>
    </article>
  )
}

function BarRow({
  label,
  value,
  total,
  tone,
}: {
  label: string
  value: number
  total: number
  tone: string
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-zinc-700">{label}</span>
        <span className="tabular-nums text-zinc-500">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-md bg-zinc-100">
        <div className={`h-full rounded-md ${tone}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3">
      <span className="text-sm font-medium text-zinc-800">{label}</span>
      <button
        className={`relative h-7 w-12 rounded-full transition ${checked ? 'bg-emerald-700' : 'bg-zinc-300'}`}
        type="button"
        role="switch"
        aria-checked={checked}
        title={label}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </label>
  )
}

function ReadOnlyNotice({ role }: { role: Role }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
      {role} access is read-only in this module.
    </div>
  )
}

function LoginPage({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: {
  email: string
  password: string
  error: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <main className="min-h-screen bg-[#f5f7f3] px-4 py-6 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-md items-center">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-zinc-950">Login</h2>
              <p className="text-sm text-zinc-500">Demo role access is enabled for this build.</p>
            </div>
          </div>

          <form className="grid gap-4" onSubmit={onSubmit}>
            <TextField label="Email" value={email} type="email" onChange={onEmailChange} />
            <TextField label="Password" value={password} type="password" onChange={onPasswordChange} />
            {error ? (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                {error}
              </div>
            ) : null}
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              type="submit"
              title="Sign In"
            >
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              Sign In
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}

function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [loginEmail, setLoginEmail] = useState('admin@county.go.ke')
  const [loginPassword, setLoginPassword] = useState('admin123')
  const [loginError, setLoginError] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [data, setData] = useState<PortalData>(initialData)
  const [settings, setSettings] = useState<SettingsState>(initialSettings)
  const [geographyNavOpen, setGeographyNavOpen] = useState(false)
  const [selectedSubcountyId, setSelectedSubcountyId] = useState<number | null>(
    initialData.subcounties[0]?.id ?? null,
  )
  const [selectedWardId, setSelectedWardId] = useState<number | null>(null)
  const [selectedSublocationId, setSelectedSublocationId] = useState<number | null>(null)
  const [wardDraft, setWardDraft] = useState({ name: '', subcounty_id: '1' })
  const [sublocationDraft, setSublocationDraft] = useState({ name: '', ward_id: '1' })
  const [villageDraft, setVillageDraft] = useState({ name: '', sublocation_id: '1' })
  const [citizenDraft, setCitizenDraft] = useState(defaultCitizenDraft)
  const [projectDraft, setProjectDraft] = useState(defaultProjectDraft)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(initialData.projects[0]?.id ?? null)
  const [updateDraft, setUpdateDraft] = useState(defaultUpdateDraft)
  const [userDraft, setUserDraft] = useState(defaultUserDraft)
  const [notificationDraft, setNotificationDraft] = useState(defaultNotificationDraft)

  useEffect(() => {
    void refreshPortalData()
  }, [])

  useEffect(() => {
    if (data.subcounties.length === 0) {
      setSelectedSubcountyId(null)
      setSelectedWardId(null)
      setSelectedSublocationId(null)
      return
    }

    if (selectedSubcountyId === null || !data.subcounties.some((subcounty) => subcounty.id === selectedSubcountyId)) {
      setSelectedSubcountyId(data.subcounties[0].id)
      setSelectedWardId(null)
      setSelectedSublocationId(null)
    }
  }, [data.subcounties, selectedSubcountyId])

  useEffect(() => {
    if (
      selectedWardId !== null &&
      !data.wards.some((ward) => ward.id === selectedWardId && ward.subcounty_id === selectedSubcountyId)
    ) {
      setSelectedWardId(null)
      setSelectedSublocationId(null)
    }
  }, [data.wards, selectedSubcountyId, selectedWardId])

  useEffect(() => {
    if (
      selectedSublocationId !== null &&
      !data.sublocations.some((sublocation) => sublocation.id === selectedSublocationId && sublocation.ward_id === selectedWardId)
    ) {
      setSelectedSublocationId(null)
    }
  }, [data.sublocations, selectedSublocationId, selectedWardId])

  useEffect(() => {
    if (data.projects.length === 0) {
      setSelectedProjectId(null)
      return
    }

    if (selectedProjectId === null || !data.projects.some((project) => project.id === selectedProjectId)) {
      const project = data.projects[0]
      setSelectedProjectId(project.id)
      setUpdateDraft((draft) => ({
        ...draft,
        project_id: String(project.id),
        progress: String(project.progress),
        status: project.status,
      }))
    }
  }, [data.projects, selectedProjectId])

  const visibleNavItems = currentUser
    ? navItems.filter((item) => canViewModule(currentUser.role, item.key))
    : []
  const activeItem = visibleNavItems.find((item) => item.key === activeModule) ?? visibleNavItems[0] ?? navItems[0]
  const ActiveIcon = activeItem.icon

  const metrics = useMemo(() => {
    const totalBudget = data.projects.reduce((sum, project) => sum + project.budget, 0)
    const actualCost = data.projects.reduce((sum, project) => sum + project.actual_cost, 0)
    const averageProgress = data.projects.length
      ? Math.round(data.projects.reduce((sum, project) => sum + project.progress, 0) / data.projects.length)
      : 0
    const budgetUse = totalBudget ? Math.round((actualCost / totalBudget) * 100) : 0
    const completed = data.projects.filter((project) => project.status === 'COMPLETED').length

    return {
      totalBudget,
      actualCost,
      averageProgress,
      budgetUse,
      completed,
      unread: data.notifications.filter((notification) => !notification.read).length,
    }
  }, [data.notifications, data.projects])

  const wardOptions = data.wards.map((ward) => ({
    value: String(ward.id),
    label: ward.name,
  }))
  const villageOptions = data.villages.map((village) => ({
    value: String(village.id),
    label: village.name,
  }))
  const statusOptions = projectStatuses.map((status) => ({
    value: status,
    label: labelFromCode(status),
  }))
  const priorityOptions = priorities.map((priority) => ({
    value: priority,
    label: labelFromCode(priority),
  }))
  const sexOptions = sexes.map((sex) => ({
    value: sex,
    label: labelFromCode(sex),
  }))

  const canManageActiveModule = currentUser
    ? canWriteModule(currentUser.role, activeModule) ||
      (activeModule === 'projects' && canWriteProjectUpdates(currentUser.role))
    : false

  async function refreshPortalData() {
    setIsSyncing(true)

    try {
      setData(await loadPortalData())
    } catch (error) {
      reportApiError(error, 'Could not load data from the Laravel API.')
    } finally {
      setIsSyncing(false)
    }
  }

  async function persistAndRefresh(path: string, payload: Record<string, unknown>) {
    await createRecord(path, payload)
    await refreshPortalData()
  }

  function reportApiError(error: unknown, fallback: string) {
    console.error(error instanceof Error ? error.message : fallback)
  }

  function nullable(value: string) {
    return value.trim() === '' ? null : value
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const account = demoUsers.find(
      (user) =>
        user.email.toLowerCase() === loginEmail.trim().toLowerCase() && user.password === loginPassword,
    )

    if (!account) {
      setLoginError('Invalid email or password.')
      return
    }

    setCurrentUser(account)
    setLoginError('')
    setSearch('')
    setActiveModule('dashboard')
  }

  function logout() {
    setCurrentUser(null)
    setMobileNavOpen(false)
    setSearch('')
    setActiveModule('dashboard')
  }

  function canManage(module: ModuleKey) {
    return currentUser ? canWriteModule(currentUser.role, module) : false
  }

  function selectSubcounty(subcountyId: number, closeMobile = false) {
    if (!data.subcounties.some((subcounty) => subcounty.id === subcountyId)) {
      return
    }

    setSelectedSubcountyId(subcountyId)
    setSelectedWardId(null)
    setSelectedSublocationId(null)
    setWardDraft((draft) => ({ ...draft, subcounty_id: String(subcountyId) }))
    setActiveModule('subcounties')
    setGeographyNavOpen(true)

    if (closeMobile) {
      setMobileNavOpen(false)
    }
  }

  function selectWard(wardId: number, closeMobile = false) {
    const ward = data.wards.find((item) => item.id === wardId)

    if (!ward) {
      return
    }

    setSelectedSubcountyId(ward.subcounty_id)
    setSelectedWardId(ward.id)
    setSelectedSublocationId(null)
    setSublocationDraft((draft) => ({ ...draft, ward_id: String(ward.id) }))
    setActiveModule('subcounties')
    setGeographyNavOpen(true)

    if (closeMobile) {
      setMobileNavOpen(false)
    }
  }

  function selectSublocation(sublocationId: number) {
    const sublocation = data.sublocations.find((item) => item.id === sublocationId)

    if (!sublocation) {
      return
    }

    const ward = data.wards.find((item) => item.id === sublocation.ward_id)
    setSelectedSubcountyId(ward?.subcounty_id ?? selectedSubcountyId)
    setSelectedWardId(sublocation.ward_id)
    setSelectedSublocationId(sublocation.id)
    setVillageDraft((draft) => ({ ...draft, sublocation_id: String(sublocation.id) }))
    setActiveModule('subcounties')
    setGeographyNavOpen(true)
  }

  function selectProject(projectId: number) {
    const project = data.projects.find((item) => item.id === projectId)

    if (!project) {
      return
    }

    setSelectedProjectId(project.id)
    setUpdateDraft({
      project_id: String(project.id),
      title: '',
      update_text: '',
      progress: String(project.progress),
      status: project.status,
    })
    setActiveModule('projects')
  }

  function activateModule(module: ModuleKey) {
    if (!currentUser || !canViewModule(currentUser.role, module)) {
      return
    }

    setActiveModule(module)

    if (module === 'subcounties') {
      setGeographyNavOpen((open) => (activeModule === 'subcounties' ? !open : true))
      return
    }

    setMobileNavOpen(false)
  }

  async function handleAddWard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canManage('subcounties')) {
      return
    }

    const name = wardDraft.name.trim()
    const subcountyId = selectedSubcountyId ?? Number(wardDraft.subcounty_id)

    if (!name || !subcountyId) {
      return
    }

    try {
      await persistAndRefresh('/wards', {
        name,
        subcounty_id: subcountyId,
      })
      setWardDraft((draft) => ({ ...draft, name: '', subcounty_id: String(subcountyId) }))
    } catch (error) {
      reportApiError(error, 'Could not add ward.')
    }
  }

  async function handleAddSublocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canManage('subcounties')) {
      return
    }

    const name = sublocationDraft.name.trim()
    const wardId = selectedWardId ?? Number(sublocationDraft.ward_id)

    if (!name || !wardId) {
      return
    }

    try {
      await persistAndRefresh('/sublocations', {
        name,
        ward_id: wardId,
      })
      setSublocationDraft((draft) => ({ ...draft, name: '', ward_id: String(wardId) }))
    } catch (error) {
      reportApiError(error, 'Could not add sublocation.')
    }
  }

  async function handleAddVillage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canManage('subcounties')) {
      return
    }

    const name = villageDraft.name.trim()
    const sublocationId = selectedSublocationId ?? Number(villageDraft.sublocation_id)

    if (!name || !sublocationId) {
      return
    }

    try {
      await persistAndRefresh('/villages', {
        name,
        sublocation_id: sublocationId,
      })
      setVillageDraft((draft) => ({ ...draft, name: '', sublocation_id: String(sublocationId) }))
    } catch (error) {
      reportApiError(error, 'Could not add village.')
    }
  }

  async function handleAddCitizen(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canManage('citizens')) {
      return
    }

    const fullName = citizenDraft.full_name.trim()

    if (!fullName) {
      return
    }

    try {
      await persistAndRefresh('/citizens', {
        full_name: fullName,
        sex: citizenDraft.sex,
        phone_number: nullable(citizenDraft.phone_number),
        village_id: Number(citizenDraft.village_id),
      })
      setCitizenDraft({
        ...defaultCitizenDraft,
        village_id: data.villages[0]?.id.toString() ?? '1',
      })
    } catch (error) {
      reportApiError(error, 'Could not add citizen.')
    }
  }

  async function handleAddProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canManage('projects')) {
      return
    }

    const name = projectDraft.name.trim()

    if (!name) {
      return
    }

    try {
      await persistAndRefresh('/projects', {
        name,
        description: nullable(projectDraft.description),
        status: projectDraft.status,
        priority: projectDraft.priority,
        ward_id: Number(projectDraft.ward_id),
        start_date: nullable(projectDraft.start_date),
        due_date: nullable(projectDraft.due_date),
        completion_date: nullable(projectDraft.completion_date),
        progress: clampProgress(projectDraft.progress),
        budget: Number(projectDraft.budget) || 0,
        actual_cost: Number(projectDraft.actual_cost) || 0,
      })
      setProjectDraft({ ...defaultProjectDraft, ward_id: data.wards[0]?.id.toString() ?? '1' })
    } catch (error) {
      reportApiError(error, 'Could not add project.')
    }
  }

  async function handleAddUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!currentUser || !canWriteProjectUpdates(currentUser.role)) {
      return
    }

    const updateText = updateDraft.update_text.trim()
    const projectId = selectedProjectId ?? Number(updateDraft.project_id)
    const progress = clampProgress(updateDraft.progress)
    const title = updateDraft.title.trim() || 'Progress update'
    const projectName = namedById(data.projects, projectId)

    if (!updateText || !projectId) {
      return
    }

    try {
      await persistAndRefresh('/project-updates', {
        project_id: projectId,
        title,
        update_text: updateText,
        progress,
        status: updateDraft.status,
      })
      setSelectedProjectId(projectId)
      setUpdateDraft({
        project_id: String(projectId),
        title: '',
        update_text: '',
        progress: String(progress),
        status: updateDraft.status,
      })
    } catch (error) {
      reportApiError(error, `Could not update ${projectName}.`)
    }
  }

  async function handleAddUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canManage('users')) {
      return
    }

    const name = userDraft.name.trim()
    const email = userDraft.email.trim()

    if (!name || !email) {
      return
    }

    try {
      await persistAndRefresh('/users', {
        name,
        email,
        role: userDraft.role,
        status: userDraft.status,
      })
      setUserDraft(defaultUserDraft)
    } catch (error) {
      reportApiError(error, 'Could not add user.')
    }
  }

  async function handleAddNotification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canManage('notifications')) {
      return
    }

    const title = notificationDraft.title.trim()
    const message = notificationDraft.message.trim()

    if (!title || !message) {
      return
    }

    try {
      await persistAndRefresh('/notifications', {
        title,
        message,
        type: notificationDraft.type,
      })
      setNotificationDraft(defaultNotificationDraft)
    } catch (error) {
      reportApiError(error, 'Could not add notification.')
    }
  }

  async function markNotificationRead(id: number) {
    if (!canManage('notifications')) {
      return
    }

    try {
      await markNotificationReadRequest(id)
      await refreshPortalData()
    } catch (error) {
      reportApiError(error, 'Could not mark notification read.')
    }
  }

  async function markAllRead() {
    if (!canManage('notifications')) {
      return
    }

    try {
      await markAllNotificationsReadRequest()
      await refreshPortalData()
    } catch (error) {
      reportApiError(error, 'Could not mark notifications read.')
    }
  }

  const filteredSubcounties = data.subcounties.filter((subcounty) =>
    matchesQuery([subcounty.name, subcounty.created_at], search),
  )
  const filteredCitizens = data.citizens.filter((citizen) =>
    matchesQuery(
      [
        citizen.full_name,
        citizen.sex,
        citizen.phone_number,
        namedById(data.villages, citizen.village_id),
      ],
      search,
    ),
  )
  const filteredProjects = data.projects.filter((project) =>
    matchesQuery(
      [
        project.name,
        project.description,
        project.status,
        project.priority,
        namedById(data.wards, project.ward_id),
      ],
      search,
    ),
  )
  const filteredUsers = data.users.filter((user) =>
    matchesQuery([user.name, user.email, user.role, user.status], search),
  )
  const filteredNotifications = data.notifications.filter((notification) =>
    matchesQuery([notification.title, notification.message, notification.type], search),
  )

  function renderDashboard() {
    const statusTotals = projectStatuses.map((status, index) => ({
      status,
      count: data.projects.filter((project) => project.status === status).length,
      tone: ['bg-sky-500', 'bg-amber-500', 'bg-emerald-500', 'bg-zinc-500', 'bg-rose-500'][index],
    }))
    const recentUpdates = [...data.projectUpdates].slice(0, 4)

    return (
      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Users}
            label="Registered Citizens"
            note={`${data.villages.length} villages covered`}
            tone="bg-emerald-50 text-emerald-700"
            value={data.citizens.length.toLocaleString()}
          />
          <MetricCard
            icon={Construction}
            label="Active Projects"
            note={`${metrics.completed} completed`}
            tone="bg-amber-50 text-amber-700"
            value={data.projects.length.toLocaleString()}
          />
          <MetricCard
            icon={Activity}
            label="Average Progress"
            note={`${metrics.budgetUse}% budget utilization`}
            tone="bg-sky-50 text-sky-700"
            value={`${metrics.averageProgress}%`}
          />
          <MetricCard
            icon={Bell}
            label="Unread Notices"
            note="Operational alerts"
            tone="bg-rose-50 text-rose-700"
            value={metrics.unread.toLocaleString()}
          />
        </div>

        <div className="grid gap-5">
          <Panel icon={Construction} title="Project Pipeline">
            <div className="grid gap-4">
              {statusTotals.map((item) => (
                <BarRow
                  key={item.status}
                  label={labelFromCode(item.status)}
                  value={item.count}
                  total={data.projects.length}
                  tone={item.tone}
                />
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <Panel icon={MapPinned} title="County Coverage">
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              {[
                ['Subcounties', data.subcounties.length],
                ['Wards', data.wards.length],
                ['Sublocations', data.sublocations.length],
                ['Villages', data.villages.length],
              ].map(([label, value]) => (
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3" key={label}>
                  <p className="text-zinc-500">{label}</p>
                  <p className="mt-1 text-xl font-bold text-zinc-950">{value}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel icon={Gauge} title="Recent Progress">
            <div className="grid gap-3">
              {recentUpdates.map((update) => (
                <article className="rounded-lg border border-zinc-200 p-3" key={update.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-zinc-950">{update.title}</p>
                    <StatusBadge status={update.status} />
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">{namedById(data.projects, update.project_id)}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-md bg-zinc-100">
                    <div className="h-full rounded-md bg-emerald-600" style={{ width: `${update.progress}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    )
  }

  function renderCitizens() {
    return (
      <div className="grid gap-5">
        {canManage('citizens') ? (
          <Panel icon={Users} title="Citizen Register">
            <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={handleAddCitizen}>
              <TextField
                label="Full Name"
                value={citizenDraft.full_name}
                onChange={(value) => setCitizenDraft((draft) => ({ ...draft, full_name: value }))}
              />
              <SelectField
                label="Sex"
                value={citizenDraft.sex}
                options={sexOptions}
                onChange={(value) => setCitizenDraft((draft) => ({ ...draft, sex: value as Sex }))}
              />
              <TextField
                label="Phone Number"
                value={citizenDraft.phone_number}
                required={false}
                onChange={(value) => setCitizenDraft((draft) => ({ ...draft, phone_number: value }))}
              />
              <SelectField
                label="Village"
                value={citizenDraft.village_id}
                options={villageOptions}
                onChange={(value) => setCitizenDraft((draft) => ({ ...draft, village_id: value }))}
              />
              <div className="md:col-span-2 xl:col-span-4">
                <SubmitButton label="Add Citizen" />
              </div>
            </form>
          </Panel>
        ) : (
          <ReadOnlyNotice role={currentUser?.role ?? 'Governor'} />
        )}

        <DataTable<Citizen>
          rows={filteredCitizens}
          emptyLabel="No citizens found"
          columns={[
            { header: 'Name', value: (citizen) => <span className="font-semibold text-zinc-950">{citizen.full_name}</span> },
            { header: 'Sex', value: (citizen) => labelFromCode(citizen.sex) },
            { header: 'Phone', value: (citizen) => citizen.phone_number || 'Not recorded' },
            { header: 'Village', value: (citizen) => namedById(data.villages, citizen.village_id) },
            { header: 'Created', value: (citizen) => citizen.created_at },
          ]}
        />
      </div>
    )
  }

  function renderSubcounties() {
    const selectedSubcounty = selectedSubcountyId
      ? data.subcounties.find((subcounty) => subcounty.id === selectedSubcountyId) ?? null
      : null
    const wardsForSelectedSubcounty = selectedSubcounty
      ? data.wards.filter((ward) => ward.subcounty_id === selectedSubcounty.id)
      : []
    const selectedWard = selectedWardId
      ? wardsForSelectedSubcounty.find((ward) => ward.id === selectedWardId) ?? null
      : null
    const sublocationsForSelectedWard = selectedWard
      ? data.sublocations.filter((sublocation) => sublocation.ward_id === selectedWard.id)
      : []
    const selectedSublocation = selectedSublocationId
      ? sublocationsForSelectedWard.find((sublocation) => sublocation.id === selectedSublocationId) ?? null
      : null
    const villagesForSelectedSublocation = selectedSublocation
      ? data.villages.filter((village) => village.sublocation_id === selectedSublocation.id)
      : []
    const canManageGeography = canManage('subcounties')
    const wardCreationLocked = selectedSubcounty ? wardLockedSubcounties.has(selectedSubcounty.name) : false

    return (
      <div className="grid gap-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.35fr)]">
          <Panel icon={MapPinned} title="Subcounties">
            <div className="grid gap-2">
              {filteredSubcounties.map((subcounty) => {
                const wardCount = data.wards.filter((ward) => ward.subcounty_id === subcounty.id).length
                const active = selectedSubcounty?.id === subcounty.id

                return (
                  <button
                    className={`flex min-h-16 items-center justify-between gap-3 rounded-md border px-3 py-2 text-left transition ${
                      active
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-emerald-200 hover:bg-emerald-50/50'
                    }`}
                    key={subcounty.id}
                    type="button"
                    title={subcounty.name}
                    onClick={() => selectSubcounty(subcounty.id)}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold">{subcounty.name}</span>
                      <span className="mt-1 block text-xs text-zinc-500">{wardCount} wards</span>
                    </span>
                    {active ? (
                      <Check className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                    )}
                  </button>
                )
              })}
              {filteredSubcounties.length === 0 ? (
                <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">
                  No subcounties found
                </p>
              ) : null}
            </div>
          </Panel>

          <div className="grid gap-5">
            <Panel icon={Layers3} title={selectedSubcounty ? `${selectedSubcounty.name} Wards` : 'Wards'}>
              {selectedSubcounty && canManageGeography && !wardCreationLocked ? (
                <form className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleAddWard}>
                  <TextField
                    label="Ward Name"
                    value={wardDraft.name}
                    onChange={(value) => setWardDraft((draft) => ({ ...draft, name: value }))}
                  />
                  <div className="self-end">
                    <SubmitButton label="Add Ward" />
                  </div>
                </form>
              ) : null}

              {selectedSubcounty ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {wardsForSelectedSubcounty.map((ward) => {
                    const sublocationCount = data.sublocations.filter((sublocation) => sublocation.ward_id === ward.id).length
                    const active = selectedWard?.id === ward.id

                    return (
                      <button
                        className={`min-h-20 rounded-md border px-3 py-2 text-left transition ${
                          active
                            ? 'border-emerald-600 bg-emerald-50'
                            : 'border-zinc-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/50'
                        }`}
                        key={ward.id}
                        type="button"
                        title={ward.name}
                        onClick={() => selectWard(ward.id)}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-bold text-zinc-950">{ward.name}</span>
                          {active ? (
                            <Check className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                          ) : null}
                        </span>
                        <span className="mt-2 block text-xs text-zinc-500">
                          {sublocationCount} sublocations
                        </span>
                        <span className="mt-1 block text-xs text-zinc-500">
                          {data.projects.filter((project) => project.ward_id === ward.id).length} projects
                        </span>
                      </button>
                    )
                  })}
                  {wardsForSelectedSubcounty.length === 0 ? (
                    <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500 sm:col-span-2">
                      No wards found for this subcounty
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">
                  Select a subcounty to view wards
                </p>
              )}
            </Panel>

            <div className="grid gap-5 2xl:grid-cols-2">
              <Panel icon={Map} title={selectedWard ? `${selectedWard.name} Sublocations` : 'Sublocations'}>
                {selectedWard && canManageGeography ? (
                  <form className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleAddSublocation}>
                    <TextField
                      label="Sublocation Name"
                      value={sublocationDraft.name}
                      onChange={(value) => setSublocationDraft((draft) => ({ ...draft, name: value }))}
                    />
                    <div className="self-end">
                      <SubmitButton label="Add Sublocation" />
                    </div>
                  </form>
                ) : null}

                {selectedWard ? (
                  <div className="grid gap-2">
                    {sublocationsForSelectedWard.map((sublocation) => {
                      const villageCount = data.villages.filter((village) => village.sublocation_id === sublocation.id).length
                      const active = selectedSublocation?.id === sublocation.id

                      return (
                        <button
                          className={`flex min-h-14 items-center justify-between gap-3 rounded-md border px-3 py-2 text-left transition ${
                            active
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-zinc-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/50'
                          }`}
                          key={sublocation.id}
                          type="button"
                          title={sublocation.name}
                          onClick={() => selectSublocation(sublocation.id)}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-zinc-950">{sublocation.name}</span>
                            <span className="mt-1 block text-xs text-zinc-500">{villageCount} villages</span>
                          </span>
                          {active ? (
                            <Check className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                          ) : (
                            <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                          )}
                        </button>
                      )
                    })}
                    {sublocationsForSelectedWard.length === 0 ? (
                      <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">
                        No sublocations found for this ward
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">
                    Select a ward to view sublocations
                  </p>
                )}
              </Panel>

              <Panel icon={Home} title={selectedSublocation ? `${selectedSublocation.name} Villages` : 'Villages'}>
                {selectedSublocation && canManageGeography ? (
                  <form className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleAddVillage}>
                    <TextField
                      label="Village Name"
                      value={villageDraft.name}
                      onChange={(value) => setVillageDraft((draft) => ({ ...draft, name: value }))}
                    />
                    <div className="self-end">
                      <SubmitButton label="Add Village" />
                    </div>
                  </form>
                ) : null}

                {selectedSublocation ? (
                  <div className="grid gap-2">
                    {villagesForSelectedSublocation.map((village) => (
                      <div className="rounded-md border border-zinc-200 bg-white px-3 py-2" key={village.id}>
                        <p className="truncate text-sm font-bold text-zinc-950">{village.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {data.citizens.filter((citizen) => citizen.village_id === village.id).length} citizens
                        </p>
                      </div>
                    ))}
                    {villagesForSelectedSublocation.length === 0 ? (
                      <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">
                        No villages found for this sublocation
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">
                    Select a sublocation to view villages
                  </p>
                )}
              </Panel>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function renderProjects() {
    const selectedProject = selectedProjectId
      ? data.projects.find((project) => project.id === selectedProjectId) ?? null
      : null
    const selectedProjectUpdates = selectedProject
      ? data.projectUpdates
          .filter((update) => update.project_id === selectedProject.id)
          .sort((first, second) => second.id - first.id)
      : []
    const canCreateProject = canManage('projects')
    const canSubmitProgressUpdate = currentUser ? canWriteProjectUpdates(currentUser.role) : false

    return (
      <div className="grid gap-5">
        {canCreateProject ? (
          <Panel icon={Construction} title="Add Project">
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={handleAddProject}>
            <TextField
              label="Name"
              value={projectDraft.name}
              onChange={(value) => setProjectDraft((draft) => ({ ...draft, name: value }))}
            />
            <SelectField
              label="Ward"
              value={projectDraft.ward_id}
              options={wardOptions}
              onChange={(value) => setProjectDraft((draft) => ({ ...draft, ward_id: value }))}
            />
            <SelectField
              label="Status"
              value={projectDraft.status}
              options={statusOptions}
              onChange={(value) => setProjectDraft((draft) => ({ ...draft, status: value as ProjectStatus }))}
            />
            <SelectField
              label="Priority"
              value={projectDraft.priority}
              options={priorityOptions}
              onChange={(value) => setProjectDraft((draft) => ({ ...draft, priority: value as Priority }))}
            />
            <TextField
              label="Start Date"
              type="date"
              value={projectDraft.start_date}
              required={false}
              onChange={(value) => setProjectDraft((draft) => ({ ...draft, start_date: value }))}
            />
            <TextField
              label="Due Date"
              type="date"
              value={projectDraft.due_date}
              required={false}
              onChange={(value) => setProjectDraft((draft) => ({ ...draft, due_date: value }))}
            />
            <TextField
              label="Completion Date"
              type="date"
              value={projectDraft.completion_date}
              required={false}
              onChange={(value) => setProjectDraft((draft) => ({ ...draft, completion_date: value }))}
            />
            <TextField
              label="Progress"
              type="number"
              value={projectDraft.progress}
              onChange={(value) => setProjectDraft((draft) => ({ ...draft, progress: value }))}
            />
            <TextField
              label="Budget"
              type="number"
              value={projectDraft.budget}
              required={false}
              onChange={(value) => setProjectDraft((draft) => ({ ...draft, budget: value }))}
            />
            <TextField
              label="Actual Cost"
              type="number"
              value={projectDraft.actual_cost}
              required={false}
              onChange={(value) => setProjectDraft((draft) => ({ ...draft, actual_cost: value }))}
            />
            <TextAreaField
              label="Description"
              value={projectDraft.description}
              onChange={(value) => setProjectDraft((draft) => ({ ...draft, description: value }))}
            />
            <div className="md:col-span-2 xl:col-span-3">
              <SubmitButton label="Add Project" />
            </div>
          </form>
          </Panel>
        ) : null}
        <DataTable<Project>
          rows={filteredProjects}
          emptyLabel="No projects found"
          columns={[
            {
              header: 'Project',
              value: (project) => (
                <div>
                  <button
                    className={`text-left font-semibold transition ${
                      selectedProject?.id === project.id
                        ? 'text-emerald-700'
                        : 'text-zinc-950 hover:text-emerald-700'
                    }`}
                    type="button"
                    title={project.name}
                    onClick={() => selectProject(project.id)}
                  >
                    {project.name}
                  </button>
                  <p className="mt-1 max-w-xl text-xs text-zinc-500">{project.description || 'No description'}</p>
                </div>
              ),
            },
            { header: 'Ward', value: (project) => namedById(data.wards, project.ward_id) },
            { header: 'Status', value: (project) => <StatusBadge status={project.status} /> },
            { header: 'Priority', value: (project) => <PriorityBadge priority={project.priority} /> },
            {
              header: 'Progress',
              value: (project) => (
                <div className="min-w-32">
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>{project.progress}%</span>
                    <span>{project.due_date || 'No date'}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-md bg-zinc-100">
                    <div className="h-full rounded-md bg-emerald-600" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              ),
            },
            {
              header: 'Budget Position',
              value: (project) => {
                const utilization = project.budget ? Math.round((project.actual_cost / project.budget) * 100) : 0
                const cappedUtilization = Math.min(utilization, 100)

                return (
                  <div className="min-w-44">
                    <div className="grid gap-1 text-xs text-zinc-500">
                      <div className="flex justify-between gap-3">
                        <span>Allocated</span>
                        <span className="font-semibold text-zinc-950">{money(project.budget)}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span>Actual</span>
                        <span className="font-semibold text-zinc-950">{money(project.actual_cost)}</span>
                      </div>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-md bg-zinc-100">
                      <div className="h-full rounded-md bg-emerald-600" style={{ width: `${cappedUtilization}%` }} />
                    </div>
                    <p className="mt-1 text-xs font-semibold text-zinc-500">{utilization}% used</p>
                  </div>
                )
              },
            },
          ]}
        />

        {selectedProject ? (
          <Panel icon={Gauge} title={`${selectedProject.name} Progress Updates`}>
            <div className="grid gap-5">
              {canSubmitProgressUpdate ? (
                <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={handleAddUpdate}>
                  <TextField
                    label="Title"
                    value={updateDraft.title}
                    required={false}
                    onChange={(value) => setUpdateDraft((draft) => ({ ...draft, title: value }))}
                  />
                  <TextField
                    label="Progress"
                    type="number"
                    value={updateDraft.progress}
                    onChange={(value) => setUpdateDraft((draft) => ({ ...draft, progress: value }))}
                  />
                  <SelectField
                    label="Status"
                    value={updateDraft.status}
                    options={statusOptions}
                    onChange={(value) => setUpdateDraft((draft) => ({ ...draft, status: value as ProjectStatus }))}
                  />
                  <TextAreaField
                    label="Update Text"
                    value={updateDraft.update_text}
                    onChange={(value) => setUpdateDraft((draft) => ({ ...draft, update_text: value }))}
                  />
                  <div className="md:col-span-2 xl:col-span-3">
                    <SubmitButton label="Add Progress Update" />
                  </div>
                </form>
              ) : null}

              <div className="grid gap-3">
                {selectedProjectUpdates.map((update) => (
                  <article className="rounded-lg border border-zinc-200 bg-zinc-50 p-3" key={update.id}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-zinc-950">{update.title}</p>
                      <StatusBadge status={update.status} />
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">{update.update_text}</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-zinc-500">
                      <span>{update.created_at}</span>
                      <span>{update.progress}% progress</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-md bg-white">
                      <div className="h-full rounded-md bg-emerald-600" style={{ width: `${update.progress}%` }} />
                    </div>
                  </article>
                ))}
                {selectedProjectUpdates.length === 0 ? (
                  <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">
                    No progress updates found
                  </p>
                ) : null}
              </div>
            </div>
          </Panel>
        ) : null}
      </div>
    )
  }

  function renderReports() {
    const statusCounts = projectStatuses.map((status, index) => ({
      label: labelFromCode(status),
      count: data.projects.filter((project) => project.status === status).length,
      tone: ['bg-sky-500', 'bg-amber-500', 'bg-emerald-500', 'bg-zinc-500', 'bg-rose-500'][index],
    }))
    const wardProjectCounts = data.wards
      .map((ward, index) => ({
        label: ward.name,
        count: data.projects.filter((project) => project.ward_id === ward.id).length,
        tone: ['bg-emerald-500', 'bg-amber-500', 'bg-sky-500', 'bg-rose-500', 'bg-zinc-500'][index % 5],
      }))
      .filter((ward) => ward.count > 0)

    return (
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            icon={WalletCards}
            label="Allocated Budget"
            note={`${money(metrics.actualCost)} spent`}
            tone="bg-emerald-50 text-emerald-700"
            value={money(metrics.totalBudget)}
          />
          <MetricCard
            icon={Activity}
            label="Budget Utilization"
            note={`${metrics.averageProgress}% average progress`}
            tone="bg-amber-50 text-amber-700"
            value={`${metrics.budgetUse}%`}
          />
          <MetricCard
            icon={ArrowUpRight}
            label="Completion Rate"
            note={`${metrics.completed} of ${data.projects.length} projects`}
            tone="bg-sky-50 text-sky-700"
            value={`${data.projects.length ? Math.round((metrics.completed / data.projects.length) * 100) : 0}%`}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <Panel icon={Construction} title="Project Status">
            <div className="grid gap-4">
              {statusCounts.map((item) => (
                <BarRow
                  key={item.label}
                  label={item.label}
                  value={item.count}
                  total={data.projects.length}
                  tone={item.tone}
                />
              ))}
            </div>
          </Panel>
          <Panel icon={Users} title="Citizens">
            <div className="grid gap-3">
              <p className="text-sm font-medium text-zinc-500">Total Citizens</p>
              <p className="text-4xl font-bold text-zinc-950">{data.citizens.length.toLocaleString()}</p>
              <div className="h-2 overflow-hidden rounded-md bg-zinc-100">
                <div className="h-full rounded-md bg-emerald-600" style={{ width: '100%' }} />
              </div>
            </div>
          </Panel>
          <Panel icon={Layers3} title="Projects by Ward">
            <div className="grid gap-4">
              {wardProjectCounts.map((item) => (
                <BarRow
                  key={item.label}
                  label={item.label}
                  value={item.count}
                  total={data.projects.length}
                  tone={item.tone}
                />
              ))}
            </div>
          </Panel>
        </div>
      </div>
    )
  }

  function renderUsers() {
    const roleOptions: PortalUser['role'][] = ['System Administrator', 'Governor', 'Clerk / Secretary']
    const userStatusOptions: PortalUser['status'][] = ['Active', 'Invited', 'Suspended']

    return (
      <div className="grid gap-5">
        <Panel icon={UserCog} title="Users">
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5" onSubmit={handleAddUser}>
            <TextField
              label="Name"
              value={userDraft.name}
              onChange={(value) => setUserDraft((draft) => ({ ...draft, name: value }))}
            />
            <TextField
              label="Email"
              type="email"
              value={userDraft.email}
              onChange={(value) => setUserDraft((draft) => ({ ...draft, email: value }))}
            />
            <SelectField
              label="Role"
              value={userDraft.role}
              options={roleOptions.map((role) => ({ value: role, label: role }))}
              onChange={(value) => setUserDraft((draft) => ({ ...draft, role: value as PortalUser['role'] }))}
            />
            <SelectField
              label="Status"
              value={userDraft.status}
              options={userStatusOptions.map((status) => ({ value: status, label: status }))}
              onChange={(value) => setUserDraft((draft) => ({ ...draft, status: value as PortalUser['status'] }))}
            />
            <div className="self-end">
              <SubmitButton label="Add User" />
            </div>
          </form>
        </Panel>
        <DataTable<PortalUser>
          rows={filteredUsers}
          emptyLabel="No users found"
          columns={[
            { header: 'Name', value: (user) => <span className="font-semibold text-zinc-950">{user.name}</span> },
            { header: 'Email', value: (user) => user.email },
            { header: 'Role', value: (user) => user.role },
            { header: 'Status', value: (user) => user.status },
            { header: 'Last Active', value: (user) => user.lastActive },
          ]}
        />
      </div>
    )
  }

  function renderSettings() {
    return (
      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Panel icon={Settings} title="Portal Settings">
          <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
            <TextField
              label="County Name"
              value={settings.countyName}
              onChange={(value) => setSettings((current) => ({ ...current, countyName: value }))}
            />
            <TextField
              label="Financial Year"
              value={settings.financialYear}
              onChange={(value) => setSettings((current) => ({ ...current, financialYear: value }))}
            />
            <div>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                type="submit"
                title="Save Settings"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                Save Settings
              </button>
            </div>
          </form>
        </Panel>
        <Panel icon={Megaphone} title="Communication">
          <div className="grid gap-3">
            <Toggle
              label="SMS Alerts"
              checked={settings.smsAlerts}
              onChange={(checked) => setSettings((current) => ({ ...current, smsAlerts: checked }))}
            />
            <Toggle
              label="Email Reports"
              checked={settings.emailReports}
              onChange={(checked) => setSettings((current) => ({ ...current, emailReports: checked }))}
            />
            <Toggle
              label="Public Portal"
              checked={settings.publicPortal}
              onChange={(checked) => setSettings((current) => ({ ...current, publicPortal: checked }))}
            />
          </div>
        </Panel>
      </div>
    )
  }

  function renderNotifications() {
    return (
      <div className="grid gap-5">
        <Panel icon={Bell} title="Notifications">
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_180px_auto]" onSubmit={handleAddNotification}>
            <TextField
              label="Title"
              value={notificationDraft.title}
              onChange={(value) => setNotificationDraft((draft) => ({ ...draft, title: value }))}
            />
            <TextField
              label="Message"
              value={notificationDraft.message}
              onChange={(value) => setNotificationDraft((draft) => ({ ...draft, message: value }))}
            />
            <SelectField
              label="Type"
              value={notificationDraft.type}
              options={['Project', 'Citizen', 'System', 'Finance'].map((type) => ({ value: type, label: type }))}
              onChange={(value) => setNotificationDraft((draft) => ({ ...draft, type: value as Notification['type'] }))}
            />
            <div className="self-end">
              <SubmitButton label="Add Notice" />
            </div>
          </form>
        </Panel>
        <div className="grid gap-3">
          {filteredNotifications.map((notification) => (
            <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm" key={notification.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-zinc-950">{notification.title}</p>
                    <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-semibold text-zinc-600">
                      {notification.type}
                    </span>
                    {!notification.read ? (
                      <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        New
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-zinc-600">{notification.message}</p>
                  <p className="mt-2 text-xs text-zinc-500">{notification.createdAt}</p>
                </div>
                <button
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
                  type="button"
                  disabled={notification.read}
                  title="Mark Read"
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Mark Read
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    )
  }

  function renderActiveModule() {
    if (currentUser && !canViewModule(currentUser.role, activeModule)) {
      return renderDashboard()
    }

    switch (activeModule) {
      case 'dashboard':
        return renderDashboard()
      case 'citizens':
        return renderCitizens()
      case 'subcounties':
        return renderSubcounties()
      case 'projects':
        return renderProjects()
      case 'reports':
        return renderReports()
      case 'users':
        return renderUsers()
      case 'settings':
        return renderSettings()
      case 'notifications':
        return renderNotifications()
    }
  }

  if (!currentUser) {
    return (
      <LoginPage
        email={loginEmail}
        password={loginPassword}
        error={loginError}
        onEmailChange={setLoginEmail}
        onPasswordChange={setLoginPassword}
        onSubmit={handleLogin}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f7f3] text-zinc-900">
      {mobileNavOpen ? (
        <button
          className="fixed inset-0 z-30 bg-zinc-950/40 lg:hidden"
          type="button"
          title="Close Menu"
          aria-label="Close Menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[88vw] flex-col border-r border-zinc-200 bg-white transition-transform lg:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex min-h-20 items-center gap-3 border-b border-zinc-200 px-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-700 text-white">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase text-emerald-700">Smart County</p>
            <h1 className="text-base font-bold leading-snug text-zinc-950">Development Portal</h1>
          </div>
          <button
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 lg:hidden"
            type="button"
            title="Close Menu"
            aria-label="Close Menu"
            onClick={() => setMobileNavOpen(false)}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="grid gap-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              const active = item.key === activeModule

              if (item.key === 'subcounties') {
                return (
                  <div className="grid gap-1" key={item.key}>
                    <button
                      className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition ${
                        active
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                      }`}
                      type="button"
                      title={item.label}
                      onClick={() => activateModule(item.key)}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {geographyNavOpen && active ? (
                        <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      )}
                    </button>

                    {geographyNavOpen && active ? (
                      <div className="ml-5 grid gap-1 border-l border-zinc-200 pl-3">
                        {data.subcounties.map((subcounty) => {
                          const subcountyActive = selectedSubcountyId === subcounty.id
                          const wards = data.wards.filter((ward) => ward.subcounty_id === subcounty.id)

                          return (
                            <div className="grid gap-1" key={subcounty.id}>
                              <button
                                className={`flex min-h-9 items-center gap-2 rounded-md px-2 text-left text-xs font-semibold transition ${
                                  subcountyActive
                                    ? 'bg-emerald-50 text-emerald-800'
                                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                                }`}
                                type="button"
                                title={subcounty.name}
                                onClick={() => selectSubcounty(subcounty.id)}
                              >
                                <MapPinned className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                <span className="min-w-0 flex-1 truncate">{subcounty.name}</span>
                                {subcountyActive ? (
                                  <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                ) : (
                                  <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                )}
                              </button>

                              {subcountyActive ? (
                                <div className="ml-4 grid gap-1 border-l border-zinc-100 pl-2">
                                  {wards.map((ward) => {
                                    const wardActive = selectedWardId === ward.id

                                    return (
                                      <button
                                        className={`flex min-h-8 items-center gap-2 rounded-md px-2 text-left text-xs font-medium transition ${
                                          wardActive
                                            ? 'bg-emerald-700 text-white'
                                            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950'
                                        }`}
                                        key={ward.id}
                                        type="button"
                                        title={ward.name}
                                        onClick={() => selectWard(ward.id, true)}
                                      >
                                        <Layers3 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                        <span className="min-w-0 flex-1 truncate">{ward.name}</span>
                                      </button>
                                    )
                                  })}
                                  {wards.length === 0 ? (
                                    <p className="px-2 py-2 text-xs font-medium text-zinc-400">No wards</p>
                                  ) : null}
                                </div>
                              ) : null}
                            </div>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                )
              }

              return (
                <button
                  className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition ${
                    active
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                  }`}
                  key={item.key}
                  type="button"
                  title={item.label}
                  onClick={() => activateModule(item.key)}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-zinc-200 p-4">
          <div className="grid gap-3 rounded-lg bg-zinc-50 p-3">
            <div>
              <p className="text-xs font-semibold uppercase text-zinc-500">Signed In</p>
              <p className="mt-1 truncate text-sm font-bold text-zinc-950">{currentUser.name}</p>
              <p className="mt-0.5 text-xs font-semibold text-emerald-700">{currentUser.role}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-zinc-500">Financial Year</p>
              <p className="mt-1 text-sm font-bold text-zinc-950">{settings.financialYear}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-20 flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 text-zinc-700 lg:hidden"
                type="button"
                title="Open Menu"
                aria-label="Open Menu"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <ActiveIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-zinc-500">{settings.countyName}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-bold text-zinc-950 sm:text-2xl">{activeItem.label}</h2>
                  {!canManageActiveModule && activeModule !== 'dashboard' && activeModule !== 'reports' ? (
                    <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                      Read Only
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative block sm:w-72">
                <span className="sr-only">Search</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  className="h-10 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  value={search}
                  placeholder="Search records"
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
                type="button"
                title="Mark All Read"
                disabled={!canManage('notifications') || isSyncing}
                onClick={markAllRead}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                <span>{metrics.unread} unread</span>
              </button>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
                type="button"
                title="Logout"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <section className="px-4 py-5 sm:px-6 lg:px-8">{renderActiveModule()}</section>
      </main>
    </div>
  )
}

export default App
