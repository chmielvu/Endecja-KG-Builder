
import { KnowledgeGraph, NodeData, DuplicateCandidate } from '../types';

/**
 * Calculates Degree Centrality for all nodes.
 */
export function calculateDegreeCentrality(graph: KnowledgeGraph): Record<string, number> {
  const centrality: Record<string, number> = {};
  
  graph.nodes.forEach(node => {
    centrality[node.data.id] = 0;
  });

  graph.edges.forEach(edge => {
    if (centrality[edge.data.source] !== undefined) centrality[edge.data.source]++;
    if (centrality[edge.data.target] !== undefined) centrality[edge.data.target]++;
  });

  // Normalize
  const max = Math.max(...Object.values(centrality), 1);
  Object.keys(centrality).forEach(key => {
    centrality[key] = centrality[key] / max;
  });

  return centrality;
}

/**
 * Simulates Louvain Community Detection (Simple connected components + weight heuristic for demo).
 * In a real python env we would use python-louvain.
 */
export function detectCommunities(graph: KnowledgeGraph): Record<string, number> {
  const communities: Record<string, number> = {};
  let nextCommunityId = 0;
  const visited = new Set<string>();

  // Helper to find connected component
  const bfs = (startNodeId: string, communityId: number) => {
    const queue = [startNodeId];
    visited.add(startNodeId);
    communities[startNodeId] = communityId;

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      // Find neighbors
      const neighbors = graph.edges
        .filter(e => e.data.source === current || e.data.target === current)
        .map(e => (e.data.source === current ? e.data.target : e.data.source));
      
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          communities[neighbor] = communityId;
          queue.push(neighbor);
        }
      });
    }
  };

  graph.nodes.forEach(node => {
    if (!visited.has(node.data.id)) {
      bfs(node.data.id, nextCommunityId++);
    }
  });

  return communities;
}

/**
 * Simplified PageRank
 */
export function calculatePageRank(graph: KnowledgeGraph, iterations = 20, damping = 0.85): Record<string, number> {
  let ranks: Record<string, number> = {};
  const N = graph.nodes.length;
  if (N === 0) return {};
  
  // Init
  graph.nodes.forEach(n => ranks[n.data.id] = 1 / N);

  for (let i = 0; i < iterations; i++) {
    const newRanks: Record<string, number> = {};
    
    graph.nodes.forEach(node => {
      let incomingSum = 0;
      
      // Find edges pointing TO this node
      const incomingEdges = graph.edges.filter(e => e.data.target === node.data.id);
      
      incomingEdges.forEach(edge => {
        const sourceId = edge.data.source;
        // Find degree of source
        const outDegree = graph.edges.filter(e => e.data.source === sourceId).length;
        if (outDegree > 0) {
          incomingSum += ranks[sourceId] / outDegree;
        }
      });

      newRanks[node.data.id] = (1 - damping) / N + damping * incomingSum;
    });
    
    ranks = newRanks;
  }

  return ranks;
}

export function enrichGraphWithMetrics(graph: KnowledgeGraph): KnowledgeGraph {
  const dc = calculateDegreeCentrality(graph);
  const pr = calculatePageRank(graph);
  const comm = detectCommunities(graph);

  const newNodes = graph.nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      degreeCentrality: dc[node.data.id],
      pagerank: pr[node.data.id],
      community: comm[node.data.id],
      kCore: Math.floor((dc[node.data.id] || 0) * 10) // Pseudo k-core based on degree for viz
    }
  }));

  return {
    ...graph,
    nodes: newNodes
  };
}

/**
 * Calculates Levenshtein distance between two strings.
 */
export function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Calculates similarity score (0 to 1).
 */
export function getSimilarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  if (longer.length === 0) {
    return 1.0;
  }
  return (longer.length - getLevenshteinDistance(s1, s2)) / longer.length;
}

/**
 * Detects potential duplicates in the graph based on label similarity.
 */
export function detectDuplicates(graph: KnowledgeGraph, threshold: number = 0.85): DuplicateCandidate[] {
  const candidates: DuplicateCandidate[] = [];
  const nodes = graph.nodes;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const n1 = nodes[i].data;
      const n2 = nodes[j].data;
      
      // Skip if completely different types, unless similarity is extremely high
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
