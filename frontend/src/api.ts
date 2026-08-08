import { ConvexHttpClient } from 'convex/browser'
import { api } from '../convex/_generated/api'
import { initialData, type ApprovalStatus, type PortalData } from './data'

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
    const portalData = (await client.query(api.portal.getPortalData, {})) as Partial<PortalData>
    return {
      ...portalData,
      projectDocuments: portalData.projectDocuments ?? [],
      projectApprovals: portalData.projectApprovals ?? [],
      auditEntries: portalData.auditEntries ?? [],
    } as PortalData
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

export async function uploadProjectDocument({
  projectId,
  category,
  file,
  uploadedBy,
}: {
  projectId: number
  category: string
  file: File
  uploadedBy: string
}) {
  const configured = configuredClient()
  const uploadUrl = await configured.mutation(api.portal.generateProjectDocumentUploadUrl, {})
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  })

  if (!response.ok) {
    throw new Error('The document upload could not be completed.')
  }

  const { storageId } = (await response.json()) as { storageId: string }
  return configured.mutation(api.portal.saveProjectDocument, {
    project_id: projectId,
    category,
    file_name: file.name,
    mime_type: file.type || 'application/octet-stream',
    size_bytes: file.size,
    storage_id: storageId as never,
    uploaded_by: uploadedBy,
  })
}

export async function submitProjectForApprovalRequest(projectId: number, submittedBy: string) {
  return configuredClient().mutation(api.portal.submitProjectForApproval, {
    project_id: projectId,
    submitted_by: submittedBy,
  })
}

export async function reviewProjectApprovalRequest({
  approvalId,
  decision,
  actedBy,
  comment,
}: {
  approvalId: number
  decision: Extract<ApprovalStatus, 'APPROVED' | 'REJECTED'>
  actedBy: string
  comment: string
}) {
  return configuredClient().mutation(api.portal.reviewProjectApproval, {
    approval_id: approvalId,
    decision,
    acted_by: actedBy,
    action_comment: comment,
  })
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
