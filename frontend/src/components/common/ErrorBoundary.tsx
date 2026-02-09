import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-surface">
          <div className="card-elevated p-8 text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-md-error-container flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-md-error" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <h2 className="text-headline-sm text-on-surface mb-2">Ein Fehler ist aufgetreten</h2>
            <p className="text-body-md text-on-surface-variant mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-filled"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
