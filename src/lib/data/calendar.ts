export type CalendarEvent = {
  id: string
  title: string
  date: string
  time: string
  type: 'meeting' | 'review' | 'deadline' | 'social'
}

const events: CalendarEvent[] = [
  { id: 'EVT-001', title: 'Team standup', date: '2026-11-04', time: '09:00', type: 'meeting' },
  { id: 'EVT-002', title: 'Design review', date: '2026-11-06', time: '14:00', type: 'review' },
  { id: 'EVT-003', title: 'Q4 report deadline', date: '2026-11-18', time: '17:00', type: 'deadline' },
  { id: 'EVT-004', title: 'Team lunch', date: '2026-11-18', time: '12:30', type: 'social' },
  { id: 'EVT-005', title: 'Customer interviews', date: '2026-11-20', time: '10:00', type: 'meeting' },
  { id: 'EVT-006', title: 'Product demo', date: '2026-11-25', time: '11:00', type: 'review' },
]

export const listEvents = () => [...events]
