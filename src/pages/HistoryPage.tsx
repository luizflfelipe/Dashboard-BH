import { useMemo, useState } from 'react'
import { CalendarDays, Check } from 'lucide-react'
import { CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlySnapshot } from '../types/people'
import HistoryTable from '../components/HistoryTable'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../components/ui/select'

type SeriesKey = 'total' | 'active' | 'leave' | 'dismissed'
const series: Array<{ key: SeriesKey; label: string; color: string }> = [
  { key: 'total', label: 'Quadro total', color: '#3569e8' },
  { key: 'active', label: 'Ativos', color: '#20a77a' },
  { key: 'leave', label: 'Afastados', color: '#edaa45' },
  { key: 'dismissed', label: 'Desligados', color: '#e56b72' },
]

export default function HistoryPage({ history }: { history: MonthlySnapshot[] }) {
  const years = Array.from(new Set(history.map((month) => month.year))).sort((a, b) => b - a)
  const [year, setYear] = useState(years[0] ?? new Date().getFullYear())
  const [visible, setVisible] = useState<SeriesKey[]>(['total', 'active'])
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const yearItems = (years.length ? years : [year]).map((option) => ({ label: String(option), value: String(option) }))
  const currentYearData = useMemo(() => history.filter((month) => month.year === year), [history, year])
  const latest = currentYearData.at(-1)
  const toggleSeries = (key: SeriesKey) => setVisible((current) => current.includes(key) ? current.length > 1 ? current.filter((item) => item !== key) : current : [...current, key])

  return <>
    <div className="page-heading">
      <div><div className="eyebrow">PESSOAS <span>·</span> SÉRIE TEMPORAL</div><h1>Histórico</h1><p>Acompanhe a evolução mensal do quadro ao longo do tempo.</p></div>
      <div className="year-control"><CalendarDays size={15} /><Select items={yearItems} value={String(year)} onValueChange={(value) => { if (value) { setYear(Number(value)); setSelectedMonth(null) } }}>
        <SelectTrigger className="dashboard-select-trigger history-year-select" size="sm" aria-label="Selecionar ano"><SelectValue /></SelectTrigger>
        <SelectContent className="dashboard-select-content"><SelectGroup><SelectLabel>Ano</SelectLabel>{yearItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
      </Select></div>
    </div>
    <section className="history-highlight">
      <div className="history-highlight-icon">↗</div><div className="history-highlight-main"><span>Quadro no fechamento do ano</span><strong>{latest?.total ?? '—'} <small>pessoas</small></strong></div>
      <div className="history-highlight-divider" />
      <div className="history-mini-stat"><span>Ativos</span><strong>{latest?.active ?? '—'}</strong></div>
      <div className="history-mini-stat"><span>Afastados</span><strong>{latest?.leave ?? '—'}</strong></div>
      <div className="history-mini-stat"><span>Variação no ano</span><strong className="history-growth">{currentYearData.length > 1 && currentYearData[0].total !== 0 ? `${latest!.total - currentYearData[0].total > 0 ? '+' : ''}${Math.round((latest!.total - currentYearData[0].total) / currentYearData[0].total * 100)}%` : '—'}</strong></div>
    </section>
    <section className="panel history-chart-panel">
      <div className="panel-header history-chart-header"><div><h2>Evolução mensal do quadro</h2><p>Consolidado de {year}</p></div><div className="series-toggles">{series.map(({ key, label, color }) => <button className={`series-toggle ${visible.includes(key) ? 'series-toggle-active' : ''}`} key={key} onClick={() => toggleSeries(key)}><span style={{ backgroundColor: color }}>{visible.includes(key) && <Check size={10} />}</span>{label}</button>)}</div></div>
      <div className="history-chart-wrap">{currentYearData.length === 0 ? <div className="empty-chart">Não há histórico disponível para {year}.</div> : <ResponsiveContainer width="100%" height="100%"><LineChart data={currentYearData} margin={{ top: 15, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#303036" strokeDasharray="3 5" /><XAxis dataKey="monthShort" axisLine={false} tickLine={false} tick={{ fill: '#92929c', fontSize: 11 }} dy={9} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#92929c', fontSize: 11 }} /><Tooltip contentStyle={{ background: '#17171a', color: '#e4e4e7', border: '1px solid #3a3a42', borderRadius: 10, fontSize: 12 }} labelFormatter={(_, payload) => payload?.[0]?.payload?.month} />
        {series.filter(({ key }) => visible.includes(key)).map(({ key, color }) => <Line key={key} type="natural" dataKey={key} name={series.find((item) => item.key === key)?.label} stroke={color} strokeWidth={2.2} dot={{ r: 2.5, fill: color, strokeWidth: 0 }} activeDot={{ r: 5, stroke: '#17171a', strokeWidth: 2 }}>
          {key === 'total' && <LabelList dataKey={key} position="top" offset={9} fill="#b4b4bd" fontSize={9} />}
        </Line>)}
      </LineChart></ResponsiveContainer>}</div>
      <div className="history-chart-caption"><span className="caption-dot" />Valores demonstrativos baseados em consolidações fictícias.</div>
    </section>
    <section className="panel history-table-panel">
      <div className="panel-header history-table-header"><div><h2>Consolidado mensal</h2><p>Resumo do quadro ao final de cada mês.</p></div><span className="months-count">{currentYearData.length} meses</span></div>
      <HistoryTable data={currentYearData} selectedMonth={selectedMonth} onSelectMonth={(month) => setSelectedMonth((current) => current === month ? null : month)} />
      {selectedMonth && <div className="selected-month-note"><span className="selected-month-mark" />{selectedMonth} selecionado<span>Composição por função ficará disponível quando esse detalhamento fizer parte da fonte.</span></div>}
    </section>
    <div className="page-footnote"><span className="footnote-bullet" />Histórico demonstrativo de {year}<span className="footnote-divider">·</span>Não representa movimentações individuais.</div>
  </>
}
