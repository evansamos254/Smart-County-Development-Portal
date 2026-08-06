import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { nextId, nowIso } from './lib'

export const getPortalData = query({
  args: {},
  handler: async (ctx) => {
    const [subcounties, wards, sublocations, villages, citizens, projects, projectUpdates, users, notifications] =
      await Promise.all([
        ctx.db.query('subcounties').withIndex('by_num_id').collect(),
        ctx.db.query('wards').withIndex('by_num_id').collect(),
        ctx.db.query('sublocations').withIndex('by_num_id').collect(),
        ctx.db.query('villages').withIndex('by_num_id').collect(),
        ctx.db.query('citizens').withIndex('by_num_id').collect(),
        ctx.db.query('projects').withIndex('by_num_id').collect(),
        ctx.db.query('projectUpdates').withIndex('by_num_id').collect(),
        ctx.db.query('users').withIndex('by_num_id').collect(),
        ctx.db.query('notifications').withIndex('by_num_id').collect(),
      ])

    const strip = <T extends { _id: unknown; _creationTime: unknown }>(doc: T) => {
      const { _id, _creationTime, ...rest } = doc
      return rest
    }

    return {
      subcounties: subcounties.map(strip),
      wards: wards.map(strip),
      sublocations: sublocations.map(strip),
      villages: villages.map(strip),
      citizens: citizens.map(strip),
      projects: projects.map(strip),
      projectUpdates: projectUpdates.map(strip),
      users: users.map(strip),
      notifications: notifications.map(strip),
    }
  },
})

export const createWard = mutation({
  args: { name: v.string(), subcounty_id: v.number() },
  handler: async (ctx, args) => {
    const id = await nextId(ctx, 'wards')
    await ctx.db.insert('wards', { id, name: args.name, subcounty_id: args.subcounty_id, created_at: nowIso() })
    return { id }
  },
})

export const createSublocation = mutation({
  args: { name: v.string(), ward_id: v.number() },
  handler: async (ctx, args) => {
    const id = await nextId(ctx, 'sublocations')
    await ctx.db.insert('sublocations', { id, name: args.name, ward_id: args.ward_id, created_at: nowIso() })
    return { id }
  },
})

export const createVillage = mutation({
  args: { name: v.string(), sublocation_id: v.number() },
  handler: async (ctx, args) => {
    const id = await nextId(ctx, 'villages')
    await ctx.db.insert('villages', { id, name: args.name, sublocation_id: args.sublocation_id, created_at: nowIso() })
    return { id }
  },
})

export const createCitizen = mutation({
  args: {
    full_name: v.string(),
    sex: v.string(),
    phone_number: v.union(v.string(), v.null()),
    village_id: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await nextId(ctx, 'citizens')
    await ctx.db.insert('citizens', {
      id,
      full_name: args.full_name,
      sex: args.sex,
      phone_number: args.phone_number ?? '',
      village_id: args.village_id,
      created_at: nowIso(),
    })
    return { id }
  },
})

