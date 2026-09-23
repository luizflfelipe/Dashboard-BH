import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowLeftRight, ArrowUpRight, CalendarDays, CircleArrowDown, CircleArrowUp, UserRoundPlus, UsersRound } from 'lucide-react'
import type { DashboardData, Movement, MovementType } from '../types/people'
import MovementsChart from '../components/MovementsChart'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../components/ui/select'

function formatDate(date: string | null) {
  if (!date) return 'Data não informada'
  const parsed = new Date(`${date}T12:00:00`)
  return Number.isNaN(parsed.valueOf()) ? 'Data inválida' : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(parsed)
}

const movementTone: Record<MovementType, string> = {
  Admissão: 'movement-admission', Desligamento: 'movement-dismissal', Transferência: 'movement-transfer', 'Início de férias': 'movement-vacation', 'Retorno de férias': 'movement-return',
}

export default function MovementsPage({ data }: { data: DashboardData }) {
  const years = Array.from(new Set([...data.history.map((month) => month.year), ...data.movements.flatMap((item) => item.date ? [Number(item.date.slice(0, 4))] : [])])).sort((a, b) => b - a)
  const [year, setYear] = useState(data.history.at(-1)?.year ?? years[0] ?? new Date().getFullYear())
  const [movementType, setMovementType] = useState<MovementType | 'all'>('all')
  const yearItems = (years.length ? years : [year]).map((option) => ({ label: `Ano de ${option}`, value: String(option) }))
  const movementTypeItems = [{ label: 'Todos os tipos', value: 'all' }, ...(Object.keys(movementTone) as MovementType[]).map((type) => ({ label: type, value: type }))]
  const yearMovements = useMemo(() => data.movements.filter((item) => item.date?.startsWith(`${year}-`)), [data.movements, year])
  const yearHistory = useMemo(() => data.history.filter((month) => month.year === year), [data.history, year])
  const admissions = yearMovements.filter((item) => item.type === 'Admissão').length
  const dismissals = yearMovements.filter((item) => item.type === 'Desligamento').length
  const transfers = yearMovements.filter((item) => item.type === 'Transferência').length
  const vacations = data.employees.filter((person) => person.status === 'Férias').length
  const vacationStarts = yearMovements.filter((item) => item.type === 'Início de férias').length
  const returns = yearMovements.filter((item) => item.type === 'Retorno de férias').length
  const recent = useMemo(() => yearMovements.filter((item) => movementType === 'all' || item.type === movementType).sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    return b.date.localeCompare(a.date)
  }), [yearMovements, movementType])
  const movementIcons: Record<MovementType, typeof CircleArrowUp> = {
    Admissão: CircleArrowUp, Desligamento: CircleArrowDown, Transferência: ArrowLeftRight, 'Início de férias': CalendarDays, 'Retorno de férias': UserRoundPlus,
  }
  return <>
    <div className="page-heading">
      <div><div className="eyebrow">PESSOAS <span>·</span> ENTRADAS E SAÍDAS</div><h1>Movimentações</h1><p>Acompanhe entradas, saídas e eventos do quadro ao longo do tempo.</p></div>
      <div className="date-control"><CalendarDays size={15} /><Select items={yearItems} value={String(year)} onValueChange={(value) => { if (value) setYear(Number(value)) }}>
        <SelectTrigger className="dashboard-select-trigger movement-year-select" size="sm" aria-label="Selecionar ano das movimentações"><SelectValue /></SelectTrigger>
        <SelectContent className="dashboard-select-content"><SelectGroup><SelectLabel>Ano</SelectLabel>{yearItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
      </Select></div>
    </div>
    <section className="movement-stats">
      <article className="movement-stat"><div className="movement-stat-top"><span>Admissões</span><span className="movement-stat-icon positive"><UserRoundPlus size={17} /></span></div><strong>{admissions}</strong><div className="movement-stat-footer"><ArrowUpRight size={14} /> Entradas no período</div></article>
      <article className="movement-stat"><div className="movement-stat-top"><span>Desligamentos</span><span className="movement-stat-icon negative"><ArrowDownRight size={17} /></span></div><strong>{dismissals}</strong><div className="movement-stat-footer">Saídas no período</div></article>
      <article className="movement-stat"><div className="movement-stat-top"><span>Transferências</span><span className="movement-stat-icon neutral"><ArrowLeftRight size={17} /></span></div><strong>{transfers}</strong><div className="movement-stat-footer">Movimentações internas</div></article>
      <article className="movement-stat balance-stat"><div className="movement-stat-top"><span>Saldo do período</span><span className="movement-stat-icon balance"><UsersRound size={17} /></span></div><strong className={admissions - dismissals >= 0 ? 'balance-positive' : 'balance-negative'}>{admissions - dismissals > 0 ? '+' : ''}{admissions - dismissals}</strong><div className="movement-stat-footer">Admissões menos desligamentos</div></article>
    </section>
    <section className="movement-panels">
      <article className="panel movement-chart-panel"><div className="panel-header"><div><h2>Admissões e desligamentos</h2><p>Movimentação mensal ao longo do ano</p></div><span className="panel-period">{year}</span></div><MovementsChart history={yearHistory} /></article>
      <article className="panel vacation-panel"><div className="panel-header"><div><h2>Férias</h2><p>Resumo do período</p></div><span className="vacation-header-icon">✳</span></div>
        <div className="vacation-current"><div className="vacation-current-copy"><span>Pessoas em férias</span><strong>{vacations}<small>pessoas</small></strong></div><span className="vacation-illustration"><CalendarDays size={22} /></span></div>
        <div className="vacation-line"><span><i className="vacation-dot dot-start" />Inícios no período</span><strong>{vacationStarts}</strong></div>
        <div className="vacation-line"><span><i className="vacation-dot dot-return" />Retornos no período</span><strong>{returns}</strong></div>
        <div className="vacation-note">Os eventos desta demonstração são fictícios.</div>
      </article>
    </section>
    <section className="panel recent-panel">
      <div className="roster-toolbar"><div><h2>Movimentações recentes</h2><p>Eventos registrados em {year}.</p></div><Select items={movementTypeItems} value={movementType} onValueChange={(value) => { if (value) setMovementType(value as MovementType | 'all') }}>
        <SelectTrigger className="dashboard-select-trigger movement-type-select" size="sm" aria-label="Filtrar por tipo de movimentação"><SelectValue /></SelectTrigger>
        <SelectContent className="dashboard-select-content"><SelectGroup><SelectLabel>Tipo de movimentação</SelectLabel>{movementTypeItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
      </Select></div>
      <div className="table-scroll"><table className="data-table movement-table"><thead><tr><th>DATA</th><th>COLABORADOR</th><th>TIPO DE MOVIMENTAÇÃO</th><th>FUNÇÃO</th><th>SITE</th></tr></thead>
        <tbody>{recent.map((movement: Movement, index) => { const Icon = movementIcons[movement.type]; return <tr key={movement.id}>
          <td>{formatDate(movement.date)}</td><td><div className="employee-cell"><span className={`employee-avatar avatar-color-${index % 5}`}>{movement.employeeName.split(' ').map((name) => name[0]).slice(0, 2).join('')}</span><strong>{movement.employeeName}</strong></div></td>
          <td><span className={`movement-type ${movementTone[movement.type]}`}><Icon size={14} />{movement.type}</span></td><td>{movement.role ?? '—'}</td><td>{movement.site ?? '—'}</td>
        </tr>})}{recent.length === 0 && <tr><td colSpan={5} className="table-no-data">Sem movimentações disponíveis.</td></tr>}</tbody></table></div>
      <div className="table-footer"><span>Exibindo <strong>{recent.length}</strong> movimentações</span><div className="pagination"><button disabled aria-label="Página anterior">‹</button><button className="page-number" aria-current="page">1</button><button disabled aria-label="Próxima página">›</button></div></div>
    </section>
    <div className="page-footnote"><span className="footnote-bullet" />Saldo = admissões − desligamentos<span className="footnote-divider">·</span>Transferências não entram no cálculo.</div>
  </>
}
