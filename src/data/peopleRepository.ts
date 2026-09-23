import { demoPeopleData } from './demoPeopleData'
import type { DashboardData, PeopleRepository } from '../types/people'

const endpoint = import.meta.env.VITE_PEOPLE_API_URL

const demoRepository: PeopleRepository = {
  async getDashboardData() {
    return demoPeopleData
  },
}

const appsScriptRepository: PeopleRepository = {
  async getDashboardData(): Promise<DashboardData> {
    if (!endpoint) throw new Error('A URL da API não foi configurada.')
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`A API respondeu com erro (${response.status}).`)
    const data: DashboardData = await response.json()
    if (!Array.isArray(data.employees) || !Array.isArray(data.history) || !Array.isArray(data.movements)) {
      throw new Error('O formato de resposta da API não corresponde ao contrato esperado.')
    }
    return data
  },
}

export const peopleRepository = endpoint ? appsScriptRepository : demoRepository
