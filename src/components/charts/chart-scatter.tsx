import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts'
import { getChartColor } from './chart-config'

export function ChartScatter({
  data,
  height = 280,
  xKey = 'x',
  yKey = 'y',
  zKey = 'z',
}: {
  data: Array<Record<string, number | string>>
  height?: number
  xKey?: string
  yKey?: string
  zKey?: string
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} type="number" />
        <YAxis dataKey={yKey} tickLine={false} axisLine={false} width={32} tickMargin={8} type="number" />
        <ZAxis dataKey={zKey} range={[60, 400]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={data} fill={getChartColor(0)} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
