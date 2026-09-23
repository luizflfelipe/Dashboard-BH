import { BriefcaseBusiness, CircleCheck, Palmtree, UserRoundMinus } from 'lucide-react'
import type { Employee } from '../types/people'

const statusRows = [
  { key: 'Ativo', icon: CircleCheck, tone: 'green' },
  { key: 'Férias', icon: Palmtree, tone: 'blue' },
  { key: 'Afastado', icon: BriefcaseBusiness, tone: 'amber' },
  { key: 'Desligado', icon: UserRoundMinus, tone: 'red' },
] as const

export default function StatusDistribution({ employees }: { employees: Employee[] }) {
  const total = employees.length || 1
  return <div className="status-distribution">
    {statusRows.map(({ key, icon: Icon, tone }) => {
      const count = employees.filter((employee) => employee.status === key).length
      const percent = Math.round(count / total * 100)
      return <div className="status-row" key={key}>
        <span className={`status-icon status-icon-${tone}`}><Icon size={15} /></span>
        <span className="status-name">{key}</span>
        <div className="status-track"><span className={`status-fill fill-${tone}`} style={{ width: `${percent}%` }} /></div>
        <strong className="status-count">{count}</strong>
      </div>
    })}
    <div className="status-total"><span>Total de registros</span><strong>{employees.length}</strong></div>
  </div>
}
