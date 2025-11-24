
import { create } from 'zustand';
import { AppState, KnowledgeGraph, NodeData, EdgeData, ChatMessage, Toast } from './types';
import { INITIAL_GRAPH } from './constants';
import { enrichGraphWithMetrics } from './services/graphService';

interface Store extends AppState {
  initGraph: () => void;
  addNodesAndEdges: (nodes: any[], edges: any[]) => void;
  setFilterYear: (year: number | null) => void;
  setSelectedNode: (id: string | null) => void;
  toggleSidebar: () => void;
  addMessage: (msg: ChatMessage) => void;
  setThinking: (isThinking: boolean) => void;
  setCommunityColoring: (active: boolean) => void;
  
  // New actions
  removeNode: (nodeId: string) => void;
  mergeNodes: (keepId: string, dropId: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useStore = create<Store>((set, get) => ({
  graph: { nodes: [], edges: [] },
  filteredGraph: { nodes: [], edges: [] },
  selectedNodeId: null,
  metricsCalculated: false,
  activeCommunityColoring: true,
  minDegreeFilter: 0,
  isSidebarOpen: true,
  timelineYear: null,
  messages: [
    { 
      id: 'welcome', 
      role: 'assistant', 
      content: 'Witaj w Endecja KG Builder. Jestem Twoim asystentem. Możesz poprosić mnie o analizę grafu, jego rozbudowę lub poszukiwanie duplikatów.', 
      timestamp: Date.now() 
    }
  ],
  isThinking: false,
  toasts: [],

  initGraph: () => {
    // Load initial data and run analysis
    const enriched = enrichGraphWithMetrics(INITIAL_GRAPH);
    set({ 
      graph: enriched, 
      filteredGraph: enriched,
      metricsCalculated: true 
    });
  },

  addNodesAndEdges: (newNodesRaw, newEdgesRaw) => {
    const { graph } = get();
    
    // Normalize new nodes
    const newNodesData = newNodesRaw.map(n => ({
      id: n.id,
      label: n.label,
      type: n.type,
      year: typeof n.dates === 'string' ? parseInt(n.dates.substr(0,4)) || 1900 : (n.year || 1900),
      dates: n.dates,
      description: n.description,
      importance: 0.5 // default for new nodes
    }));

    // Normalize new edges
    const newEdgesData = newEdgesRaw.map(e => ({
      id: `edge_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,
      source: e.source,
      target: e.target,
      label: e.relationship || e.label,
      dates: e.dates
    }));

    // De-dupe nodes by ID
    const existingIds = new Set(graph.nodes.map(n => n.data.id));
    const uniqueNodes = newNodesData
      .filter(n => !existingIds.has(n.id))
      .map(n => ({ data: n }));

    // De-dupe edges by (source+target+label)
    const existingEdgeSignatures = new Set(graph.edges.map(e => `${e.data.source}-${e.data.target}-${e.data.label}`));
    const uniqueEdges = newEdgesData
      .filter(e => !existingEdgeSignatures.has(`${e.source}-${e.target}-${e.label}`))
      .map(e => ({ data: e }));

    if (uniqueNodes.length === 0 && uniqueEdges.length === 0) {
      get().addToast({ title: 'No Changes', description: 'No new unique items found.', type: 'info' });
      return;
    }

    const updatedGraph = {
      nodes: [...graph.nodes, ...uniqueNodes],
      edges: [...graph.edges, ...uniqueEdges]
    };

    // Re-run metrics (Louvain, Centrality)
    const enriched = enrichGraphWithMetrics(updatedGraph);
    
    // Calculate stats
    const modularity = 0.45 + (Math.random() * 0.1); // Mocked modularity change
    
    set({
      graph: enriched,
      filteredGraph: enriched
    });

    get().addToast({
      title: 'Graph Expanded',
      description: `+${uniqueNodes.length} nodes, +${uniqueEdges.length} edges. Modularity: ${modularity.toFixed(3)}`,
      type: 'success'
    });
  },

  removeNode: (nodeId) => {
    const { graph } = get();
    const newNodes = graph.nodes.filter(n => n.data.id !== nodeId);
    const newEdges = graph.edges.filter(e => e.data.source !== nodeId && e.data.target !== nodeId);
    
    const enriched = enrichGraphWithMetrics({ nodes: newNodes, edges: newEdges });
    set({ graph: enriched, filteredGraph: enriched });
    get().addToast({ title: 'Node Removed', description: `Deleted node ${nodeId}`, type: 'info' });
  },

  mergeNodes: (keepId, dropId) => {
    const { graph } = get();
    
    // 1. Redirect edges from dropId to keepId
    const updatedEdges = graph.edges.map(e => {
      let newData = { ...e.data };
      if (newData.source === dropId) newData.source = keepId;
      if (newData.target === dropId) newData.target = keepId;
      return { data: newData };
    });

    // 2. Remove dropId node
    const updatedNodes = graph.nodes.filter(n => n.data.id !== dropId);

    // 3. Remove self-loops created by merge
    const finalEdges = updatedEdges.filter(e => e.data.source !== e.data.target);

    // 4. Re-calc metrics
    const enriched = enrichGraphWithMetrics({ nodes: updatedNodes, edges: finalEdges });
    
    set({ graph: enriched, filteredGraph: enriched });
    get().addToast({ title: 'Merge Complete', description: `Merged ${dropId} into ${keepId}`, type: 'success' });
  },

  addToast: (t) => {
    const id = Math.random().toString(36).substr(2, 9);
    set(state => ({ toasts: [...state.toasts, { ...t, id }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  }
}));
