import type { MutationCtx } from './_generated/server'

export async function nextId(ctx: MutationCtx, counterName: string) {
  const existing = await ctx.db
    .query('counters')
    .withIndex('by_name', (q) => q.eq('name', counterName))
    .unique()

  const value = (existing?.value ?? 0) + 1

  if (existing) {
    await ctx.db.patch(existing._id, { value })
  } else {
    await ctx.db.insert('counters', { name: counterName, value })
  }

  return value
}

export function nowIso() {
  return new Date().toISOString()
}
