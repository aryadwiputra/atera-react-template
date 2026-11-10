import type { Deal, DealStage } from './types'

let deals: Deal[] = [
  { id: 'DEAL-001', company: 'Northstar Labs', contact: 'Olivia Martin', email: 'olivia@northstar.io', value: 24000, stage: 'new', owner: 'Avery Morgan', createdAt: '2026-11-08' },
  { id: 'DEAL-002', company: 'Vertex Studio', contact: 'Jackson Lee', email: 'jackson@vertex.studio', value: 12500, stage: 'new', owner: 'Sofia Chen', createdAt: '2026-11-06' },
  { id: 'DEAL-003', company: 'Brightside Co.', contact: 'Isabella Nguyen', email: 'isabella@brightside.co', value: 8200, stage: 'new', owner: 'Marcus Reed', createdAt: '2026-11-04' },
  { id: 'DEAL-004', company: 'Atlas Group', contact: 'William Kim', email: 'william@atlas.group', value: 46000, stage: 'contacted', owner: 'Avery Morgan', createdAt: '2026-10-30' },
  { id: 'DEAL-005', company: 'Harbor Freight', contact: 'Emma Rossi', email: 'emma@harborfreight.com', value: 18900, stage: 'contacted', owner: 'Nora Patel', createdAt: '2026-10-27' },
  { id: 'DEAL-006', company: 'Cobalt Systems', contact: 'Liam Novak', email: 'liam@cobalt.systems', value: 32500, stage: 'contacted', owner: 'Sofia Chen', createdAt: '2026-10-25' },
  { id: 'DEAL-007', company: 'Quantum Works', contact: 'Mia Rossi', email: 'mia@quantum.works', value: 58000, stage: 'qualified', owner: 'Marcus Reed', createdAt: '2026-10-18' },
  { id: 'DEAL-008', company: 'Lumen Health', contact: 'Noah Bennett', email: 'noah@lumenhealth.com', value: 27000, stage: 'qualified', owner: 'Nora Patel', createdAt: '2026-10-12' },
  { id: 'DEAL-009', company: 'Pioneer Retail', contact: 'Ava Thompson', email: 'ava@pioneer.retail', value: 15400, stage: 'won', owner: 'Avery Morgan', createdAt: '2026-10-05' },
  { id: 'DEAL-010', company: 'Signal Media', contact: 'Ethan Clark', email: 'ethan@signal.media', value: 61000, stage: 'won', owner: 'Sofia Chen', createdAt: '2026-09-28' },
  { id: 'DEAL-011', company: 'Orbit Logistics', contact: 'Lucas Meyer', email: 'lucas@orbit.logistics', value: 22300, stage: 'won', owner: 'Marcus Reed', createdAt: '2026-09-15' },
  { id: 'DEAL-012', company: 'Fjord Analytics', contact: 'Chloe Dubois', email: 'chloe@fjord.analytics', value: 17750, stage: 'lost', owner: 'Nora Patel', createdAt: '2026-09-09' },
  { id: 'DEAL-013', company: 'Kestrel Energy', contact: 'Oliver Grant', email: 'oliver@kestrel.energy', value: 38000, stage: 'lost', owner: 'Avery Morgan', createdAt: '2026-09-02' },
]

export const stages: { id: DealStage; label: string }[] = [
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
]

export const listDeals = () => [...deals]
export const getDeal = (id: string) => deals.find((deal) => deal.id === id)

export const moveDeal = (id: string, stage: DealStage) => {
  deals = deals.map((deal) => deal.id === id ? { ...deal, stage } : deal)
}

export const createDeal = (deal: Omit<Deal, 'id'>) => {
  const next = Math.max(0, ...deals.map((d) => Number.parseInt(d.id.slice(5), 10) || 0)) + 1
  const created = { ...deal, id: `DEAL-${String(next).padStart(3, '0')}` }
  deals.unshift(created)
  return created
}

export const isDealStage = (value: string): value is DealStage =>
  stages.some((stage) => stage.id === value)
