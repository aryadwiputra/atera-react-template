import { Cell, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getChartColor } from './chart-config'

export function ChartRadialBar({
  data,
  dataKey,
  height = 280,
}: {
  data: Array<Record<string, number | string>>
  dataKey: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart data={data} innerRadius="30%" outerRadius="90%" margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <PolarAngleAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
        <Tooltip />
        <RadialBar dataKey={dataKey} background cornerRadius={8}>
          {data.map((_, index) => (
            <Cell key={index} fill={getChartColor(index)} />
          ))}
        </RadialBar>
      </RadialBarChart>
    </ResponsiveContainer>
  )
}
