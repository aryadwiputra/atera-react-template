import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getChartColor } from './chart-config'

export function ChartPie({
  data,
  height = 280,
  nameKey = 'name',
  dataKey = 'value',
  innerRadius,
}: {
  data: Array<Record<string, number | string>>
  height?: number
  nameKey?: string
  dataKey?: string
  innerRadius?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={innerRadius}
          outerRadius="80%"
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={getChartColor(index)} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export function PieLegend({ data }: { data: Array<Record<string, number | string>> }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {data.map((entry, index) => (
        <div key={entry.name} className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full" style={{ backgroundColor: getChartColor(index) }} />
          <span className="text-[11px] text-muted-foreground">
            {entry.name} · {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}
