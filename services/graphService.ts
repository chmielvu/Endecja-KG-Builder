import * as GraphologyPkg from 'graphology';
import * as LouvainPkg from 'graphology-communities-louvain';
import * as PagerankPkg from 'graphology-metrics/centrality/pagerank';
import * as BetweennessPkg from 'graphology-centrality/betweenness';
import * as ForceAtlas2Pkg from 'graphology-layout-forceatlas2';
import { KnowledgeGraph, DuplicateCandidate, HistoricalNode, HistoricalEdge } from '../types';

// Robust helper to extract default export or named export from CDN packages
const getModuleExport = (pkg: any) => {
  if (!pkg) return null;
  // If it's a function directly (unlikely for 'import *')
  if (typeof pkg === 'function') return pkg;
  // Standard ESM default export
  if (pkg.default && typeof pkg.default === 'function') return pkg.default;
  // Fallback: check for a named export that matches convention or just take the first function found
  // For Graphology main package specifically:
  if (pkg.Graph) return pkg.Graph;
  if (pkg.default && pkg.default.Graph) return pkg.default.Graph;

  // For algorithms (pagerank, etc) that might be named exports
  const keys = Object.keys(pkg);
  for (const k of keys) {
    if (k !== 'default' && typeof pkg[k] === 'function') {
      return pkg[k];
    }
  }
  return null;
};

// Specific extractors
const GraphClass = getModuleExport(GraphologyPkg) || (GraphologyPkg as any).default || GraphologyPkg;
const louvain = getModuleExport(LouvainPkg);
const pagerank = getModuleExport(PagerankPkg);
const betweennessCentrality = getModuleExport(BetweennessPkg);
const forceAtlas2 = getModuleExport(ForceAtlas2Pkg);

/**
 * Enriches a KnowledgeGraph with SOTA (State-Of-The-Art) graph algorithms,
 * including centrality (PageRank, Betweenness), Louvain community detection,
 * structural balance (based on signed edges), and ForceAtlas2 layout.
 * Includes robust error handling for individual algorithm steps to prevent app crashes.
 * 
 * @param graph The input KnowledgeGraph.
 * @param options Configuration for enrichment, including layout iterations and temporal filtering.
 *   - `iterations`: Number of iterations for ForceAtlas2 layout (default 100 for responsiveness).
 *   - `temporalFilter`: Optional object to filter edges by year range.
 *     - `start`: Start year (inclusive) for temporal filtering.
 *     - `end`: End year (inclusive) for temporal filtering.
 * @returns An enriched KnowledgeGraph with calculated metrics and layout positions.
 */
