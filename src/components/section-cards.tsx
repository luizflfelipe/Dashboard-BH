import { Activity, ArrowLeftRight, MapPin, UsersRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardData } from '@/types/people'

export function SectionCards({ data }: { data: DashboardData }) {
  const active = data.employees.filter((employee) => employee.status === 'Ativo').length
  const sites = new Set(data.employees.map((employee) => employee.site).filter(Boolean)).size
  const cards = [
    { label: 'Pessoas no quadro', value: data.employees.length.toLocaleString('pt-BR'), detail: 'Colaboradores cadastrados', icon: UsersRound },
    { label: 'Pessoas ativas', value: active.toLocaleString('pt-BR'), detail: `${data.employees.length ? Math.round(active / data.employees.length * 100) : 0}% do quadro atual`, icon: Activity },
    { label: 'Movimentações', value: data.movements.length.toLocaleString('pt-BR'), detail: 'Eventos no período disponível', icon: ArrowLeftRight },
    { label: 'Regiões', value: sites.toLocaleString('pt-BR'), detail: 'Regiões representadas', icon: MapPin },
  ]

  return <section className="dashboard-stat-grid" aria-label="Indicadores principais">
    {cards.map(({ label, value, detail, icon: Icon }) => <Card className="dashboard-stat-card" key={label}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="dashboard-stat-value">{value}</CardTitle>
        <CardAction><Badge variant="outline"><Icon size={14} /></Badge></CardAction>
      </CardHeader>
      <CardFooter className="dashboard-stat-footer"><span>{detail}</span></CardFooter>
    </Card>)}
  </section>
}
