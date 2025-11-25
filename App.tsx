import React, { useEffect, ErrorInfo } from 'react';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { GraphCanvas } from './components/GraphCanvas';
import { Timeline } from './components/Timeline';
import { useStore } from './store';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-white">
          <div className="text-center p-8 border border-red-900 bg-red-950/20 rounded-xl max-w-md mx-auto">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Application Crashed</h2>
            <p className="text-zinc-400 mb-6">Something went wrong with the graph engine.</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 font-medium transition-colors">
              Reload Workspace
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const { initGraph, toasts, removeToast } = useStore();

  useEffect(() => { initGraph(); }, [initGraph]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen w-screen bg-black text-zinc-100 font-sans overflow-hidden">
        <header className="h-12 border-b border-zinc-800 bg-zinc-950 flex items-center px-4 justify-between shrink-0">
          <h1 className="font-mono font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            ENDECJA<span className="text-indigo-500">KG</span> <span className="text-[10px] bg-zinc-800 px-1 rounded text-zinc-500">SOTA</span>
          </h1>
          <div className="text-xs text-zinc-600 font-mono hidden md:block">
             v2.0 • Graphology • Structural Balance
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <SidebarLeft />
          <main className="flex-1 relative flex flex-col min-w-0">
            <div className="flex-1 relative">
              <GraphCanvas />
            </div>
            <Timeline />
          </main>
          <SidebarRight />
        </div>

        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="w-80 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-4 pointer-events-auto flex items-start gap-3 animate-slide-up">
              <div className="mt-1">
                {toast.type === 'success' && <CheckCircle size={16} className="text-emerald-500" />}
                {toast.type === 'error' && <AlertCircle size={16} className="text-red-500" />}
                {(toast.type === 'info' || !toast.type) && <Info size={16} className="text-blue-500" />}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">{toast.title}</h4>
                <p className="text-xs text-zinc-400 mt-1">{toast.description}</p>
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-zinc-500 hover:text-white"><X size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;