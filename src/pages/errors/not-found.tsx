import { ErrorPageTemplate } from '@/components/errors/error-page'

export default function NotFoundPage() {
  return (
    <ErrorPageTemplate
      code="404"
      title="Page not found"
      description="The page you requested does not exist."
      homeHref="/dashboard"
      onRetry={() => window.location.reload()}
    />
  )
}
