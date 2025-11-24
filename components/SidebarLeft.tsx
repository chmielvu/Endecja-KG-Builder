import React, { useState } from 'react';
import { useStore } from '../store';
import { Play, Download, Plus, Search, Scissors, Check, X, GitMerge } from 'lucide-react';
import { generateGraphExpansion } from '../services/geminiService';
import { detectDuplicates } from '../services/graphService';
import { DuplicateCandidate } from '../types';

export const SidebarLeft: React.FC = () => {
  const { 
    graph, 
    initGraph, 
    selectedNodeId, 
    activeCommunityColoring, 
    setCommunityColoring, 
    addNodesAndEdges,
    setThinking,
    mergeNodes,
    removeNode,
    addToast
  } = useStore();

  const [dupeCandidates, setDupeCandidates] = useState<DuplicateCandidate[]>([]);
  const [showDupeModal, setShowDupeModal] = useState(false);

  const selectedNode = selectedNodeId 
    ? graph.nodes.find(n => n.data.id === selectedNodeId)?.data 
    : null;

  const handleExpand = async () => {
    const topic = prompt("Enter a topic or entity to expand upon:");
    if (!topic) return;

    setThinking(true);
    addToast({ title: 'Expanding Graph', description: 'Consulting Gemini 3 Pro...', type: 'info' });
    
    try {
      const result = await generateGraphExpansion(graph, topic);
      addNodesAndEdges(result.newNodes, result.newEdges);
      // Toast handled in store
    } catch (e) {
      addToast({ title: 'Error', description: 'Expansion failed.', type: 'error' });
    } finally {
      setThinking(false);
    }
  };

  const handleGroomDupes = () => {
    const candidates = detectDuplicates(graph, 0.7); // 0.7 threshold for demo purposes
    if (candidates.length === 0) {
      addToast({ title: 'Clean Graph', description: 'No duplicates detected.', type: 'success' });
    } else {
      setDupeCandidates(candidates);
      setShowDupeModal(true);
    }
  };

  const handleMerge = (candidate: DuplicateCandidate) => {
    // Basic heuristic: Keep the one with higher degree or longer description
    const keepA = (candidate.nodeA.description?.length || 0) >= (candidate.nodeB.description?.length || 0);
    const keepId = keepA ? candidate.nodeA.id : candidate.nodeB.id;
    const dropId = keepA ? candidate.nodeB.id : candidate.nodeA.id;
    
    mergeNodes(keepId, dropId);
    setDupeCandidates(prev => prev.filter(c => c !== candidate));
  };

  const handleIgnore = (candidate: DuplicateCandidate) => {
    setDupeCandidates(prev => prev.filter(c => c !== candidate));
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graph, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "endecja_kg.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <>
      <div className="w-80 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col p-4 overflow-y-auto">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          Endecja KG
        </h2>

        <div className="space-y-6">
          {/* Actions */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</label>
            <button 
              onClick={initGraph}
              className="w-full flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md text-sm transition-colors"
            >
              <Play size={16} /> Run Analysis (Louvain)
            </button>
            <button 
              onClick={handleExpand}
              className="w-full flex items-center gap-2 px-3 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-200 border border-blue-800 rounded-md text-sm transition-colors"
            >
              <Search size={16} /> AI Expand Graph
            </button>
            <button 
              onClick={handleGroomDupes}
              className="w-full flex items-center gap-2 px-3 py-2 bg-amber-900/30 hover:bg-amber-900/50 text-amber-200 border border-amber-800 rounded-md text-sm transition-colors"
            >
              <Scissors size={16} /> Groom Dupes
            </button>
            <button 
              onClick={handleExport}
              className="w-full flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md text-sm transition-colors"
            >
              <Download size={16} /> Export JSON
            </button>
          </div>

          {/* View Controls */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Visualization</label>
            <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded-md">
              <span className="text-sm text-zinc-300">Community Colors</span>
              <button 
                onClick={() => setCommunityColoring(!activeCommunityColoring)}
                className={`w-10 h-5 rounded-full relative transition-colors ${activeCommunityColoring ? 'bg-emerald-600' : 'bg-zinc-600'}`}
              >
                <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${activeCommunityColoring ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

          {/* Selected Node Details */}
          {selectedNode ? (
            <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg space-y-3">
              <h3 className="text-md font-bold text-white border-b border-zinc-800 pb-2">{selectedNode.label}</h3>
              <div className="space-y-1 text-sm text-zinc-400">
                <p><span className="text-zinc-500">Type:</span> {selectedNode.type}</p>
                <p><span className="text-zinc-500">Year:</span> {selectedNode.year || 'N/A'}</p>
                <p><span className="text-zinc-500">Comm:</span> {selectedNode.community}</p>
                <p><span className="text-zinc-500">Rank:</span> {selectedNode.pagerank?.toFixed(4)}</p>
                <p><span className="text-zinc-500">Dates:</span> {selectedNode.dates}</p>
              </div>
              <p className="text-xs text-zinc-500 italic mt-2 leading-relaxed">{selectedNode.description}</p>
              <div className="pt-2 flex gap-2">
                <button 
                   onClick={() => removeNode(selectedNode.id)}
                   className="px-2 py-1 bg-red-900/50 text-red-400 text-xs rounded hover:bg-red-900"
                >
                  Delete Node
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-dashed border-zinc-800 rounded-lg text-center">
              <p className="text-xs text-zinc-600">Select a node to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Duplicate Review Modal */}
      {showDupeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Review Duplicates ({dupeCandidates.length})</h3>
              <button onClick={() => setShowDupeModal(false)} className="text-zinc-400 hover:text-white"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {dupeCandidates.length === 0 ? (
                <div className="text-center text-zinc-500 py-10">All done! No more duplicates.</div>
              ) : (
                dupeCandidates.map((cand, i) => (
                  <div key={i} className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 flex gap-4 items-center">
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-indigo-400">{cand.nodeA.label}</span>
                        <span className="text-xs text-zinc-600 font-mono">{cand.nodeA.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-bold text-amber-400">{cand.nodeB.label}</span>
                         <span className="text-xs text-zinc-600 font-mono">{cand.nodeB.id}</span>
                      </div>
                      <div className="text-xs text-zinc-500">Similarity: {(cand.similarity * 100).toFixed(1)}%</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleMerge(cand)}
                        className="p-2 bg-emerald-900/50 hover:bg-emerald-900 text-emerald-400 rounded-md flex items-center gap-1 text-xs"
                      >
                        <GitMerge size={14} /> Merge
                      </button>
                      <button 
                        onClick={() => handleIgnore(cand)}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-md text-xs"
                      >
                        Ignore
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};