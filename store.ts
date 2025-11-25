

import { create } from 'zustand';
import { AppState, KnowledgeGraph, HistoricalNode, HistoricalEdge, ChatMessage, Toast, HistoricalNodeType } from './types';
import { INITIAL_GRAPH } from './constants';
import { enrichGraphWithSOTA } from './services/graphService';

interface Store extends AppState {
  initGraph: () => void;
  addNodesAndEdges: (nodes: any[], edges: any[]) => void;
  setFilterYear: (year: number | null) => void;
  setSelectedNode: (id: string | null) => void;
  toggleSidebar: () => void;
  addMessage: (msg: ChatMessage) => void;
  setThinking: (isThinking: boolean) => void;
  setCommunityColoring: (active: boolean) => void;
  
  removeNode: (nodeId: string) => void;
  mergeNodes: (keepId: string, dropId: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useStore = create<Store>((set, get) => ({
  graph: { nodes: [], edges: [], meta: {} },
  filteredGraph: { nodes: [], edges: [], meta: {} },
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
      content: 'Witaj w Endecja KG Builder (v2.0 SOTA). Analizuję spójność strukturalną i modularność historyczną. Jak mogę pomóc?', 
      timestamp: Date.now() 
    }
  ],
  isThinking: false,
  toasts: [],

  initGraph: () => {
    try {
      // Ensure that initial graph data is correctly typed before enrichment
      const typedInitialGraph: KnowledgeGraph = {
        nodes: INITIAL_GRAPH.nodes.map(n => ({
          data: {
            ...n.data,
            type: n.data.type as HistoricalNodeType, // Explicitly cast
            certainty: n.data.certainty || 'confirmed',
            sources: n.data.sources || [],
            description: n.data.description || ''
          }
        })),
        edges: INITIAL_GRAPH.edges.map(e => ({
          data: {
            ...e.data,
            certainty: e.data.certainty || 'confirmed',
            sources: e.data.sources || [],
            weight: e.data.weight || 1.0,
            sign: e.data.sign || 'positive',
            label: e.data.label || e.data.type || 'rel' // Ensure label is present
          }
        }))
      };
      
      const enriched = enrichGraphWithSOTA(typedInitialGraph);
      set({ 
        graph: enriched, 
        filteredGraph: enriched,
        metricsCalculated: true 
      });
      get().addToast({ 
        title: 'Graph Loaded', 
        description: `Wierzchołki: ${enriched.nodes.length}, Krawędzie: ${enriched.edges.length}, Modularity: ${enriched.meta?.modularity?.toFixed(2)}`, 
        type: 'success' 
      });
    } catch (e: any) {
      console.error("Graph initialization error:", e);
      get().addToast({ title: 'Initialization Error', description: `Failed to calculate graph metrics: ${e.message}`, type: 'error' });
    }
  },

  addNodesAndEdges: (newNodesRaw, newEdgesRaw) => {
    const { graph } = get();
    
    // Normalize new nodes to HistoricalNode schema
    const newNodesData = newNodesRaw.map((n: any) => ({
      id: n.id,
      label: n.label,
      type: n.type as HistoricalNodeType,
      start: n.start || n.dates?.split('-')[0] || undefined,
      end: n.end || n.dates?.split('-')[1] || undefined,
      description: n.description || '',
      sources: n.sources || [],
      certainty: n.certainty || 'confirmed',
    }));

    // Normalize new edges
    const newEdgesData = newEdgesRaw.map((e: any) => ({
      id: `edge_${e.source}_${e.target}_${Date.now()}_${Math.random().toString(36).substr(2,9)}`, // More robust unique ID
      source: e.source,
      target: e.target,
      label: e.label || e.relationship || e.type || 'rel',
      type: e.type || e.relationship || 'rel',
      start: e.start || e.dates?.split('-')[0] || undefined,
      end: e.end || e.dates?.split('-')[1] || undefined,
      weight: e.weight || 1.0,
      sign: e.sign || 'positive',
      certainty: e.certainty || 'confirmed',
      sources: e.sources || []
    }));

    // De-dupe nodes by ID
    const existingNodeIds = new Set(graph.nodes.map(n => n.data.id));
    const uniqueNodes = newNodesData
      .filter(n => !existingNodeIds.has(n.id))
      .map(n => ({ data: n as HistoricalNode }));

    // De-dupe edges by (source, target, label) for simplicity or unique ID
    const existingEdgeSignatures = new Set(graph.edges.map(e => `${e.data.source}-${e.data.target}-${e.data.label}`));
    const uniqueEdges = newEdgesData
      .filter(e => !existingEdgeSignatures.has(`${e.source}-${e.target}-${e.label}`))
      .map(e => ({ data: e as HistoricalEdge }));

    if (uniqueNodes.length === 0 && uniqueEdges.length === 0) {
      get().addToast({ title: 'No Changes', description: 'No new unique items found to add to the graph.', type: 'info' });
      return;
    }

    const updatedGraph = {
      nodes: [...graph.nodes, ...uniqueNodes],
      edges: [...graph.edges, ...uniqueEdges]
    };

    try {
      const enriched = enrichGraphWithSOTA(updatedGraph);
      set({ graph: enriched, filteredGraph: enriched });
      get().addToast({
        title: 'Graph Expanded',
        description: `Dodano ${uniqueNodes.length} węzłów i ${uniqueEdges.length} krawędzi. Modularity: ${enriched.meta?.modularity?.toFixed(2)}`,
        type: 'success'
      });
    } catch (e: any) {
      console.error("Graph expansion enrichment error:", e);
      get().addToast({ title: 'Calculation Error', description: `Failed to enrich expanded graph: ${e.message}`, type: 'error' });
    }
  },

  removeNode: (nodeId) => {
    const { graph } = get();
    const newNodes = graph.nodes.filter(n => n.data.id !== nodeId);
    const newEdges = graph.edges.filter(e => e.data.source !== nodeId && e.data.target !== nodeId);
    
    try {
      const enriched = enrichGraphWithSOTA({ nodes: newNodes, edges: newEdges });
      set({ graph: enriched, filteredGraph: enriched, selectedNodeId: null });
      get().addToast({ title: 'Node Removed', description: `Usunięto węzeł ${nodeId}`, type: 'info' });
    } catch (e: any) {
      console.error("Node removal enrichment error:", e);
      get().addToast({ title: 'Calculation Error', description: `Failed to re-enrich graph after node removal: ${e.message}`, type: 'error' });
    }
  },

  mergeNodes: (keepId, dropId) => {
    const { graph } = get();
    const updatedEdges = graph.edges.map(e => {
      let newData = { ...e.data };
      if (newData.source === dropId) newData.source = keepId;
      if (newData.target === dropId) newData.target = keepId;
      return { data: newData };
    });
    const updatedNodes = graph.nodes.filter(n => n.data.id !== dropId);
    // Remove self-loop edges that might have been created by merging
    const finalEdges = updatedEdges.filter(e => e.data.source !== e.data.target);

    try {
      const enriched = enrichGraphWithSOTA({ nodes: updatedNodes, edges: finalEdges });
      set({ graph: enriched, filteredGraph: enriched, selectedNodeId: keepId }); // Select the kept node
      get().addToast({ title: 'Merge Complete', description: `Połączono ${dropId} w ${keepId}`, type: 'success' });
    } catch (e: any) {
      console.error("Node merge enrichment error:", e);
      get().addToast({ title: 'Calculation Error', description: `Failed to re-enrich graph after node merge: ${e.message}`, type: 'error' });
    }
  },

  setFilterYear: (year) => {
    const { graph } = get();
    const temporalFilter = year ? { start: year, end: year } : undefined;
    
    try {
      // Re-enrich with the temporal filter applied
      const enriched = enrichGraphWithSOTA(graph, { temporalFilter });
      set({ filteredGraph: enriched, timelineYear: year });
      get().addToast({ title: 'Temporal Filter', description: year ? `Pokaż dane z roku ${year}` : 'Pokaż wszystkie dane', type: 'info' });
    } catch (e: any) {
      console.error("Temporal filter enrichment error:", e);
      get().addToast({ title: 'Calculation Error', description: `Failed to apply temporal filter: ${e.message}`, type: 'error' });
    }
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),
  toggleSidebar: () => set(s => ({ isSidebarOpen: !s.isSidebarOpen })),
  addMessage: (msg) => set(s => ({ messages: [...s.messages, msg] })),
  setThinking: (thinking) => set({ isThinking: thinking }),
  setCommunityColoring: (active) => set({ activeCommunityColoring: active }),
  addToast: (t) => {
    const id = Math.random().toString(36).substr(2, 9);
    set(s => ({ toasts: [...s.toasts, { ...t, id }] }));
    setTimeout(() => get().removeToast(id), 4000); // Toasts disappear after 4 seconds
  },
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
}));