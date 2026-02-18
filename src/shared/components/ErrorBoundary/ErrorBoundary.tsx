import React from "react";
import classes from "./ErrorBoundary.module.scss";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={classes.container}>
          <div className={classes.content}>
            <h1 className={classes.title}>
              {"\u05D0\u05D5\u05E4\u05E1! \u05DE\u05E9\u05D4\u05D5 \u05D4\u05E9\u05EA\u05D1\u05E9"}
            </h1>
            <p className={classes.message}>
              {
                "\u05DE\u05E6\u05D8\u05E2\u05E8\u05D9\u05DD, \u05D0\u05D9\u05E8\u05E2\u05D4 \u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05DC\u05EA\u05D9 \u05E6\u05E4\u05D5\u05D9\u05D4."
              }
            </p>
            {import.meta.env.DEV && (
              <details className={classes.details}>
                <summary>{"\u05E4\u05E8\u05D8\u05D9 \u05E9\u05D2\u05D9\u05D0\u05D4"}</summary>
                <pre className={classes.error}>{this.state.error?.toString()}</pre>
              </details>
            )}
            <button
              className={classes.button}
              onClick={() => window.location.reload()}
            >
              {"\u05D8\u05E2\u05DF \u05DE\u05D7\u05D3\u05E9"}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

