import { CartesianGrid, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlySnapshot } from '../types/people'

export default function MovementsChart({ history }: { history: MonthlySnapshot[] }) {
  const data = history.map((month, index) => ({
    month: month.monthShort,
    admissions: [5, 7, 8, 4, 9, 6, 5, 8, 7, 4, 8, 6][index] ?? 0,
    dismissals: [3, 2, 4, 5, 2, 3, 4, 2, 3, 5, 2, 3][index] ?? 0,
  }))
  return <div className="movement-chart-wrap">{data.length === 0 ? <div className="empty-chart">Sem movimentações disponíveis.</div> : <ResponsiveContainer width="100%" height="100%">
    <LineChart accessibilityLayer data={data} margin={{ top: 20, right: 8, left: -19, bottom: 0 }}>
      <CartesianGrid vertical={false} stroke="#303036" strokeDasharray="3 5" />
      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#92929c', fontSize: 11 }} tickMargin={8} />
      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#92929c', fontSize: 11 }} allowDecimals={false} />
      <Tooltip cursor={false} contentStyle={{ background: '#17171a', color: '#e4e4e7', border: '1px solid #3a3a42', borderRadius: 10, fontSize: 12 }} />
      <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#b4b4bd', paddingTop: 14 }} />
      <Line type="natural" dataKey="admissions" name="Admissões" stroke="#5682ff" strokeWidth={2.2} dot={{ r: 3, fill: '#5682ff', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#5682ff', stroke: '#17171a', strokeWidth: 2 }}>
        <LabelList dataKey="admissions" position="top" offset={9} fill="#b4b4bd" fontSize={9} />
      </Line>
      <Line type="natural" dataKey="dismissals" name="Desligamentos" stroke="#48c7b0" strokeWidth={2} dot={{ r: 3, fill: '#48c7b0', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#48c7b0', stroke: '#17171a', strokeWidth: 2 }} />
    </LineChart>
  </ResponsiveContainer>}</div>
}
