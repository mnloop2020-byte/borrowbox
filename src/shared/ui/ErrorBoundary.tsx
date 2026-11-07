import { Component } from "react";
import type { ReactNode } from "react";
import { ErrorState } from "./ErrorState.tsx";

interface ErrorBoundaryProps {
  children: ReactNode;
  title: string;
  text: string;
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/** Catches descendant render errors and offers a real remount retry. */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  private retry = (): void => {
    this.props.onRetry?.();
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorState
          title={this.props.title}
          text={this.props.text}
          onRetry={this.retry}
        />
      );
    }
    return this.props.children;
  }
}
