import { listEvents } from '@/lib/data/calendar'
import type { CalendarEvent } from '@/lib/data/calendar'

export interface CalendarService {
  listEvents(): CalendarEvent[]
}

export const calendarService: CalendarService = {
  listEvents,
}
