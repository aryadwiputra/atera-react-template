import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getChartColor } from './chart-config'

export function ChartLine({
  data,
  dataKeys,
  height = 280,
  xKey = 'name',
}: {
  data: Array<Record<string, number | string>>
  dataKeys: string[]
  height?: number
  xKey?: string
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
        <YAxis tickLine={false} axisLine={false} width={32} tickMargin={8} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            stroke={getChartColor(index)}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
