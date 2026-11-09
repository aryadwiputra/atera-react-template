import { ErrorPageTemplate } from '@/components/errors/error-page'

export default function ComingSoonPage() {
  return (
    <ErrorPageTemplate
      code="coming soon"
      title="Page coming soon"
      description="This page is not available yet. Check back later."
      homeHref="/dashboard"
      onRetry={() => window.location.reload()}
    />
  )
}
