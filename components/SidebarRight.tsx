
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { chatWithAgent } from '../services/geminiService';
import { Send, Cpu, Link as LinkIcon, ChevronDown, ChevronRight, MessageSquareText, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';

export const SidebarRight: React.FC = () => {
  const { messages, addMessage, isThinking, setThinking, graph } = useStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat on new messages or thinking state changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isThinking]);

  /**
   * Handles sending a user message to the AI agent.
   * Adds the user message to history, calls the AI service, and adds the agent's response.
   * Manages thinking state and error messages.
   */
  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now() };
    addMessage(userMsg);
    setInput(''); // Clear input field
    setThinking(true); // Activate thinking indicator

    try {
      const response = await chatWithAgent(messages, input, graph);
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        reasoning: response.reasoning, // ReAct steps
        sources: response.sources,
        timestamp: Date.now()
      });
    } catch (e) {
      console.error("Error communicating with Agent:", e);
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'system', // Use 'system' role for internal errors
        content: `Błąd komunikacji z Agentem: ${(e as Error).message || 'Nieznany błąd.'}`,
        timestamp: Date.now()
      });
    } finally {
      setThinking(false); // Deactivate thinking indicator
    }
  };

  return (
    <div className="w-96 h-full bg-zinc-900 border-l border-zinc-800 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
        <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
          <Cpu size={16} /> Agent Grafu
        </h2>
        <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">Gemini 3 Pro</span>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} msg={msg} />
        ))}
        {isThinking && (
          <div className="flex gap-2 items-start animate-pulse opacity-70">
            <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center">
               <Cpu size={14} className="text-indigo-400" />
            </div>
            <div className="bg-zinc-800 rounded-lg p-3 text-xs text-zinc-400">
              Analizuję (ReAct)...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>

      {/* Chat Input Area */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Zapytaj o połączenia, wydarzenia..."
            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            disabled={isThinking}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isThinking} // Disable if input is empty or thinking
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Renders a single chat message, handling user/assistant roles, reasoning, and sources.
 * @param props.msg The chat message object.
 */
const ChatMessageItem: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
  const [showReasoning, setShowReasoning] = useState(false);
  const isUser = msg.role === 'user';
  const isSystem = msg.role === 'system';

  if (isSystem) {
    return (
      <div className="flex gap-3 items-start text-red-400 text-xs bg-red-900/20 p-2 rounded-md border border-red-800">
        <AlertCircle size={14}/>
        <span>{msg.content}</span>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isUser ? 'bg-zinc-700' : 'bg-indigo-900/50'}`}>
        {isUser ? <MessageSquareText size={14} className="text-zinc-300"/> : <Cpu size={14} className="text-indigo-400" />}
      </div>
      
      <div className={`max-w-[85%] space-y-2`}>
        {/* Message Content */}
        <div className={`p-3 rounded-lg text-sm ${isUser ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-800/50 text-zinc-200 border border-zinc-700'}`}>
          {msg.content}
        </div>

        {/* ReAct Reasoning Dropdown */}
        {!isUser && msg.reasoning && (
           <div className="border border-zinc-800 rounded bg-zinc-900/50 overflow-hidden">
             <button 
               onClick={() => setShowReasoning(!showReasoning)}
               className="w-full flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 transition-colors text-xs text-zinc-500"
             >
               {showReasoning ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
               Proces Myślowy Agenta
             </button>
             {showReasoning && (
               <div className="p-3 text-xs text-zinc-400 font-mono bg-zinc-950/30 whitespace-pre-wrap border-t border-zinc-800">
                 {msg.reasoning}
               </div>
             )}
           </div>
        )}

        {/* Sources */}
        {!isUser && msg.sources && msg.sources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {msg.sources.map((s: any, i: number) => (
              <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-blue-400 transition-colors">
                <LinkIcon size={8} /> {s.title.substring(0, Math.min(s.title.length, 25))}...
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
