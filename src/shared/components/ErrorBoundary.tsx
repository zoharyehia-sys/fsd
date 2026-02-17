import React from 'react';
import classes from './ErrorBoundary.module.scss';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={classes.container}>
          <div className={classes.content}>
            <h1 className={classes.title}>Oops! Something went wrong</h1>
            <p className={classes.message}>We're sorry for the inconvenience.</p>
            {process.env.NODE_ENV === 'development' && (
              <details className={classes.details}>
                <summary>Error Details</summary>
                <pre className={classes.error}>{this.state.error?.toString()}</pre>
              </details>
            )}
            <button
              className={classes.button}
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
