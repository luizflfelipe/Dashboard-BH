import { useMemo } from 'react'
import { ArrowLeftRight, CalendarDays, FileText } from 'lucide-react'
import type { DashboardData, Movement } from '../types/people'
import StatusDistribution from '../components/StatusDistribution'
import SideRays from '../components/SideRays'
import { SectionCards } from '../components/section-cards'
import { ChartAreaInteractive } from '../components/chart-area-interactive'

function formatDate(date: string | null) {
  if (!date) return 'Data não informada'
  const parsed = new Date(`${date}T12:00:00`)
  return Number.isNaN(parsed.valueOf()) ? 'Data inválida' : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(parsed)
}

export default function OverviewPage({ data }: { data: DashboardData }) {
  const currentMonth = data.history.at(-1)
  const recentMovements = useMemo(() => [...data.movements].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')).slice(0, 6), [data.movements])

  return <>
    <div className="overview-hero">
      <SideRays className="overview-rays" rayColor1="#3569e8" rayColor2="#48c7b0" intensity={0.65} spread={1.8} origin="top-right" saturation={1.15} blend={0.68} falloff={2.2} opacity={0.52} />
      <div className="page-heading">
        <div><div className="eyebrow">PAINEL EXECUTIVO <span>·</span> {currentMonth?.month.toUpperCase() ?? 'VISÃO ATUAL'}</div><div className="overview-title-row"><h1>Visão geral</h1><button className="outline-button report-button" type="button" onClick={() => window.print()}><FileText size={14} />Relatório</button></div><p>Um retrato da composição e das movimentações do quadro.</p></div>
        <span className="date-control"><CalendarDays size={15} />Atualizado {data.updatedAt ? formatDate(data.updatedAt.slice(0, 10)) : '—'}</span>
      </div>
    </div>
    <SectionCards data={data} />
    <section className="overview-panels dashboard-overview-panels">
      <ChartAreaInteractive history={data.history} />
      <article className="panel distribution-panel">
        <div className="panel-header"><div><h2>Distribuição atual</h2><p>Composição por status</p></div></div>
        <StatusDistribution employees={data.employees} />
      </article>
    </section>
    <section className="panel recent-panel dashboard-recent-panel">
      <div className="roster-toolbar"><div><h2>Movimentações recentes</h2><p>Os seis eventos mais recentes, sem filtro de datas.</p></div><span className="recent-count"><ArrowLeftRight size={14} />Exibindo {recentMovements.length} de {data.movements.length}</span></div>
      <div className="table-scroll"><table className="data-table movement-table"><thead><tr><th>DATA</th><th>COLABORADOR</th><th>TIPO DE MOVIMENTAÇÃO</th><th>FUNÇÃO</th><th>SITE</th></tr></thead>
        <tbody>{recentMovements.map((movement: Movement, index) => <tr key={movement.id}>
          <td>{formatDate(movement.date)}</td>
          <td><div className="employee-cell"><span className={`employee-avatar avatar-color-${index % 5}`}>{movement.employeeName.split(' ').map((name) => name[0]).slice(0, 2).join('')}</span><strong>{movement.employeeName}</strong></div></td>
          <td><span className="movement-type"><ArrowLeftRight size={14} />{movement.type}</span></td><td>{movement.role ?? '—'}</td><td>{movement.site ?? '—'}</td>
        </tr>)}{recentMovements.length === 0 && <tr><td colSpan={5} className="table-no-data">Sem movimentações disponíveis.</td></tr>}</tbody>
      </table></div>
    </section>
    <div className="page-footnote"><span className="footnote-bullet" />{data.isFictional ? 'Dados ilustrativos para demonstração' : 'Dados fornecidos pela fonte conectada'}<span className="footnote-divider">·</span>Valide os indicadores com as regras oficiais.</div>
  </>
}
