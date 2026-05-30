import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production, this should be logged to a telemetry service.
    // eslint-disable-next-line no-console
    console.error('Unhandled render error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section role="alert" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <h1 style={{ marginBottom: 16, fontSize: '1.75rem' }}>Something went wrong</h1>
          <p style={{ marginBottom: 24, color: '#475569' }}>
            The page could not be rendered. Please refresh the page or try again later.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              borderRadius: 999,
              padding: '12px 24px',
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Refresh page
          </button>
        </section>
      )
    }

    return this.props.children
  }
}
