import { ErrorPageTemplate } from '@/components/errors/error-page'

export default function ForbiddenPage() {
  return (
    <ErrorPageTemplate
      code="403"
      title="Access denied"
      description="You do not have permission to view this page."
      homeHref="/dashboard"
      onRetry={() => window.location.reload()}
    />
  )
}
