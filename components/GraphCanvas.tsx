

import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { useStore } from '../store';
import { COLORS, COMMUNITY_COLORS } from '../constants';
import { HistoricalNode, HistoricalEdge } from '../types';

export const GraphCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const { filteredGraph, activeCommunityColoring, setSelectedNode } = useStore();

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Cytoscape instance only once
    cyRef.current = cytoscape({
      container: containerRef.current,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'color': '#ffffff',
            'font-size': '10px',
            'text-valign': 'bottom',
            'text-margin-y': 4,
            'text-background-opacity': 0.8,
            'text-background-color': '#09090b',
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle',
            'border-width': 1,
            'border-color': '#ffffff',
            'width': 20,
            'height': 20,
            'text-wrap': 'wrap', // Allow text to wrap for longer labels
            'text-max-width': '80px', // Max width for wrapped labels
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 1.2,
            'label': 'data(label)',
            'font-size': '8px',
            'text-rotation': 'autorotate',
            'text-background-opacity': 1,
            'text-background-color': '#09090b',
            'color': '#71717a',
            'text-border-width': 1, // Add border to text for better contrast
            'text-border-color': '#09090b',
            'text-border-opacity': 0.5,
          }
        },
        {
          selector: 'edge[sign="negative"]',
          style: {
            'line-color': '#ef4444', // Red for rivalry/conflict
            'target-arrow-color': '#ef4444',
            'line-style': 'dashed'
          }
        },
        {
          selector: 'edge[sign="positive"]',
          style: {
            'line-color': '#52525b', // Zinc for normal/positive relations
            'target-arrow-color': '#52525b'
          }
        },
        {
          selector: ':selected',
          style: {
            'border-width': 3,
            'border-color': '#facc15', // Amber for selected
            'background-color': '#facc15'
          }
        }
      ],
      layout: { name: 'preset' }, // Positions are pre-calculated by Graphology's ForceAtlas2
      wheelSensitivity: 0.2,
      maxZoom: 3,
      minZoom: 0.2
    });

    // Event listeners
    cyRef.current.on('tap', 'node', (evt) => setSelectedNode(evt.target.id()));
    cyRef.current.on('tap', (evt) => {
      // If tapping on the background, deselect node
      if (evt.target === cyRef.current) setSelectedNode(null);
    });

    // Cleanup on unmount
    return () => { if (cyRef.current) cyRef.current.destroy(); };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Update graph elements when filteredGraph changes
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    cy.batch(() => {
      cy.elements().remove(); // Clear existing elements

      const cyNodes = filteredGraph.nodes.map(n => ({
        group: 'nodes',
        data: n.data,
        // Use pre-calculated x, y positions or default to (0,0)
        position: { x: n.data.x || 0, y: n.data.y || 0 }
      }));
      const cyEdges = filteredGraph.edges.map(e => ({
        group: 'edges',
        data: e.data
      }));
      cy.add([...cyNodes, ...cyEdges]);
    });
    
    // Fit to view only if there are elements and it's a relatively small graph
    if (filteredGraph.nodes.length > 0 && filteredGraph.nodes.length < 50) {
      cy.fit(undefined, 50); // Fit all elements with 50px padding
    }
  }, [filteredGraph]); // Re-run when filteredGraph object changes

  // Update node styles based on activeCommunityColoring or other metrics
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    cy.batch(() => {
      cy.nodes().forEach(ele => {
        const data = ele.data() as HistoricalNode; // Cast to HistoricalNode for type safety
        
        // Dynamic Node Size based on Degree and PageRank
        const size = Math.max(20, (data.degree || 1) * 3 + (data.pagerank || 0) * 500);
        ele.style('width', size);
        ele.style('height', size);

        // Dynamic Node Color
        let color = '#71717a'; // Default fallback color
        if (activeCommunityColoring && data.community !== undefined && data.community !== -1) {
          // Color by community if active and community is detected
          color = COMMUNITY_COLORS[data.community % COMMUNITY_COLORS.length];
        } else {
          // Otherwise, color by node type
          color = COLORS[data.type] || color;
        }
        ele.style('background-color', color);

        // Border width based on kCore (if available)
        // ele.style('border-width', (data.kCore || 0) * 2); // Re-add kCore when available
      });
    });
  }, [filteredGraph, activeCommunityColoring]); // Re-run when these dependencies change

  return (
    <div className="w-full h-full bg-zinc-950 relative">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};