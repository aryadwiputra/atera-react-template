import { ErrorPageTemplate } from '@/components/errors/error-page'

export default function MaintenancePage() {
  return (
    <ErrorPageTemplate
      code="maintenance"
      title="Under maintenance"
      description="We are performing scheduled maintenance."
      homeHref="/dashboard"
      onRetry={() => window.location.reload()}
    />
  )
}