export function enrichGraphWithSOTA(
  graph: KnowledgeGraph,
  options: { iterations?: number; temporalFilter?: { start?: number; end?: number } } = {}
): KnowledgeGraph {
  // 1. Initialize Graphology instance
  let g: any;
  try {
    if (!GraphClass) throw new Error("Graphology class not found");
    g = new GraphClass({ type: 'directed', multi: false, allowSelfLoops: false });
  } catch (e) {
    console.error("Failed to initialize Graphology Graph class", e);
    // Return safety fallback
    return {
       ...graph,
       meta: { ...graph.meta, lastEnriched: Date.now() }
    };
  }
  
  // 2. Filter Edges based on Time (if temporalFilter is provided)
  const filteredEdges = graph.edges.filter(e => {
    // If no temporal filter is specified, include all edges.
    if (!options.temporalFilter?.start && !options.temporalFilter?.end) return true;
    
    const filterStart = options.temporalFilter?.start || -Infinity; // Use -Infinity for no lower bound
    const filterEnd = options.temporalFilter?.end || Infinity;    // Use +Infinity for no upper bound

    // Robustly parse year from edge's start/end string (e.g., "1926" or "1926-05-01")
    const edgeStartYear = e.data.start ? parseInt(e.data.start.substring(0, 4), 10) : NaN;
    const edgeEndYear = e.data.end ? parseInt(e.data.end.substring(0, 4), 10) : NaN;

    // If an edge has no date information, it is included if the filter range is valid.
    // This assumes undated events are timeless or relevant across all years.
    if (isNaN(edgeStartYear) && isNaN(edgeEndYear)) {
      return filterStart <= filterEnd;
    }

    // Calculate the actual temporal span of the edge for intersection checking.
    // Use the filter bounds as fallback if edge date is missing (e.g., event with only a start date).
    const actualEdgeStart = isNaN(edgeStartYear) ? filterStart : edgeStartYear;
    const actualEdgeEnd = isNaN(edgeEndYear) ? (isNaN(edgeStartYear) ? filterEnd : edgeStartYear) : edgeEndYear; // If only start, assume it's also the end for a single year event

    // Check for intersection between the edge's span and the filter's span.
    const intersects = Math.max(filterStart, actualEdgeStart) <= Math.min(filterEnd, actualEdgeEnd);
    
    return intersects;
  });

  // 3. Build Graphology Graph from filtered data
  try {
    // Add nodes first. Nodes that are sources or targets of filtered edges will be included.
    // Also include all original nodes to ensure consistency in node attributes, even if they have no filtered edges.
    graph.nodes.forEach(n => {
      if(!g.hasNode(n.data.id)) {
        g.addNode(n.data.id, { ...n.data });
      }
    });

    // Add filtered edges. Only add if both source and target nodes exist in the graph.
    filteredEdges.forEach(e => {
      if (g.hasNode(e.data.source) && g.hasNode(e.data.target) && !g.hasEdge(e.data.id)) {
         g.addDirectedEdgeWithKey(e.data.id, e.data.source, e.data.target, {
          ...e.data,
          weight: e.data.weight ?? 1,
          sign: e.data.sign ?? 'positive' // Default to 'positive' sign if not specified
        });
      }
    });
  } catch (error) {
    console.error("[GraphBuild Error] Error building graphology graph:", error);
    // Return original graph with default metrics if graph building fails.
    return { 
      ...graph, 
      nodes: graph.nodes.map(n => ({...n, data: {...n.data, pagerank: 0, betweenness: 0, degree: 0, community: -1}})),
      meta: { modularity: 0, balance: 0, lastEnriched: Date.now() }
    }; 
  }

  // Initialize metrics with default/fallback values
  let pr: Record<string, number> = {};
  let btw: Record<string, number> = {};
  let communities: Record<string, number> = {};
  let modularity = 0;
  let balanceScore = 0;
  let layoutPositions: Record<string, { x: number, y: number }> = {};


  // 4. Centrality Metrics Calculation
  if (g.order > 0) { // Only calculate if graph has nodes
    try {
      if (pagerank) {
        pr = pagerank(g); 
      } else {
         console.warn("[PageRank Warn] PageRank import not found.");
      }
    } catch (error) {
      console.warn("[PageRank Warn] PageRank calculation failed, using fallback values:", error);
      g.forEachNode((nodeId: string) => pr[nodeId] = 0); 
    }
    
    try {
      if (betweennessCentrality) {
         btw = betweennessCentrality(g);
      } else {
         console.warn("[Betweenness Warn] Betweenness import not found.");
      }
    } catch (error) {
      console.warn("[Betweenness Warn] Betweenness centrality calculation failed, using fallback values:", error);
      g.forEachNode((nodeId: string) => btw[nodeId] = 0);
    }
  }

  // 5. Weighted Louvain Community Detection
  if (g.order > 1 && g.size > 0) { // Communities need at least 2 nodes and 1 edge
    try {
      // Create undirected copy for Louvain
      const undirectedForLouvain = new GraphClass({ type: 'undirected', multi: true, allowSelfLoops: false });
      g.forEachNode((nodeId: string, attributes: any) => undirectedForLouvain.addNode(nodeId, attributes)); 
      
      g.forEachEdge((edgeId: string, attributes: any, source: string, target: string) => {
        const weight = Math.abs((attributes.weight as number) || 1);
        if (undirectedForLouvain.hasEdge(source, target)) {
          undirectedForLouvain.setEdgeAttribute(source, target, 'weight', (undirectedForLouvain.getEdgeAttribute(source, target, 'weight') as number) + weight);
        } else {
          undirectedForLouvain.addUndirectedEdge(source, target, { weight: weight });
        }
      });
      
      if (louvain) {
         communities = louvain(undirectedForLouvain, { resolution: 1.0, weighted: true, getWeight: 'weight' });
         if (louvain.modularity) {
            // @ts-ignore
            modularity = louvain.modularity(undirectedForLouvain, communities, { weighted: true, getWeight: 'weight' });
         }
      }
    } catch (error) {
      console.warn("[Louvain Warn] Community detection failed:", error);
      g.forEachNode((nodeId: string) => communities[nodeId] = -1);
    }
  } else {
    g.forEachNode((nodeId: string) => communities[nodeId] = -1);
  }

  // 6. Structural Balance Theory (SBT)
  if (g.order > 2) { 
    try {
      let balancedTriads = 0;
      let totalTriads = 0;

      g.forEachNode((nodeId: string) => {
        const neighbors = g.neighbors(nodeId) as string[];
        if (neighbors.length < 2) return; 

        for (let i = 0; i < neighbors.length; i++) {
          for (let j = i + 1; j < neighbors.length; j++) {
            const n1 = neighbors[i];
            const n2 = neighbors[j];
            
            const n1n2Connected = g.hasEdge(n1, n2) || g.hasEdge(n2, n1);
            
            if (n1n2Connected) {
              totalTriads++;
              
              const getEdgeSign = (u: string, v: string): number => {
                let currentSign: number = 1;
                if (g.hasEdge(u, v)) {
                  const signAttr = g.getEdgeAttribute(u, v, 'sign') as HistoricalEdge['sign'] | undefined;
                  if (signAttr === 'negative') currentSign = -1;
                }
                if (g.hasEdge(v, u)) { 
                  const signAttr = g.getEdgeAttribute(v, u, 'sign') as HistoricalEdge['sign'] | undefined;
                  if (signAttr === 'negative') currentSign = -1;
                }
                return currentSign;
              };

              const signNodeN1 = getEdgeSign(nodeId, n1);
              const signNodeN2 = getEdgeSign(nodeId, n2);
              const signN1N2 = getEdgeSign(n1, n2); 

              if (signNodeN1 * signNodeN2 * signN1N2 > 0) {
                balancedTriads++;
              }
            }
          }
        }
      });
      
      balanceScore = totalTriads > 0 ? (balancedTriads / totalTriads) : 1; 
    } catch (error) {
      console.warn("[Balance Warn] Structural balance calculation failed:", error);
    }
  } else {
    balanceScore = 1; 
  }

  // 7. Layout (ForceAtlas2)
  if (g.order > 0) {
    try {
      if (forceAtlas2) {
        layoutPositions = forceAtlas2(g, { 
          iterations: options.iterations ?? 100, 
          settings: {
            ...forceAtlas2.inferSettings(g), 
            gravity: 1, 
            scalingRatio: 10,
            linLogMode: true,
            strongGravityMode: true 
          }
        });
      }
    } catch (error) {
      console.warn("[Layout Warn] ForceAtlas2 layout failed:", error);
      g.forEachNode((nodeId: string) => {
        if (!layoutPositions[nodeId]) {
          layoutPositions[nodeId] = { x: Math.random() * 2000 - 1000, y: Math.random() * 2000 - 1000 };
        }
      });
    }
  }

  // 8. Reconstruct Enriched Graph
  const enrichedNodes = graph.nodes.map(node => {
    const id = node.data.id;
    if (!g.hasNode(id)) {
      return {
        ...node,
        data: {
          ...node.data,
          pagerank: 0, betweenness: 0, degree: 0, community: -1, 
          x: node.data.x ?? Math.random() * 2000 - 1000, 
          y: node.data.y ?? Math.random() * 2000 - 1000
        }
      };
    }

    return {
      ...node,
      data: {
        ...node.data,
        pagerank: pr[id] ?? 0,
        betweenness: btw[id] ?? 0,
        degree: g.degree(id), 
        community: communities[id] ?? -1, 
        x: layoutPositions[id]?.x ?? node.data.x ?? 0, 
        y: layoutPositions[id]?.y ?? node.data.y ?? 0,
      }
    };
  });

  const enrichedEdges = filteredEdges.map(edge => ({
    ...edge,
    data: { ...edge.data }
  }));

  return { 
    nodes: enrichedNodes, 
    edges: enrichedEdges, 
    meta: { 
      modularity, 
      balance: balanceScore, 
      lastEnriched: Date.now() 
    } 
  };
}

/**
 * Calculates Levenshtein distance between two strings.
 */
export function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]; 
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, 
          Math.min(matrix[i][j - 1] + 1, 
                   matrix[i - 1][j] + 1) 
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function getSimilarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  if (longer.length === 0) return 1.0; 
  return (longer.length - getLevenshteinDistance(s1, s2)) / longer.length;
}

export function detectDuplicates(graph: KnowledgeGraph, threshold: number = 0.85): DuplicateCandidate[] {
  const candidates: DuplicateCandidate[] = [];
  const nodes = graph.nodes;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const n1 = nodes[i].data as HistoricalNode;
      const n2 = nodes[j].data as HistoricalNode;
      
      if (n1.type !== n2.type) continue;

      const sim = getSimilarity(n1.label.toLowerCase(), n2.label.toLowerCase());
      if (sim >= threshold) {
        candidates.push({
          nodeA: n1,
          nodeB: n2,
          similarity: sim
        });
      }
    }
  }
  return candidates.sort((a, b) => b.similarity - a.similarity);
}