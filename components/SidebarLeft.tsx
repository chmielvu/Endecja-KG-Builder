import React, { useState } from 'react';
import { useStore } from '../store';
import { Play, Download, Plus, Search, Scissors, Check, X, GitMerge, AlertCircle, Info } from 'lucide-react';
import { generateGraphExpansion } from '../services/geminiService';
import { detectDuplicates } from '../services/graphService';
import { DuplicateCandidate, HistoricalNode } from '../types';

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
  
  // Expand Modal State
  const [showExpandModal, setShowExpandModal] = useState(false);
  const [expandTopic, setExpandTopic] = useState('');

  // Find the selected node's data
  const selectedNode = selectedNodeId 
    ? graph.nodes.find(n => n.data.id === selectedNodeId)?.data 
    : null;

  /**
   * Opens the expansion modal.
   */
  const openExpandModal = () => {
    setExpandTopic('');
    setShowExpandModal(true);
  };

  /**
   * Confirms expansion with the user input topic.
   */
  const handleConfirmExpand = async () => {
    if (!expandTopic.trim()) return;
    setShowExpandModal(false);

    setThinking(true);
    addToast({ title: 'Rozwijanie Grafu', description: `Konsultuję Gemini 3 Pro dla tematu: "${expandTopic}"...`, type: 'info' });
    
    try {
      const result = await generateGraphExpansion(graph, expandTopic);
      addNodesAndEdges(result.newNodes, result.newEdges);
      // Toast on success is handled in store.ts after addNodesAndEdges
    } catch (e: any) {
      addToast({ 
        title: 'Błąd Rozszerzenia', 
        description: `Rozwinięcie grafu nie powiodło się: ${e.message}`, 
        type: 'error' 
      });
    } finally {
      setThinking(false);
    }
  };

  /**
   * Handles the duplicate grooming functionality.
   * Detects duplicate nodes and displays them in a modal for user review.
   */
  const handleGroomDupes = () => {
    const candidates = detectDuplicates(graph, 0.85); // Increased threshold for more precise matches
    if (candidates.length === 0) {
      addToast({ title: 'Czysty Graf', description: 'Nie wykryto żadnych duplikatów.', type: 'success' });
    } else {
      setDupeCandidates(candidates);
      setShowDupeModal(true);
      addToast({ title: 'Wykryto Duplikaty', description: `Znaleziono ${candidates.length} potencjalnych duplikatów.`, type: 'warning' });
    }
  };

  /**
   * Merges two duplicate nodes. The node with more detailed info (or first by default) is kept.
   * @param candidate The duplicate candidate pair.
   */
  const handleMerge = (candidate: DuplicateCandidate) => {
    // Heuristic: Keep the node with more content in its description, or nodeA if descriptions are similar.
    const keepA = (candidate.nodeA.description?.length || 0) >= (candidate.nodeB.description?.length || 0);
    const keepId = keepA ? candidate.nodeA.id : candidate.nodeB.id;
    const dropId = keepA ? candidate.nodeB.id : candidate.nodeA.id;
    
    mergeNodes(keepId, dropId);
    setDupeCandidates(prev => prev.filter(c => c !== candidate)); // Remove from current list
    if (dupeCandidates.length === 1) setShowDupeModal(false); // Close if no more dupes
  };

  /**
   * Ignores a duplicate candidate, removing it from the review list.
   * @param candidate The duplicate candidate to ignore.
   */
  const handleIgnore = (candidate: DuplicateCandidate) => {
    setDupeCandidates(prev => prev.filter(c => c !== candidate));
    if (dupeCandidates.length === 1) setShowDupeModal(false); // Close if no more dupes
  };

  /**
   * Exports the current graph data as a JSON file.
   */
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graph, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "endecja_kg.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    addToast({ title: 'Graf Wyeksportowany', description: 'Pomyślnie wyeksportowano graf do pliku JSON.', type: 'success' });
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
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Akcje</label>
            <button 
              onClick={initGraph}
              className="w-full flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md text-sm transition-colors"
            >
              <Play size={16} /> Uruchom Analizę
            </button>
            <button 
              onClick={openExpandModal}
              className="w-full flex items-center gap-2 px-3 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-200 border border-blue-800 rounded-md text-sm transition-colors"
            >
              <Search size={16} /> AI Rozwiń Graf
            </button>
            <button 
              onClick={handleGroomDupes}
              className="w-full flex items-center gap-2 px-3 py-2 bg-amber-900/30 hover:bg-amber-900/50 text-amber-200 border border-amber-800 rounded-md text-sm transition-colors"
            >
              <Scissors size={16} /> Uporządkuj Duplikaty
            </button>
            <button 
              onClick={handleExport}
              className="w-full flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md text-sm transition-colors"
            >
              <Download size={16} /> Eksportuj JSON
            </button>
          </div>

          {/* View Controls */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Wizualizacja</label>
            <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded-md">
              <span className="text-sm text-zinc-300">Kolory Społeczności</span>
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
                <p><span className="text-zinc-500">Typ:</span> {selectedNode.type}</p>
                {selectedNode.start && <p><span className="text-zinc-500">Początek:</span> {selectedNode.start}</p>}
                {selectedNode.end && <p><span className="text-zinc-500">Koniec:</span> {selectedNode.end}</p>}
                <p><span className="text-zinc-500">Społeczność:</span> {selectedNode.community !== undefined && selectedNode.community !== -1 ? selectedNode.community : 'N/A'}</p>
                <p><span className="text-zinc-500">PageRank:</span> {selectedNode.pagerank?.toFixed(4) || 'N/A'}</p>
                <p><span className="text-zinc-500">Betweenness:</span> {selectedNode.betweenness?.toFixed(4) || 'N/A'}</p>
                <p><span className="text-zinc-500">Stopień:</span> {selectedNode.degree || 'N/A'}</p>
              </div>
              <p className="text-xs text-zinc-500 italic mt-2 leading-relaxed">{selectedNode.description || 'Brak opisu.'}</p>
              <div className="pt-2 flex gap-2">
                <button 
                   onClick={() => removeNode(selectedNode.id)}
                   className="px-2 py-1 bg-red-900/50 text-red-400 text-xs rounded hover:bg-red-900"
                >
                  Usuń Węzeł
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-dashed border-zinc-800 rounded-lg text-center">
              <p className="text-xs text-zinc-600">Wybierz węzeł, aby wyświetlić szczegóły</p>
            </div>
          )}
        </div>
      </div>

      {/* Expand Modal */}
      {showExpandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Search size={20} className="text-blue-400" />
              Rozszerz Graf (AI)
            </h3>
            <p className="text-sm text-zinc-400">
              Wpisz temat, osobę lub wydarzenie. Gemini przeanalizuje bazę wiedzy i wyszuka nowe połączenia.
            </p>
            <input 
              type="text" 
              value={expandTopic}
              onChange={(e) => setExpandTopic(e.target.value)}
              placeholder="np. 'Romuald Perczyński i Oboz Narodowo-Radykalny'"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmExpand()}
            />
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowExpandModal(false)}
                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors text-sm"
              >
                Anuluj
              </button>
              <button 
                onClick={handleConfirmExpand}
                disabled={!expandTopic.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rozszerz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Review Modal */}
      {showDupeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Przejrzyj Duplikaty ({dupeCandidates.length})</h3>
              <button onClick={() => setShowDupeModal(false)} className="text-zinc-400 hover:text-white"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {dupeCandidates.length === 0 ? (
                <div className="text-center text-zinc-500 py-10 flex flex-col items-center">
                    <Info size={24} className="mb-2"/>
                    Wszystko gotowe! Brak dalszych duplikatów do przeglądania.
                </div>
              ) : (
                dupeCandidates.map((cand, i) => (
                  <div key={i} className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 flex gap-4 items-center">
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-indigo-400">{cand.nodeA.label}</span>
                        <span className="text-xs text-zinc-600 font-mono">{cand.nodeA.id}</span>
                      </div>
                      <p className="text-xs text-zinc-500 italic mt-1">{cand.nodeA.description?.substring(0, 100)}...</p> {/* Preview desc */}
                      <div className="w-full h-px bg-zinc-800 my-2"></div> {/* Separator */}
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-bold text-amber-400">{cand.nodeB.label}</span>
                         <span className="text-xs text-zinc-600 font-mono">{cand.nodeB.id}</span>
                      </div>
                      <p className="text-xs text-zinc-500 italic mt-1">{cand.nodeB.description?.substring(0, 100)}...</p> {/* Preview desc */}
                      <div className="text-xs text-zinc-500">Podobieństwo: <span className="text-white font-mono">{(cand.similarity * 100).toFixed(1)}%</span></div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleMerge(cand)}
                        className="p-2 bg-emerald-900/50 hover:bg-emerald-900 text-emerald-400 rounded-md flex items-center gap-1 text-xs"
                      >
                        <GitMerge size={14} /> Połącz
                      </button>
                      <button 
                        onClick={() => handleIgnore(cand)}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-md text-xs"
                      >
                        <X size={14}/> Ignoruj
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