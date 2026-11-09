import { useEffect } from 'react'
import { useLocation } from 'react-router'

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.querySelectorAll<HTMLElement>('[data-scroll-container]').forEach((container) => {
      container.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })
  }, [pathname])

  return null
}
