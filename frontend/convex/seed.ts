import { mutation } from './_generated/server'
import { nextId } from './lib'

const projectTrackingDefaults = {
  serial_number: '',
  department: 'Public Works, Roads and Transport',
  contract_sum: 0,
  contract_variation: 0,
  vote_balance: 0,
  contractor: '',
  financial_year: 'FY2026/2027',
  flagship_type: 'non flagship',
  procurement_type: 'procurable',
  directorate: 'Roads',
  source_of_funds: 'GOK',
  funded_from: 'both',
  advertisement_date: '',
  evaluation_date: '',
  awarding_date: '',
  site_handover_date: '',
  expected_start_date: '',
  sss_date: '',
  is_carry_over: false,
  is_emergency: false,
  remarks: '',
  ward_hq_project: '',
}

export const reset = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      'counters',
      'subcounties',
      'wards',
      'sublocations',
      'villages',
      'citizens',
      'projects',
      'projectUpdates',
      'users',
      'notifications',
      'feedback',
    ] as const

    for (const table of tables) {
      const docs = await ctx.db.query(table).collect()
      await Promise.all(docs.map((doc) => ctx.db.delete(doc._id)))
    }
  },
})

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('subcounties').first()

    if (existing) {
      return { seeded: false }
    }

    const subcounties = [
      { name: 'Teso South', created_at: '2026-07-02' },
      { name: 'Teso North', created_at: '2026-07-02' },
      { name: 'Matayos', created_at: '2026-07-03' },
      { name: 'Funyula', created_at: '2026-07-03' },
      { name: 'Butula', created_at: '2026-07-03' },
      { name: 'Budalangi', created_at: '2026-07-03' },
      { name: 'Nambale', created_at: '2026-07-03' },
    ]
    const subcountyIds: number[] = []

    for (const subcounty of subcounties) {
      const id = await nextId(ctx, 'subcounties')
      await ctx.db.insert('subcounties', { id, ...subcounty })
      subcountyIds.push(id)
    }

    const wards = [
      { name: 'Amukura Central', subcounty_index: 0, created_at: '2026-07-04' },
      { name: 'Amukura East', subcounty_index: 0, created_at: '2026-07-04' },
      { name: 'Angurai East', subcounty_index: 1, created_at: '2026-07-05' },
      { name: 'Bukhayo West', subcounty_index: 2, created_at: '2026-07-05' },
      { name: "Agenga'", subcounty_index: 3, created_at: '2026-07-05' },
      { name: 'Bukhayo Central', subcounty_index: 6, created_at: '2026-07-31' },
      { name: 'Bukhayo East', subcounty_index: 6, created_at: '2026-07-31' },
      { name: 'Bukhayo North/Walatsi', subcounty_index: 6, created_at: '2026-07-31' },
      { name: 'Nambale Township', subcounty_index: 6, created_at: '2026-07-31' },
      { name: 'Bunyala Central', subcounty_index: 5, created_at: '2026-07-31' },
      { name: 'Bunyala North', subcounty_index: 5, created_at: '2026-07-31' },
      { name: 'Bunyala South', subcounty_index: 5, created_at: '2026-07-31' },
      { name: 'Bunyala West', subcounty_index: 5, created_at: '2026-07-31' },
      { name: 'Elugulu', subcounty_index: 4, created_at: '2026-07-31' },
      { name: 'Kingandole', subcounty_index: 4, created_at: '2026-07-31' },
      { name: 'Marachi Central', subcounty_index: 4, created_at: '2026-07-31' },
      { name: 'Marachi East', subcounty_index: 4, created_at: '2026-07-31' },
      { name: 'Marachi North', subcounty_index: 4, created_at: '2026-07-31' },
      { name: 'Marachi West', subcounty_index: 4, created_at: '2026-07-31' },
      { name: 'Bwiri', subcounty_index: 3, created_at: '2026-07-31' },
      { name: 'Namboboto Nambuku', subcounty_index: 3, created_at: '2026-07-31' },
      { name: 'Nangina', subcounty_index: 3, created_at: '2026-07-31' },
      { name: 'Burumba', subcounty_index: 2, created_at: '2026-07-31' },
      { name: 'Busibwabo', subcounty_index: 2, created_at: '2026-07-31' },
      { name: 'Matayos South', subcounty_index: 2, created_at: '2026-07-31' },
      { name: 'Mayenje', subcounty_index: 2, created_at: '2026-07-31' },
      { name: 'Angurai North', subcounty_index: 1, created_at: '2026-08-01' },
      { name: 'Angurai South', subcounty_index: 1, created_at: '2026-08-01' },
      { name: 'Malaba Central', subcounty_index: 1, created_at: '2026-08-01' },
      { name: 'Malaba North', subcounty_index: 1, created_at: '2026-08-01' },
      { name: 'Malaba South', subcounty_index: 1, created_at: '2026-08-01' },
      { name: 'Amukura West', subcounty_index: 0, created_at: '2026-08-01' },
      { name: 'Angorom', subcounty_index: 0, created_at: '2026-08-01' },
      { name: 'Chakol North', subcounty_index: 0, created_at: '2026-08-01' },
      { name: 'Chakol South', subcounty_index: 0, created_at: '2026-08-01' },
    ]
    const wardIds: number[] = []

    for (const ward of wards) {
      const id = await nextId(ctx, 'wards')
      await ctx.db.insert('wards', {
        id,
        name: ward.name,
        subcounty_id: subcountyIds[ward.subcounty_index],
        created_at: ward.created_at,
      })
      wardIds.push(id)
    }

    const sublocations = [
      { name: 'Market Centre', ward_index: 0, created_at: '2026-07-05' },
      { name: 'Industrial Line', ward_index: 1, created_at: '2026-07-06' },
      { name: 'Green Valley North', ward_index: 2, created_at: '2026-07-06' },
      { name: 'Hilltop Junction', ward_index: 3, created_at: '2026-07-07' },
      { name: 'Harbor Landing', ward_index: 4, created_at: '2026-07-07' },
    ]
    const sublocationIds: number[] = []

    for (const sublocation of sublocations) {
      const id = await nextId(ctx, 'sublocations')
      await ctx.db.insert('sublocations', {
        id,
        name: sublocation.name,
        ward_id: wardIds[sublocation.ward_index],
        created_at: sublocation.created_at,
      })
      sublocationIds.push(id)
    }

    const villages = [
      { name: 'Mwangaza Village', sublocation_index: 0, created_at: '2026-07-08' },
      { name: 'Umoja Village', sublocation_index: 0, created_at: '2026-07-08' },
      { name: 'Kipepeo Village', sublocation_index: 1, created_at: '2026-07-08' },
      { name: 'Tumaini Village', sublocation_index: 2, created_at: '2026-07-09' },
      { name: 'Pwani Village', sublocation_index: 4, created_at: '2026-07-09' },
    ]
    const villageIds: number[] = []

    for (const village of villages) {
      const id = await nextId(ctx, 'villages')
      await ctx.db.insert('villages', {
        id,
        name: village.name,
        sublocation_id: sublocationIds[village.sublocation_index],
        created_at: village.created_at,
      })
      villageIds.push(id)
    }

    const citizens = [
      { full_name: 'Amina Wanjiku', sex: 'FEMALE', phone_number: '+254712000111', village_index: 0, created_at: '2026-07-10' },
      { full_name: 'Brian Otieno', sex: 'MALE', phone_number: '+254733000222', village_index: 1, created_at: '2026-07-11' },
      { full_name: 'Caroline Nekesa', sex: 'FEMALE', phone_number: '+254722000333', village_index: 3, created_at: '2026-07-12' },
      { full_name: 'David Kiptoo', sex: 'MALE', phone_number: '+254701000444', village_index: 4, created_at: '2026-07-12' },
    ]

    for (const citizen of citizens) {
      const id = await nextId(ctx, 'citizens')
      await ctx.db.insert('citizens', {
        id,
        full_name: citizen.full_name,
        sex: citizen.sex,
        phone_number: citizen.phone_number,
        village_id: villageIds[citizen.village_index],
        created_at: citizen.created_at,
      })
    }

    const projects = [
      {
        ward_index: 0,
        serial_number: '1',
        contract_sum: 18500000,
        vote_balance: 7300000,
        contractor: 'County Works Team',
        name: 'Market Ward Water Extension',
        description: 'Extend clean water access to Mwangaza and Umoja villages.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        start_date: '2026-06-01',
        due_date: '2026-09-30',
        completion_date: '',
        progress: 64,
        budget: 18500000,
        actual_cost: 11200000,
        created_at: '2026-06-01',
        updated_at: '2026-07-24',
      },
      {
        ward_index: 2,
        serial_number: '2',
        contract_sum: 7200000,
        vote_balance: 6700000,
        contractor: 'County Works Team',
        directorate: 'Public works',
        name: 'Green Valley ECDE Renovation',
        description: 'Renovate classrooms and sanitation facilities.',
        status: 'PLANNED',
        priority: 'MEDIUM',
        start_date: '2026-08-05',
        due_date: '2026-11-20',
        completion_date: '',
        progress: 10,
        budget: 7200000,
        actual_cost: 500000,
        created_at: '2026-07-14',
        updated_at: '2026-07-20',
      },
      {
        ward_index: 4,
        serial_number: '3',
        contract_sum: 26800000,
        vote_balance: 17500000,
        contractor: 'Roads Maintenance Unit',
        name: 'Harbor Access Road',
        description: 'Grade and murram the feeder road into Harbor Landing.',
        status: 'ON_HOLD',
        priority: 'HIGH',
        start_date: '2026-05-12',
        due_date: '2026-08-30',
        completion_date: '',
        progress: 38,
        budget: 26800000,
        actual_cost: 9300000,
        created_at: '2026-05-12',
        updated_at: '2026-07-18',
      },
      {
        ward_index: 3,
        serial_number: '4',
        contract_sum: 4800000,
        vote_balance: 250000,
        contractor: 'Energy Works Unit',
        directorate: 'Energy',
        name: 'Hilltop Solar Streetlights',
        description: 'Install public lighting around Hilltop Junction.',
        status: 'COMPLETED',
        priority: 'LOW',
        start_date: '2026-04-01',
        due_date: '2026-06-30',
        completion_date: '2026-06-22',
        progress: 100,
        budget: 4800000,
        actual_cost: 4550000,
        created_at: '2026-04-01',
        updated_at: '2026-06-22',
      },
    ]
    const projectIds: number[] = []

    for (const project of projects) {
      const { ward_index, ...projectFields } = project
      const id = await nextId(ctx, 'projects')
      await ctx.db.insert('projects', {
        ...projectTrackingDefaults,
        ...projectFields,
        id,
        ward_id: wardIds[ward_index],
      })
      projectIds.push(id)
    }

    const projectUpdates = [
      {
        project_index: 0,
        title: 'Main trenching complete',
        update_text: 'Primary trenching is complete and pipe delivery is scheduled.',
        progress: 64,
        status: 'IN_PROGRESS',
        created_at: '2026-07-24',
      },
      {
        project_index: 2,
        title: 'Awaiting drainage approval',
        update_text: 'Work is paused pending drainage redesign approval.',
        progress: 38,
        status: 'ON_HOLD',
        created_at: '2026-07-18',
      },
      {
        project_index: 3,
        title: 'Commissioned',
        update_text: 'Lights were tested and handed over to the ward office.',
        progress: 100,
        status: 'COMPLETED',
        created_at: '2026-06-22',
      },
    ]

    for (const update of projectUpdates) {
      const id = await nextId(ctx, 'projectUpdates')
      await ctx.db.insert('projectUpdates', {
        id,
        project_id: projectIds[update.project_index],
        title: update.title,
        update_text: update.update_text,
        progress: update.progress,
        status: update.status,
        created_at: update.created_at,
      })
    }

    const users = [
      { name: 'System Administrator', email: 'admin@county.go.ke', role: 'System Administrator', status: 'Active', lastActive: 'Today' },
      { name: 'County Governor', email: 'governor@county.go.ke', role: 'Governor', status: 'Active', lastActive: 'Yesterday' },
      { name: 'Clerk / Secretary', email: 'clerk@county.go.ke', role: 'Clerk / Secretary', status: 'Invited', lastActive: 'Pending' },
    ]

    for (const user of users) {
      const id = await nextId(ctx, 'users')
      await ctx.db.insert('users', { id, ...user })
    }

    const notifications = [
      {
        title: 'Budget variance flagged',
        message: 'Harbor Access Road has crossed 30% spend with less than 40% progress.',
        type: 'Finance',
        createdAt: '2026-07-25 09:12',
        read: false,
      },
      {
        title: 'Project update submitted',
        message: 'Market Ward Water Extension received a new field update.',
        type: 'Project',
        createdAt: '2026-07-24 16:40',
        read: false,
      },
      {
        title: 'New citizen record',
        message: 'A citizen profile was added in Tumaini Village.',
        type: 'Citizen',
        createdAt: '2026-07-22 11:03',
        read: true,
      },
    ]

    for (const notification of notifications) {
      const id = await nextId(ctx, 'notifications')
      await ctx.db.insert('notifications', { id, ...notification })
    }

    return { seeded: true }
  },
})
