import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getChartColor } from './chart-config'

export function ChartComposed({
  data,
  barKeys = [],
  lineKeys = [],
  height = 280,
  xKey = 'name',
  stacked = false,
}: {
  data: Array<Record<string, number | string>>
  barKeys?: string[]
  lineKeys?: string[]
  height?: number
  xKey?: string
  stacked?: boolean
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
        <YAxis tickLine={false} axisLine={false} width={32} tickMargin={8} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        {barKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId={stacked ? 'stack' : undefined}
            fill={getChartColor(index)}
            radius={[4, 4, 0, 0]}
          />
        ))}
        {lineKeys.map((key, index) => (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            stroke={getChartColor(barKeys.length + index)}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
