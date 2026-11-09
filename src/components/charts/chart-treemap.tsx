import { ResponsiveContainer, Tooltip, Treemap } from 'recharts'

interface TreemapEntry {
  name: string
  size: number
}

export function ChartTreemap({
  data,
  height = 280,
}: {
  data: Array<TreemapEntry & Record<string, number | string>>
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <Treemap data={data} dataKey="size" nameKey="name" stroke="var(--card)">
        <Tooltip />
      </Treemap>
    </ResponsiveContainer>
  )
}
