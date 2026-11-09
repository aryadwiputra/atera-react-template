import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getChartColor } from './chart-config'

export function ChartRadar({
  data,
  dataKey,
  height = 280,
  angleKey = 'subject',
}: {
  data: Array<Record<string, number | string>>
  dataKey: string
  height?: number
  angleKey?: string
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 8, right: 32, bottom: 8, left: 32 }}>
        <PolarGrid className="stroke-border" />
        <PolarAngleAxis dataKey={angleKey} tickLine={false} />
        <PolarRadiusAxis tick={false} axisLine={false} />
        <Tooltip />
        <Radar dataKey={dataKey} stroke={getChartColor(0)} fill={getChartColor(0)} fillOpacity={0.25} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
