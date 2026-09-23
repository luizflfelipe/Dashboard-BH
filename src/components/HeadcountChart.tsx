import { CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlySnapshot } from '../types/people'

export default function HeadcountChart({ data }: { data: MonthlySnapshot[] }) {
  return <div className="chart-wrap">
    {data.length === 0 ? <div className="empty-chart">Sem dados históricos disponíveis.</div> : <ResponsiveContainer width="100%" height="100%">
      <LineChart accessibilityLayer data={data} margin={{ top: 21, right: 12, left: -19, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#303036" strokeDasharray="3 5" />
        <XAxis dataKey="monthShort" axisLine={false} tickLine={false} tick={{ fill: '#92929c', fontSize: 11 }} tickMargin={8} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#92929c', fontSize: 11 }} domain={['dataMin - 8', 'dataMax + 8']} />
        <Tooltip cursor={false} contentStyle={{ background: '#17171a', color: '#e4e4e7', border: '1px solid #3a3a42', borderRadius: 10, boxShadow: '0 6px 20px #0008', fontSize: 12 }} formatter={(value) => [`${value} pessoas`, 'Quadro']} labelFormatter={(_, payload) => payload?.[0]?.payload?.month} />
        <Line type="natural" dataKey="total" name="Quadro total" stroke="#5682ff" strokeWidth={2.3} dot={{ r: 3, fill: '#5682ff', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#5682ff', stroke: '#17171a', strokeWidth: 2 }}>
          <LabelList dataKey="total" position="top" offset={10} fill="#b4b4bd" fontSize={9} />
        </Line>
      </LineChart>
    </ResponsiveContainer>}
  </div>
}
