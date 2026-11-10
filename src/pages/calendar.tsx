import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { listEvents } from '@/lib/data/calendar'

export default function CalendarPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const events = useMemo(() => listEvents(), [])

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const selectedEvents = events.filter((event) => isSameDay(new Date(event.date), selectedDate))

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          title={t('calendar')}
          description={t('calendarDescription')}
          actions={
            <Button size="sm">
              <Plus className="size-4" />
              {t('newEvent')}
            </Button>
          }
        />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)]">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="size-5" />
                {format(currentMonth, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="size-8" aria-label={t('prevMonth')} onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8" onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()) }}>
                  {t('today')}
                </Button>
                <Button variant="outline" size="icon" className="size-8" aria-label={t('nextMonth')} onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="py-2">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const dayEvents = events.filter((event) => isSameDay(new Date(event.date), day))
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        'flex min-h-20 flex-col gap-1 rounded-lg border p-2 text-sm transition-colors',
                        !isSameMonth(day, currentMonth) && 'opacity-40',
                        isToday(day) && 'border-primary font-semibold text-primary',
                        isSameDay(day, selectedDate) && 'bg-muted',
                      )}
                    >
                      <span>{format(day, 'd')}</span>
                      <span className="flex flex-wrap gap-0.5">
                        {dayEvents.slice(0, 2).map((event) => (
                          <span key={event.id} className="rounded bg-muted px-1 py-0.5 text-2xs font-normal text-muted-foreground">{event.title}</span>
                        ))}
                      </span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{format(selectedDate, 'EEEE, MMMM d')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedEvents.length === 0 && <p className="text-sm text-muted-foreground">{t('noEvents')}</p>}
              {selectedEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                  <Badge variant="secondary">{event.type}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </PageTransition>
  )
}
