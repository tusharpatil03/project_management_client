import React, { Component, ErrorInfo, ReactNode } from 'react';

type FallbackRender = (params: { error: Error | undefined; resetError: () => void }) => ReactNode;

interface Props {
  children: ReactNode;
  /**
   * Static fallback node to render when an error occurs.
   * Either `fallback` or `fallbackRender` can be provided.
   */
  fallback?: ReactNode;
  /**
   * A render function that receives the error and a reset function.
   * Preferred when you need to render different UIs depending on the error.
   */
  fallbackRender?: FallbackRender;
  /**
   * Optional callback invoked when an error is caught (for logging)
   */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
  };

  /**
   * Reset the boundary to clear errors.
   */
  public reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // bubble up for optional handling
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (e) {
        // swallow
      }
    }
    // also log to console as a fallback
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const { fallback, fallbackRender } = this.props;
      const reset = this.reset;

      if (fallbackRender) {
        return fallbackRender({ error: this.state.error, resetError: reset });
      }

      if (fallback) {
        return fallback;
      }

      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-800 text-lg font-medium">Something went wrong</h2>
          <p className="text-red-600">{this.state.error?.message}</p>
          <div className="mt-2">
            <button
              onClick={reset}
              className="px-3 py-1 bg-red-200 text-red-800 rounded"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap a component with an ErrorBoundary.
 * Useful for wrapping large sections (routes/layouts) with a component-specific fallback.
 */
export function withErrorBoundary<P>(
  WrappedComponent: React.ComponentType<P>,
  options?: { fallback?: ReactNode; fallbackRender?: FallbackRender; onError?: (error: Error, info: ErrorInfo) => void }
) {
  const { fallback, fallbackRender, onError } = options || {};

  const Wrapper = (props: P) => (
    <ErrorBoundary fallback={fallback} fallbackRender={fallbackRender} onError={onError}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore TS cannot infer JSX spread on generic here but runtime is fine */}
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  const name = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  Wrapper.displayName = `withErrorBoundary(${name})`;
  return Wrapper;
}

export default ErrorBoundary;
