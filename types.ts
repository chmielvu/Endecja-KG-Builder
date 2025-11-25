
export type HistoricalNodeType = 'person' | 'org' | 'faction' | 'event' | 'belief' | 'source' | 'role' | 'time';

export interface HistoricalNode {
  id: string;
  label: string;
  type: HistoricalNodeType;
  start?: string;  // ISO string or YYYY
  end?: string;
  description: string;
  sources: string[];  // [Author, "Title" (Year)]
  certainty: 'confirmed' | 'disputed' | 'alleged';
  image?: string;  // base64 SVG or url
  
  // Metrics calculated runtime
  degree?: number;
  pagerank?: number;
  betweenness?: number;
  community?: number;
  kCore?: number;
  modularity?: number; // Added for consistency
  balance?: number; // Added for consistency
  
  // Layout
  x?: number;
  y?: number;
}

export interface HistoricalEdge {
  id: string;
  source: string;
  target: string;
  label: string;  // relationship label for display
  type: string;   // normalized type e.g., "founded", "rival_of"
  start?: string;
  end?: string;
  weight: number;  // 0.1–1.0
  sign: 'positive' | 'negative';  // For structural balance
  sources: string[];
  certainty: 'confirmed' | 'disputed' | 'alleged';
  notes?: string;
}

export interface GraphNode {
  data: HistoricalNode;
  position?: { x: number; y: number };
}

export interface GraphEdge {
  data: HistoricalEdge;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  meta?: { 
    modularity?: number; 
    balance?: number; 
    lastEnriched?: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning?: string; // For ReAct display, e.g., "Thought: ..., Action: ..., Observation: ..."
  timestamp: number;
  sources?: Array<{ title: string; uri: string }>;
}

export interface Toast {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface DuplicateCandidate {
  nodeA: HistoricalNode;
  nodeB: HistoricalNode;
  similarity: number;
}

export interface AppState {
  // Graph State
  graph: KnowledgeGraph;
  filteredGraph: KnowledgeGraph;
  selectedNodeId: string | null;
  
  // Analysis State
  metricsCalculated: boolean;
  activeCommunityColoring: boolean;
  minDegreeFilter: number;
  
  // UI State
  isSidebarOpen: boolean;
  timelineYear: number | null; // Null means all time
  
  // Chat State
  messages: ChatMessage[];
  isThinking: boolean;

  // Notifications
  toasts: Toast[];
}