
import React, { useEffect } from 'react';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { GraphCanvas } from './components/GraphCanvas';
import { Timeline } from './components/Timeline';
import { useStore } from './store';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

function App() {
  const { initGraph, toasts, removeToast } = useStore();

  useEffect(() => {
    // Start the engine
    initGraph();
  }, [initGraph]);

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-zinc-100 font-sans overflow-hidden">
      {/* Header (Minimal) */}
      <header className="h-12 border-b border-zinc-800 bg-zinc-950 flex items-center px-4 justify-between">
        <h1 className="font-mono font-bold text-zinc-100 tracking-tight">
          ENDECJA<span className="text-indigo-500">KG</span> BUILDER
        </h1>
        <div className="text-xs text-zinc-600 font-mono">
           v1.2.0 • React 19 • Gemini 3 Pro
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <SidebarLeft />
        
        <main className="flex-1 relative flex flex-col">
          <div className="flex-1 relative">
            <GraphCanvas />
          </div>
          <Timeline />
        </main>

        <SidebarRight />
      </div>

      {/* Toasts Overlay */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="w-80 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-4 pointer-events-auto flex items-start gap-3 animate-slide-up"
          >
            <div className="mt-1">
              {toast.type === 'success' && <CheckCircle size={16} className="text-emerald-500" />}
              {toast.type === 'error' && <AlertCircle size={16} className="text-red-500" />}
              {(toast.type === 'info' || !toast.type) && <Info size={16} className="text-blue-500" />}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white">{toast.title}</h4>
              <p className="text-xs text-zinc-400 mt-1">{toast.description}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="text-zinc-500 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
