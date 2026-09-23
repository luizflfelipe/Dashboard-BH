import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, UsersRound, X } from 'lucide-react'
import type { Employee } from '../types/people'
import DistributionBars from '../components/DistributionBars'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../components/ui/select'

interface RosterPageProps { employees: Employee[] }
type FilterKey = 'site' | 'channel' | 'team' | 'status'

function countBy(values: Array<string | null>) {
  const counts = new Map<string, number>()
  values.forEach((value) => { if (value) counts.set(value, (counts.get(value) ?? 0) + 1) })
  return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count)
}

export default function RosterPage({ employees }: RosterPageProps) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<FilterKey, string>>({ site: '', channel: '', team: '', status: '' })
  const filtered = useMemo(() => employees.filter((person) => {
    const matchesSearch = `${person.name} ${person.role ?? ''} ${person.coordinator ?? ''}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))
    return matchesSearch && (!filters.site || person.site === filters.site) && (!filters.channel || person.channel === filters.channel) && (!filters.team || person.team === filters.team) && (!filters.status || person.status === filters.status)
  }), [employees, filters, search])
  const options = (key: FilterKey) => Array.from(new Set(employees.map((person) => person[key]).filter((value): value is string => Boolean(value)))).sort()
  const updateFilter = (key: FilterKey, value: string) => setFilters((current) => ({ ...current, [key]: value }))
  const clearFilters = () => { setSearch(''); setFilters({ site: '', channel: '', team: '', status: '' }) }
  const activeFilters = Object.values(filters).some(Boolean) || Boolean(search)
  const statusClass = (status: Employee['status']) => `badge-${status.toLocaleLowerCase('pt-BR').replace('é', 'e').replace('ã', 'a')}`

  return <>
    <div className="page-heading page-heading-roster">
      <div><div className="eyebrow">PESSOAS <span>·</span> EXPLORAÇÃO</div><h1>Quadro atual</h1><p>Explore a composição atual por equipe, localidade e status.</p></div>
    </div>
    <section className="roster-kpis" aria-label="Resumo do quadro atual">
      <div className="roster-kpi">
        <span className="roster-kpi-icon"><UsersRound size={20} /></span>
        <div className="roster-kpi-copy"><span>Colaboradores exibidos</span><div className="roster-kpi-value"><strong>{filtered.length}</strong><span>de {employees.length} no quadro</span></div></div>
      </div>
    </section>
    <section className="roster-distributions">
      <DistributionBars title="Por site" subtitle="Pessoas por localidade" entries={countBy(filtered.map((person) => person.site))} color="blue" />
      <DistributionBars title="Por canal" subtitle="Pessoas por canal de atendimento" entries={countBy(filtered.map((person) => person.channel))} color="violet" />
    </section>
    <section className="panel roster-panel">
      <div className="roster-toolbar">
        <div><h2>Colaboradores</h2><p>Informações organizacionais do quadro atual.</p></div>
        <div className="roster-toolbar-right">
          <label className="search-field"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar colaborador..." aria-label="Buscar colaborador" />{search && <button onClick={() => setSearch('')} aria-label="Limpar busca"><X size={14} /></button>}</label>
          <span className="filter-icon"><SlidersHorizontal size={16} /></span>
        </div>
      </div>
      <div className="filter-row">
        {([{ key: 'site', label: 'Todos os sites', group: 'Localidade' }, { key: 'channel', label: 'Todos os canais', group: 'Canal' }, { key: 'team', label: 'Todas as equipes', group: 'Equipe' }, { key: 'status', label: 'Todos os status', group: 'Status' }] as const).map(({ key, label, group }) => {
          const items = [{ label, value: null }, ...options(key).map((option) => ({ label: option, value: option }))]
          return <Select key={key} items={items} value={filters[key] || null} onValueChange={(value) => updateFilter(key, value ?? '')}>
            <SelectTrigger className="dashboard-select-trigger roster-filter-select" size="sm" aria-label={label}><SelectValue /></SelectTrigger>
            <SelectContent className="dashboard-select-content"><SelectGroup><SelectLabel>{group}</SelectLabel>{items.map((item) => <SelectItem key={item.value ?? 'all'} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
          </Select>
        })}
        {activeFilters && <button className="clear-filters" onClick={clearFilters}>Limpar filtros <X size={13} /></button>}
      </div>
      <div className="table-scroll"><table className="data-table"><thead><tr><th>COLABORADOR</th><th>FUNÇÃO</th><th>EQUIPE</th><th>SITE</th><th>COORDENADOR</th><th>STATUS</th></tr></thead>
        <tbody>{filtered.map((person, index) => <tr key={person.employeeId}>
          <td><div className="employee-cell"><span className={`employee-avatar avatar-color-${index % 5}`}>{person.name.split(' ').map((name) => name[0]).slice(0, 2).join('')}</span><strong>{person.name}</strong></div></td>
          <td>{person.role ?? '—'}</td><td>{person.team ?? '—'}</td><td><span className="site-cell"><i />{person.site ?? '—'}</span></td><td>{person.coordinator ?? '—'}</td><td><span className={`status-badge ${statusClass(person.status)}`}><i />{person.status}</span></td>
        </tr>)}
        {filtered.length === 0 && <tr><td colSpan={6}><div className="table-empty"><span><Search size={17} /></span><strong>Nenhum resultado encontrado</strong><p>Tente ajustar a busca ou remover algum filtro.</p><button onClick={clearFilters}>Limpar busca e filtros</button></div></td></tr>}
        </tbody></table></div>
      <div className="table-footer"><span>Exibindo <strong>{filtered.length}</strong> de <strong>{employees.length}</strong> colaboradores</span><div className="pagination"><button disabled aria-label="Página anterior">‹</button><button className="page-number" aria-current="page">1</button><button disabled aria-label="Próxima página">›</button></div></div>
    </section>
    <div className="page-footnote"><span className="footnote-bullet" />Apenas informações organizacionais são exibidas nesta tela.</div>
  </>
}
