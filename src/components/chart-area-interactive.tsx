import { useMemo, useState } from 'react'
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from 'recharts'
import type { MonthlySnapshot } from '@/types/people'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

const chartConfig = {
  total: { label: 'Quadro total', color: '#5682ff' },
} satisfies ChartConfig

export function ChartAreaInteractive({ history }: { history: MonthlySnapshot[] }) {
  const [range, setRange] = useState(12)
  const chartData = useMemo(() => history.slice(-range), [history, range])
  const rangeItems = [3, 6, 12].map((months) => ({ label: `${months} meses`, value: String(months) }))

  return <Card className="dashboard-chart-card">
    <CardHeader className="dashboard-chart-header">
      <div>
        <CardTitle>Evolução do quadro</CardTitle>
        <CardDescription>Total de pessoas no quadro ao longo do tempo.</CardDescription>
      </div>
      <CardAction>
        <Select items={rangeItems} value={String(range)} onValueChange={(value) => { if (value) setRange(Number(value)) }}>
          <SelectTrigger className="dashboard-select-trigger chart-range-select" size="sm" aria-label="Período do gráfico"><SelectValue /></SelectTrigger>
          <SelectContent className="dashboard-select-content"><SelectGroup><SelectLabel>Período</SelectLabel>{rangeItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </CardAction>
    </CardHeader>
    <CardContent>
      {chartData.length === 0 ? <div className="dashboard-empty-chart">Sem histórico mensal disponível.</div> : <ChartContainer config={chartConfig} className="dashboard-chart-container">
        <LineChart accessibilityLayer data={chartData} margin={{ top: 21, right: 12, left: -19, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#303036" strokeDasharray="3 5" />
          <XAxis dataKey="monthShort" axisLine={false} tickLine={false} tickMargin={9} tick={{ fill: '#92929c', fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} width={42} tick={{ fill: '#92929c', fontSize: 11 }} domain={['dataMin - 8', 'dataMax + 8']} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(_, payload) => payload?.[0]?.payload?.month ?? ''} formatter={(value) => [`${value} pessoas`, 'Quadro total']} />} />
          <Line type="natural" dataKey="total" name="Quadro total" stroke="var(--color-total)" strokeWidth={2.3} dot={{ r: 3, fill: 'var(--color-total)', strokeWidth: 0 }} activeDot={{ r: 6, fill: 'var(--color-total)', stroke: '#17171a', strokeWidth: 2 }}>
            <LabelList dataKey="total" position="top" offset={10} fill="#b4b4bd" fontSize={9} />
          </Line>
        </LineChart>
      </ChartContainer>}
    </CardContent>
  </Card>
}
