import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getChartColor } from './chart-config'

export function ChartArea({
  data,
  dataKey,
  height = 280,
  xKey = 'name',
  fill = true,
}: {
  data: Array<Record<string, number | string>>
  dataKey: string
  height?: number
  xKey?: string
  fill?: boolean
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={getChartColor(0)} stopOpacity={0.35} />
            <stop offset="100%" stopColor={getChartColor(0)} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
        <YAxis tickLine={false} axisLine={false} width={32} tickMargin={8} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Area
          dataKey={dataKey}
          type="monotone"
          stroke={getChartColor(0)}
          fill={fill ? `url(#gradient-${dataKey})` : 'transparent'}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
