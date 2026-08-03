export type Sex = 'MALE' | 'FEMALE' | 'OTHER'
export type ProjectStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export type Subcounty = {
  id: number
  name: string
  created_at: string
}

export type Ward = {
  id: number
  name: string
  subcounty_id: number
  created_at: string
}

export type Sublocation = {
  id: number
  name: string
  ward_id: number
  created_at: string
}

export type Village = {
  id: number
  name: string
  sublocation_id: number
  created_at: string
}

export type Citizen = {
  id: number
  full_name: string
  sex: Sex
  phone_number: string
  village_id: number
  created_at: string
}

export type Project = {
  id: number
  name: string
  description: string
  status: ProjectStatus
  priority: Priority
  ward_id: number
  start_date: string
  due_date: string
  completion_date: string
  progress: number
  budget: number
  actual_cost: number
  created_at: string
  updated_at: string
}

export type ProjectUpdate = {
  id: number
  project_id: number
  title: string
  update_text: string
  progress: number
  status: ProjectStatus
  created_at: string
}

export type PortalUser = {
  id: number
  name: string
  email: string
  role: 'System Administrator' | 'Governor' | 'Clerk / Secretary'
  status: 'Active' | 'Invited' | 'Suspended'
  lastActive: string
}

export type Notification = {
  id: number
  title: string
  message: string
  type: 'Project' | 'Citizen' | 'System' | 'Finance'
  createdAt: string
  read: boolean
}

export type SettingsState = {
  countyName: string
  financialYear: string
  smsAlerts: boolean
  emailReports: boolean
  publicPortal: boolean
}

export type PortalData = {
  subcounties: Subcounty[]
  wards: Ward[]
  sublocations: Sublocation[]
  villages: Village[]
  citizens: Citizen[]
  projects: Project[]
  projectUpdates: ProjectUpdate[]
  users: PortalUser[]
  notifications: Notification[]
}

export const projectStatuses: ProjectStatus[] = [
  'PLANNED',
  'IN_PROGRESS',
  'COMPLETED',
  'ON_HOLD',
  'CANCELLED',
]

export const priorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH']
export const sexes: Sex[] = ['MALE', 'FEMALE', 'OTHER']

export const initialSettings: SettingsState = {
  countyName: 'Smart County',
  financialYear: '2026/2027',
  smsAlerts: true,
  emailReports: true,
  publicPortal: false,
}

