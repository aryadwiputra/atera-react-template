import { ErrorPageTemplate } from '@/components/errors/error-page'

export default function ServerErrorPage() {
  return (
    <ErrorPageTemplate
      code="500"
      title="Something went wrong"
      description="An unexpected error occurred. Please try again."
      homeHref="/dashboard"
      onRetry={() => window.location.reload()}
    />
  )
}
