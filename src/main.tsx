import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initializeTheme } from './hooks/use-appearance'
import { initializeCustomizePreferences } from './hooks/use-customize-preferences'
import { TooltipProvider } from '@/components/ui/tooltip'
import './index.css'
import App from './App.tsx'

initializeTheme()
initializeCustomizePreferences()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider delayDuration={0}>
      <App />
    </TooltipProvider>
  </StrictMode>,
)
