import { ConvexHttpClient } from 'convex/browser'
import { api } from '../convex/_generated/api'
import { initialData, type PortalData } from './data'

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string | undefined
const client = CONVEX_URL ? new ConvexHttpClient(CONVEX_URL) : null

const createMutationByPath = {
  '/wards': api.portal.createWard,
  '/sublocations': api.portal.createSublocation,
  '/villages': api.portal.createVillage,
  '/citizens': api.portal.createCitizen,
  '/projects': api.portal.createProject,
  '/project-updates': api.portal.createProjectUpdate,
  '/users': api.portal.createUser,
  '/notifications': api.portal.createNotification,
} as const

function normalizeError(error: unknown) {
  return error instanceof Error ? error.message : 'The Convex request failed.'
}

function configuredClient() {
  if (!client) {
    throw new Error('VITE_CONVEX_URL is not configured. Set it in frontend/.env to enable data syncing.')
  }

  return client
}

export async function loadPortalData(): Promise<PortalData> {
  if (!client) {
    return initialData
  }

  try {
    return (await client.query(api.portal.getPortalData, {})) as PortalData
  } catch (error) {
    throw new Error(normalizeError(error))
  }
}

export async function createRecord<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  const mutationRef = createMutationByPath[path as keyof typeof createMutationByPath]

  if (!mutationRef) {
    throw new Error(`No Convex mutation is registered for "${path}".`)
  }

  try {
    return (await configuredClient().mutation(mutationRef, payload as never)) as T
  } catch (error) {
    throw new Error(normalizeError(error))
  }
}

export async function markNotificationReadRequest(id: number) {
  return configuredClient().mutation(api.portal.markNotificationRead, { id })
}

export async function markAllNotificationsReadRequest() {
  return configuredClient().mutation(api.portal.markAllNotificationsRead, {})
}

export async function submitFeedback(payload: { name: string; email: string | null; message: string }) {
  return configuredClient().mutation(api.portal.createFeedback, payload)
}

export type FeedbackEntryRecord = {
  id: number
  name: string
  email: string
  message: string
  created_at: string
}

export async function loadFeedback(): Promise<FeedbackEntryRecord[]> {
  if (!client) {
    return []
  }

  return (await client.query(api.portal.listFeedback, {})) as FeedbackEntryRecord[]
}
