import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

function formatDate(date: Date | undefined) {
  if (!date) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function parseDate(value: string | undefined) {
  if (!value) return undefined
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

export function DatePicker({
  value,
  onChange,
  placeholder,
  id,
  required,
  disabled,
  ariaLabel,
}: {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  required?: boolean
  disabled?: boolean
  ariaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const selected = parseDate(value)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          id={id}
          variant="outline"
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            'w-full justify-start px-3 font-normal',
            !selected && 'text-muted-foreground',
          )}
        >
          <CalendarIcon data-icon="inline-start" />
          {selected ? formatDate(selected) : (placeholder ?? 'yyyy-mm-dd')}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          required={required}
          onSelect={(date: Date | undefined) => {
            onChange(formatDate(date))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
