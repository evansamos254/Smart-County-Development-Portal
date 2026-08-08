import { ConvexHttpClient } from 'convex/browser'
import { api } from '../convex/_generated/api'
import type { PortalData } from './data'

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string | undefined

if (!CONVEX_URL) {
  throw new Error('VITE_CONVEX_URL is not configured. Set it in frontend/.env.')
}

const client = new ConvexHttpClient(CONVEX_URL)

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

export async function loadPortalData(): Promise<PortalData> {
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
    return (await client.mutation(mutationRef, payload as never)) as T
  } catch (error) {
    throw new Error(normalizeError(error))
  }
}

export async function markNotificationReadRequest(id: number) {
  return client.mutation(api.portal.markNotificationRead, { id })
}

export async function markAllNotificationsReadRequest() {
  return client.mutation(api.portal.markAllNotificationsRead, {})
}

export async function submitFeedback(payload: { name: string; email: string | null; message: string }) {
  return client.mutation(api.portal.createFeedback, payload)
}

export type FeedbackEntryRecord = {
  id: number
  name: string
  email: string
  message: string
  created_at: string
}

export async function loadFeedback(): Promise<FeedbackEntryRecord[]> {
  return (await client.query(api.portal.listFeedback, {})) as FeedbackEntryRecord[]
}
