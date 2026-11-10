import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

export function TaglineReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, margin: '-96px' })
  const reduceMotion = useReducedMotion()
  const words = text.split(' ')

  return (
    <p ref={ref} className={cn('text-balance', className)}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          initial={{ opacity: 0.25 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, ease: EASE, delay: reduceMotion ? 0 : index * 0.08 }}
        >
          {word}
          {index < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </p>
  )
}