export const initialData: PortalData = {
  subcounties: [
    { id: 1, name: 'Teso South', created_at: '2026-07-02' },
    { id: 2, name: 'Teso North', created_at: '2026-07-02' },
    { id: 3, name: 'Matayos', created_at: '2026-07-03' },
    { id: 4, name: 'Funyula', created_at: '2026-07-03' },
    { id: 5, name: 'Butula', created_at: '2026-07-03' },
    { id: 6, name: 'Budalangi', created_at: '2026-07-03' },
    { id: 7, name: 'Nambale', created_at: '2026-07-03' },
  ],
  wards: [
    { id: 1, name: 'Amukura Central', subcounty_id: 1, created_at: '2026-07-04' },
    { id: 2, name: 'Amukura East', subcounty_id: 1, created_at: '2026-07-04' },
    { id: 3, name: 'Angurai East', subcounty_id: 2, created_at: '2026-07-05' },
    { id: 4, name: 'Bukhayo West', subcounty_id: 3, created_at: '2026-07-05' },
    { id: 5, name: "Agenga'", subcounty_id: 4, created_at: '2026-07-05' },
    { id: 6, name: 'Bukhayo Central', subcounty_id: 7, created_at: '2026-07-31' },
    { id: 7, name: 'Bukhayo East', subcounty_id: 7, created_at: '2026-07-31' },
    { id: 8, name: 'Bukhayo North/Walatsi', subcounty_id: 7, created_at: '2026-07-31' },
    { id: 9, name: 'Nambale Township', subcounty_id: 7, created_at: '2026-07-31' },
    { id: 10, name: 'Bunyala Central', subcounty_id: 6, created_at: '2026-07-31' },
    { id: 11, name: 'Bunyala North', subcounty_id: 6, created_at: '2026-07-31' },
    { id: 12, name: 'Bunyala South', subcounty_id: 6, created_at: '2026-07-31' },
    { id: 13, name: 'Bunyala West', subcounty_id: 6, created_at: '2026-07-31' },
    { id: 14, name: 'Elugulu', subcounty_id: 5, created_at: '2026-07-31' },
    { id: 15, name: 'Kingandole', subcounty_id: 5, created_at: '2026-07-31' },
    { id: 16, name: 'Marachi Central', subcounty_id: 5, created_at: '2026-07-31' },
    { id: 17, name: 'Marachi East', subcounty_id: 5, created_at: '2026-07-31' },
    { id: 18, name: 'Marachi North', subcounty_id: 5, created_at: '2026-07-31' },
    { id: 19, name: 'Marachi West', subcounty_id: 5, created_at: '2026-07-31' },
    { id: 20, name: 'Bwiri', subcounty_id: 4, created_at: '2026-07-31' },
    { id: 21, name: 'Namboboto Nambuku', subcounty_id: 4, created_at: '2026-07-31' },
    { id: 22, name: 'Nangina', subcounty_id: 4, created_at: '2026-07-31' },
    { id: 23, name: 'Burumba', subcounty_id: 3, created_at: '2026-07-31' },
    { id: 24, name: 'Busibwabo', subcounty_id: 3, created_at: '2026-07-31' },
    { id: 25, name: 'Matayos South', subcounty_id: 3, created_at: '2026-07-31' },
    { id: 26, name: 'Mayenje', subcounty_id: 3, created_at: '2026-07-31' },
    { id: 27, name: 'Angurai North', subcounty_id: 2, created_at: '2026-08-01' },
    { id: 28, name: 'Angurai South', subcounty_id: 2, created_at: '2026-08-01' },
    { id: 29, name: 'Malaba Central', subcounty_id: 2, created_at: '2026-08-01' },
    { id: 30, name: 'Malaba North', subcounty_id: 2, created_at: '2026-08-01' },
    { id: 31, name: 'Malaba South', subcounty_id: 2, created_at: '2026-08-01' },
    { id: 32, name: 'Amukura West', subcounty_id: 1, created_at: '2026-08-01' },
    { id: 33, name: 'Angorom', subcounty_id: 1, created_at: '2026-08-01' },
    { id: 34, name: 'Chakol North', subcounty_id: 1, created_at: '2026-08-01' },
    { id: 35, name: 'Chakol South', subcounty_id: 1, created_at: '2026-08-01' },
  ],
  sublocations: [
    { id: 1, name: 'Market Centre', ward_id: 1, created_at: '2026-07-05' },
    { id: 2, name: 'Industrial Line', ward_id: 2, created_at: '2026-07-06' },
    { id: 3, name: 'Green Valley North', ward_id: 3, created_at: '2026-07-06' },
    { id: 4, name: 'Hilltop Junction', ward_id: 4, created_at: '2026-07-07' },
    { id: 5, name: 'Harbor Landing', ward_id: 5, created_at: '2026-07-07' },
  ],
  villages: [
    { id: 1, name: 'Mwangaza Village', sublocation_id: 1, created_at: '2026-07-08' },
    { id: 2, name: 'Umoja Village', sublocation_id: 1, created_at: '2026-07-08' },
    { id: 3, name: 'Kipepeo Village', sublocation_id: 2, created_at: '2026-07-08' },
    { id: 4, name: 'Tumaini Village', sublocation_id: 3, created_at: '2026-07-09' },
    { id: 5, name: 'Pwani Village', sublocation_id: 5, created_at: '2026-07-09' },
  ],
  citizens: [
    {
      id: 1,
      full_name: 'Amina Wanjiku',
      sex: 'FEMALE',
      phone_number: '+254712000111',
      village_id: 1,
      created_at: '2026-07-10',
    },
    {
      id: 2,
      full_name: 'Brian Otieno',
      sex: 'MALE',
      phone_number: '+254733000222',
      village_id: 2,
      created_at: '2026-07-11',
    },
    {
      id: 3,
      full_name: 'Caroline Nekesa',
      sex: 'FEMALE',
      phone_number: '+254722000333',
      village_id: 4,
      created_at: '2026-07-12',
    },
    {
      id: 4,
      full_name: 'David Kiptoo',
      sex: 'MALE',
      phone_number: '+254701000444',
      village_id: 5,
      created_at: '2026-07-12',
    },
  ],
  projects: [
    {
      id: 1,
      name: 'Market Ward Water Extension',
      description: 'Extend clean water access to Mwangaza and Umoja villages.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      ward_id: 1,
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
      id: 2,
      name: 'Green Valley ECDE Renovation',
      description: 'Renovate classrooms and sanitation facilities.',
      status: 'PLANNED',
      priority: 'MEDIUM',
      ward_id: 3,
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
      id: 3,
      name: 'Harbor Access Road',
      description: 'Grade and murram the feeder road into Harbor Landing.',
      status: 'ON_HOLD',
      priority: 'HIGH',
      ward_id: 5,
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
      id: 4,
      name: 'Hilltop Solar Streetlights',
      description: 'Install public lighting around Hilltop Junction.',
      status: 'COMPLETED',
      priority: 'LOW',
      ward_id: 4,
      start_date: '2026-04-01',
      due_date: '2026-06-30',
      completion_date: '2026-06-22',
      progress: 100,
      budget: 4800000,
      actual_cost: 4550000,
      created_at: '2026-04-01',
      updated_at: '2026-06-22',
    },
  ],
  projectUpdates: [
    {
      id: 1,
      project_id: 1,
      title: 'Main trenching complete',
      update_text: 'Primary trenching is complete and pipe delivery is scheduled.',
      progress: 64,
      status: 'IN_PROGRESS',
      created_at: '2026-07-24',
    },
    {
      id: 2,
      project_id: 3,
      title: 'Awaiting drainage approval',
      update_text: 'Work is paused pending drainage redesign approval.',
      progress: 38,
      status: 'ON_HOLD',
      created_at: '2026-07-18',
    },
    {
      id: 3,
      project_id: 4,
      title: 'Commissioned',
      update_text: 'Lights were tested and handed over to the ward office.',
      progress: 100,
      status: 'COMPLETED',
      created_at: '2026-06-22',
    },
  ],
  users: [
    {
      id: 1,
      name: 'System Administrator',
      email: 'admin@county.go.ke',
      role: 'System Administrator',
      status: 'Active',
      lastActive: 'Today',
    },
    {
      id: 2,
      name: 'County Governor',
      email: 'governor@county.go.ke',
      role: 'Governor',
      status: 'Active',
      lastActive: 'Yesterday',
    },
    {
      id: 3,
      name: 'Clerk / Secretary',
      email: 'clerk@county.go.ke',
      role: 'Clerk / Secretary',
      status: 'Invited',
      lastActive: 'Pending',
    },
  ],
  notifications: [
    {
      id: 1,
      title: 'Budget variance flagged',
      message: 'Harbor Access Road has crossed 30% spend with less than 40% progress.',
      type: 'Finance',
      createdAt: '2026-07-25 09:12',
      read: false,
    },
    {
      id: 2,
      title: 'Project update submitted',
      message: 'Market Ward Water Extension received a new field update.',
      type: 'Project',
      createdAt: '2026-07-24 16:40',
      read: false,
    },
    {
      id: 3,
      title: 'New citizen record',
      message: 'A citizen profile was added in Tumaini Village.',
      type: 'Citizen',
      createdAt: '2026-07-22 11:03',
      read: true,
    },
  ],
}
