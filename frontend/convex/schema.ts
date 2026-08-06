import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  counters: defineTable({
    name: v.string(),
    value: v.number(),
  }).index('by_name', ['name']),

  subcounties: defineTable({
    id: v.number(),
    name: v.string(),
    created_at: v.string(),
  }).index('by_num_id', ['id']),

  wards: defineTable({
    id: v.number(),
    name: v.string(),
    subcounty_id: v.number(),
    created_at: v.string(),
  }).index('by_num_id', ['id']),

  sublocations: defineTable({
    id: v.number(),
    name: v.string(),
    ward_id: v.number(),
    created_at: v.string(),
  }).index('by_num_id', ['id']),

  villages: defineTable({
    id: v.number(),
    name: v.string(),
    sublocation_id: v.number(),
    created_at: v.string(),
  }).index('by_num_id', ['id']),

  citizens: defineTable({
    id: v.number(),
    full_name: v.string(),
    sex: v.string(),
    phone_number: v.string(),
    village_id: v.number(),
    created_at: v.string(),
  }).index('by_num_id', ['id']),

  projects: defineTable({
    id: v.number(),
    serial_number: v.string(),
    department: v.string(),
    name: v.string(),
    description: v.string(),
    status: v.string(),
    priority: v.string(),
    ward_id: v.number(),
    start_date: v.string(),
    due_date: v.string(),
    completion_date: v.string(),
    progress: v.number(),
    budget: v.number(),
    contract_sum: v.number(),
    contract_variation: v.number(),
    actual_cost: v.number(),
    vote_balance: v.number(),
    contractor: v.string(),
    financial_year: v.string(),
    flagship_type: v.string(),
    procurement_type: v.string(),
    directorate: v.string(),
    source_of_funds: v.string(),
    funded_from: v.string(),
    advertisement_date: v.string(),
    evaluation_date: v.string(),
    awarding_date: v.string(),
    site_handover_date: v.string(),
    expected_start_date: v.string(),
    sss_date: v.string(),
    is_carry_over: v.boolean(),
    is_emergency: v.boolean(),
    remarks: v.string(),
    ward_hq_project: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
  }).index('by_num_id', ['id']),

  projectUpdates: defineTable({
    id: v.number(),
    project_id: v.number(),
    title: v.string(),
    update_text: v.string(),
    progress: v.number(),
    status: v.string(),
    created_at: v.string(),
  }).index('by_num_id', ['id']),

  users: defineTable({
    id: v.number(),
    name: v.string(),
    email: v.string(),
    role: v.string(),
    status: v.string(),
    lastActive: v.string(),
  }).index('by_num_id', ['id']),

  notifications: defineTable({
    id: v.number(),
    title: v.string(),
    message: v.string(),
    type: v.string(),
    createdAt: v.string(),
    read: v.boolean(),
  }).index('by_num_id', ['id']),

  feedback: defineTable({
    id: v.number(),
    name: v.string(),
    email: v.string(),
    message: v.string(),
    created_at: v.string(),
  }).index('by_num_id', ['id']),
})
