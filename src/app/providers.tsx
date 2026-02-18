import { ErrorBoundary } from "../shared/components";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};


