export type EmployeeStatus = 'Ativo' | 'Afastado' | 'Férias' | 'Desligado' | 'Transferido'
export type MovementType = 'Admissão' | 'Desligamento' | 'Transferência' | 'Início de férias' | 'Retorno de férias'

export interface Employee {
  employeeId: string
  name: string
  team: string | null
  site: string | null
  channel: string | null
  cell: string | null
  status: EmployeeStatus
  shift: string | null
  coordinator: string | null
  manager: string | null
  role: string | null
  admissionDate: string | null
  area: string | null
  sector: string | null
}

export interface MonthlySnapshot {
  month: string
  monthShort: string
  year: number
  total: number
  active: number
  leave: number
  vacation: number
  dismissed: number
}

export interface Movement {
  id: string
  date: string | null
  employeeName: string
  type: MovementType
  role: string | null
  site: string | null
}

export interface DashboardData {
  source: 'demo' | 'apps-script'
  isFictional: boolean
  updatedAt: string | null
  employees: Employee[]
  history: MonthlySnapshot[]
  movements: Movement[]
}

export interface PeopleRepository {
  getDashboardData(): Promise<DashboardData>
}
