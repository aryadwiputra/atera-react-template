import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getChartColor } from './chart-config'

export function ChartBar({
  data,
  dataKey,
  height = 280,
  xKey = 'name',
  stacked = false,
  series,
}: {
  data: Array<Record<string, number | string>>
  dataKey?: string
  height?: number
  xKey?: string
  stacked?: boolean
  series?: Array<{ key: string; colorIndex?: number }>
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
        <YAxis tickLine={false} axisLine={false} width={32} tickMargin={8} />
        <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
        {series ? (
          series.map((entry, index) => (
            <Bar
              key={entry.key}
              dataKey={entry.key}
              stackId={stacked ? 'stack' : undefined}
              fill={getChartColor(entry.colorIndex ?? index)}
              radius={[4, 4, 0, 0]}
            />
          ))
        ) : (
          <Bar dataKey={dataKey} fill={getChartColor(0)} radius={[4, 4, 0, 0]} />
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}
