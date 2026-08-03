import type {
  Citizen,
  Notification,
  PortalData,
  PortalUser,
  Project,
  ProjectUpdate,
  Subcounty,
  Sublocation,
  Village,
  Ward,
} from './data'

function resolveApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined
  const browserHost = window.location.hostname
  const defaultUrl = `${window.location.protocol}//${browserHost}:8000/api`

  if (!configured) {
    return defaultUrl
  }

  try {
    const configuredUrl = new URL(configured)
    const isLocalhostApi = configuredUrl.hostname === '127.0.0.1' || configuredUrl.hostname === 'localhost'
    const isLanFrontend = browserHost !== '127.0.0.1' && browserHost !== 'localhost'

    if (isLocalhostApi && isLanFrontend) {
      configuredUrl.hostname = browserHost
      return configuredUrl.toString().replace(/\/$/, '')
    }
  } catch {
    return configured.replace(/\/$/, '')
  }

  return configured.replace(/\/$/, '')
}

const API_BASE_URL = resolveApiBaseUrl()

type PaginatedResponse<T> = {
  data: T[]
  current_page?: number
  last_page?: number
}

type BackendUser = Omit<PortalUser, 'lastActive' | 'role'> & {
  role: string
  last_active_at: string | null
}

type BackendNotification = Omit<Notification, 'createdAt' | 'read'> & {
  created_at: string
  read_at: string | null
}

function normalizeError(error: unknown) {
  return error instanceof Error ? error.message : 'The API request failed.'
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`

    try {
      const payload = (await response.json()) as { message?: string }
      message = payload.message ?? message
    } catch {
      // Keep the status-based message when the response is not JSON.
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

function paginatedPath(path: string, page: number) {
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}per_page=100&page=${page}`
}

async function list<T>(path: string) {
  const records: T[] = []
  let page = 1
  let lastPage = 1

  do {
    const response = await request<PaginatedResponse<T>>(paginatedPath(path, page))
    records.push(...response.data)
    lastPage = response.last_page ?? page
    page = (response.current_page ?? page) + 1
  } while (page <= lastPage)

  return records
}

export async function createRecord<T>(path: string, payload: Record<string, unknown>) {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateRecord<T>(path: string, payload: Record<string, unknown>) {
  return request<T>(path, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

function mapProject(project: Project): Project {
  return {
    ...project,
    budget: Number(project.budget),
    actual_cost: Number(project.actual_cost),
    start_date: project.start_date?.slice(0, 10) ?? '',
    due_date: project.due_date?.slice(0, 10) ?? '',
    completion_date: project.completion_date?.slice(0, 10) ?? '',
  }
}

function normalizeRole(role: string): PortalUser['role'] {
  if (role === 'System Administrator' || role === 'Administrator') {
    return 'System Administrator'
  }

  if (role === 'Clerk / Secretary' || role === 'Field Officer') {
    return 'Clerk / Secretary'
  }

  return 'Governor'
}

function mapUser(user: BackendUser): PortalUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role),
    status: user.status,
    lastActive: user.last_active_at ? user.last_active_at.slice(0, 10) : 'Pending',
  }
}

function mapNotification(notification: BackendNotification): Notification {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    createdAt: notification.created_at?.replace('T', ' ').slice(0, 16) ?? '',
    read: notification.read_at !== null,
  }
}

export async function loadPortalData(): Promise<PortalData> {
  try {
    const [
      subcounties,
      wards,
      sublocations,
      villages,
      citizens,
      projects,
      projectUpdates,
      users,
      notifications,
    ] = await Promise.all([
      list<Subcounty>('/subcounties'),
      list<Ward>('/wards'),
      list<Sublocation>('/sublocations'),
      list<Village>('/villages'),
      list<Citizen>('/citizens'),
      list<Project>('/projects'),
      list<ProjectUpdate>('/project-updates'),
      list<BackendUser>('/users'),
      list<BackendNotification>('/notifications'),
    ])

    return {
      subcounties,
      wards,
      sublocations,
      villages,
      citizens,
      projects: projects.map(mapProject),
      projectUpdates,
      users: users.map(mapUser),
      notifications: notifications.map(mapNotification),
    }
  } catch (error) {
    throw new Error(normalizeError(error))
  }
}

export async function markNotificationReadRequest(id: number) {
  return request<BackendNotification>(`/notifications/${id}/read`, {
    method: 'POST',
  })
}

export async function markAllNotificationsReadRequest() {
  return request<{ marked_read: boolean }>('/notifications/read-all', {
    method: 'POST',
  })
}