export const createProject = mutation({
  args: {
    serial_number: v.union(v.string(), v.null()),
    department: v.union(v.string(), v.null()),
    name: v.string(),
    description: v.union(v.string(), v.null()),
    status: v.string(),
    priority: v.string(),
    ward_id: v.number(),
    start_date: v.union(v.string(), v.null()),
    due_date: v.union(v.string(), v.null()),
    completion_date: v.union(v.string(), v.null()),
    progress: v.number(),
    budget: v.number(),
    contract_sum: v.number(),
    contract_variation: v.number(),
    actual_cost: v.number(),
    vote_balance: v.number(),
    contractor: v.union(v.string(), v.null()),
    financial_year: v.union(v.string(), v.null()),
    flagship_type: v.union(v.string(), v.null()),
    procurement_type: v.union(v.string(), v.null()),
    directorate: v.union(v.string(), v.null()),
    source_of_funds: v.union(v.string(), v.null()),
    funded_from: v.union(v.string(), v.null()),
    advertisement_date: v.union(v.string(), v.null()),
    evaluation_date: v.union(v.string(), v.null()),
    awarding_date: v.union(v.string(), v.null()),
    site_handover_date: v.union(v.string(), v.null()),
    expected_start_date: v.union(v.string(), v.null()),
    sss_date: v.union(v.string(), v.null()),
    is_carry_over: v.boolean(),
    is_emergency: v.boolean(),
    remarks: v.union(v.string(), v.null()),
    ward_hq_project: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const id = await nextId(ctx, 'projects')
    const timestamp = nowIso()
    await ctx.db.insert('projects', {
      id,
      serial_number: args.serial_number ?? '',
      department: args.department ?? '',
      name: args.name,
      description: args.description ?? '',
      status: args.status,
      priority: args.priority,
      ward_id: args.ward_id,
      start_date: args.start_date ?? '',
      due_date: args.due_date ?? '',
      completion_date: args.completion_date ?? '',
      progress: args.progress,
      budget: args.budget,
      contract_sum: args.contract_sum,
      contract_variation: args.contract_variation,
      actual_cost: args.actual_cost,
      vote_balance: args.vote_balance,
      contractor: args.contractor ?? '',
      financial_year: args.financial_year ?? '',
      flagship_type: args.flagship_type ?? '',
      procurement_type: args.procurement_type ?? '',
      directorate: args.directorate ?? '',
      source_of_funds: args.source_of_funds ?? '',
      funded_from: args.funded_from ?? '',
      advertisement_date: args.advertisement_date ?? '',
      evaluation_date: args.evaluation_date ?? '',
      awarding_date: args.awarding_date ?? '',
      site_handover_date: args.site_handover_date ?? '',
      expected_start_date: args.expected_start_date ?? '',
      sss_date: args.sss_date ?? '',
      is_carry_over: args.is_carry_over,
      is_emergency: args.is_emergency,
      remarks: args.remarks ?? '',
      ward_hq_project: args.ward_hq_project ?? '',
      created_at: timestamp,
      updated_at: timestamp,
    })
    return { id }
  },
})

export const createProjectUpdate = mutation({
  args: {
    project_id: v.number(),
    title: v.string(),
    update_text: v.string(),
    progress: v.number(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await nextId(ctx, 'projectUpdates')
    await ctx.db.insert('projectUpdates', {
      id,
      project_id: args.project_id,
      title: args.title,
      update_text: args.update_text,
      progress: args.progress,
      status: args.status,
      created_at: nowIso(),
    })

    const project = await ctx.db
      .query('projects')
      .withIndex('by_num_id', (q) => q.eq('id', args.project_id))
      .unique()

    if (project) {
      await ctx.db.patch(project._id, {
        status: args.status,
        progress: args.progress,
        updated_at: nowIso(),
      })
    }

    return { id }
  },
})

export const createUser = mutation({
  args: { name: v.string(), email: v.string(), role: v.string(), status: v.string() },
  handler: async (ctx, args) => {
    const id = await nextId(ctx, 'users')
    await ctx.db.insert('users', {
      id,
      name: args.name,
      email: args.email,
      role: args.role,
      status: args.status,
      lastActive: 'Pending',
    })
    return { id }
  },
})

export const createNotification = mutation({
  args: { title: v.string(), message: v.string(), type: v.string() },
  handler: async (ctx, args) => {
    const id = await nextId(ctx, 'notifications')
    await ctx.db.insert('notifications', {
      id,
      title: args.title,
      message: args.message,
      type: args.type,
      createdAt: nowIso().replace('T', ' ').slice(0, 16),
      read: false,
    })
    return { id }
  },
})

export const markNotificationRead = mutation({
  args: { id: v.number() },
  handler: async (ctx, args) => {
    const notification = await ctx.db
      .query('notifications')
      .withIndex('by_num_id', (q) => q.eq('id', args.id))
      .unique()

    if (notification) {
      await ctx.db.patch(notification._id, { read: true })
    }
  },
})

export const markAllNotificationsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const notifications = await ctx.db.query('notifications').collect()
    await Promise.all(notifications.filter((item) => !item.read).map((item) => ctx.db.patch(item._id, { read: true })))
  },
})

export const createFeedback = mutation({
  args: { name: v.string(), email: v.union(v.string(), v.null()), message: v.string() },
  handler: async (ctx, args) => {
    const id = await nextId(ctx, 'feedback')
    await ctx.db.insert('feedback', {
      id,
      name: args.name,
      email: args.email ?? '',
      message: args.message,
      created_at: nowIso(),
    })
    return { id }
  },
})

export const listFeedback = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query('feedback').withIndex('by_num_id').collect()
    return entries
      .map(({ _id, _creationTime, ...rest }) => rest)
      .sort((first, second) => second.id - first.id)
  },
})
