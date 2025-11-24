import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { useStore } from '../store';
import { COLORS, COMMUNITY_COLORS } from '../constants';
import { NodeData } from '../types';

export const GraphCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const { filteredGraph, activeCommunityColoring, setSelectedNode } = useStore();

  useEffect(() => {
    if (!containerRef.current) return;

    cyRef.current = cytoscape({
      container: containerRef.current,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'color': '#ffffff',
            'font-size': '12px',
            'text-valign': 'bottom',
            'text-margin-y': 5,
            'text-background-opacity': 0.7,
            'text-background-color': '#000',
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle',
            'border-color': '#fff',
            'border-width': 1,
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#52525b', // zinc-600
            'target-arrow-color': '#52525b',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.5
          }
        },
        {
          selector: ':selected',
          style: {
            'border-width': 3,
            'border-color': '#facc15', // yellow-400
            'background-color': '#facc15'
          }
        }
      ],
      layout: { name: 'grid' }, // Initial layout
      wheelSensitivity: 0.2,
    });

    cyRef.current.on('tap', 'node', (evt) => {
      const node = evt.target;
      setSelectedNode(node.id());
    });

    cyRef.current.on('tap', (evt) => {
      if (evt.target === cyRef.current) {
        setSelectedNode(null);
      }
    });

    return () => {
      if (cyRef.current) cyRef.current.destroy();
    };
  }, []);

  // Update Data & Layout
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    // Batch update
    cy.batch(() => {
      cy.elements().remove();
      
      const cyNodes = filteredGraph.nodes.map(n => ({
        group: 'nodes',
        data: n.data
      }));
      
      const cyEdges = filteredGraph.edges.map(e => ({
        group: 'edges',
        data: e.data
      }));

      cy.add([...cyNodes, ...cyEdges]);
    });

    // Run Layout (Using cose as a stand-in for fcose for reliability in this env)
    cy.layout({
      name: 'cose',
      animate: true,
      animationDuration: 800,
      refresh: 20,
      fit: true,
      padding: 30,
      randomize: false,
      componentSpacing: 100,
      nodeRepulsion: (node: any) => 400000,
      nodeOverlap: 10,
      idealEdgeLength: (edge: any) => 100,
      edgeElasticity: (edge: any) => 100,
      nestingFactor: 5,
      gravity: 80,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0
    } as any).run();

  }, [filteredGraph]);

  // Update Styling
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    cy.batch(() => {
      cy.nodes().forEach(ele => {
        const data = ele.data() as NodeData;
        
        // Size based on PageRank
        const baseSize = 20;
        const size = baseSize + ((data.pagerank || 0) * 500); // Scale up
        ele.style('width', size);
        ele.style('height', size);

        // Color
        let color = '#9ca3af'; // Default gray
        if (activeCommunityColoring && data.community !== undefined) {
          color = COMMUNITY_COLORS[data.community % COMMUNITY_COLORS.length];
        } else {
          color = COLORS[data.type] || color;
        }
        ele.style('background-color', color);
      });
    });

  }, [filteredGraph, activeCommunityColoring]);

  return (
    <div className="w-full h-full bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="text-zinc-500 text-xs font-mono">
          Nodes: {filteredGraph.nodes.length} | Edges: {filteredGraph.edges.length}
        </div>
      </div>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};