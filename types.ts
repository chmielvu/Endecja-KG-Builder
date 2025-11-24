
export type NodeType = 'person' | 'organization' | 'event' | 'concept' | 'publication' | 'Person' | 'Organization' | 'Event' | 'Concept' | 'Publication';

export interface NodeData {
  id: string;
  label: string;
  type: NodeType;
  year?: number; // Approximate year of relevance
  description?: string;
  dates?: string;
  importance?: number;
  // Metrics
  degreeCentrality?: number;
  pagerank?: number;
  community?: number; // Louvain community ID
  kCore?: number;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  label: string; // relationship
  dates?: string;
  weight?: number;
}

export interface GraphNode {
  data: NodeData;
  position?: { x: number; y: number };
}

export interface GraphEdge {
  data: EdgeData;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning?: string; // For ReAct display
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
  nodeA: NodeData;
  nodeB: NodeData;
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
