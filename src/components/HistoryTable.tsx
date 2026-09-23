import type { MonthlySnapshot } from '../types/people'

interface HistoryTableProps { data: MonthlySnapshot[]; selectedMonth: string | null; onSelectMonth: (month: string) => void }

export default function HistoryTable({ data, selectedMonth, onSelectMonth }: HistoryTableProps) {
  return <div className="table-scroll"><table className="data-table history-table"><thead><tr><th>MÊS</th><th>QUADRO</th><th>ATIVOS</th><th>AFASTADOS</th><th>DESLIGADOS</th><th>FÉRIAS</th></tr></thead>
    <tbody>{data.map((month) => <tr key={month.month} className={selectedMonth === month.month ? 'history-row-selected' : ''} onClick={() => onSelectMonth(month.month)}>
      <td><button className="month-select">{month.month}<span>↗</span></button></td><td><strong>{month.total}</strong></td><td>{month.active}</td><td>{month.leave}</td><td>{month.dismissed}</td><td>{month.vacation}</td>
    </tr>)}{data.length === 0 && <tr><td colSpan={6} className="table-no-data">Sem consolidação mensal para este ano.</td></tr>}</tbody></table></div>
}
