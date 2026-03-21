import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in UI component:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
         return this.props.fallback;
      }
      return (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FEF2F2', color: '#991B1B', borderRadius: '8px', margin: '1rem' }}>
          <h3 style={{ margin: 0, marginBottom: '1rem', fontSize: '1.25rem' }}>Ocurrió un error inesperado al cargar esta sección.</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Por favor, intentá recargar la página o volver al inicio.</p>
          <button 
             onClick={() => window.location.href = '/'}
             style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#DC2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
             Volver al Inicio
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
