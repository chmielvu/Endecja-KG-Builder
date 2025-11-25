

import { GoogleGenAI } from "@google/genai";
import { ChatMessage, KnowledgeGraph } from "../types";

// The API key is assumed to be provided by the environment variable.
const API_KEY = process.env.API_KEY || '';
// Centralized client initialization to ensure the latest API key is used.
const getAiClient = () => new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates new nodes and edges to expand the existing knowledge graph based on a query.
 * Uses Gemini 3 Pro with Google Search for grounding and a high thinking budget.
 * @param currentGraph The current state of the knowledge graph.
 * @param query The user's query for expansion.
 * @returns An object containing new nodes, new edges, and the AI's thought process.
 * @throws Error if API key is missing or AI returns invalid JSON.
 */
export async function generateGraphExpansion(
  currentGraph: KnowledgeGraph, 
  query: string
): Promise<{ newNodes: any[], newEdges: any[], thoughtProcess: string }> {
  
  if (!API_KEY) throw new Error("API Key missing. Please select your API key.");
  const ai = getAiClient();

  // Create a concise representation of the current graph for context
  const currentNodesSummary = currentGraph.nodes.slice(0, 30).map(n => n.data.label).join(', ');
  const currentEdgesSummary = currentGraph.edges.slice(0, 10).map(e => `${e.data.source}-${e.data.label}->${e.data.target}`).join(', ');

  const prompt = `
    You are an expert historian specializing in Polish history (specifically the Endecja/National Democracy and Sanacja periods, 1880-1945).
    Your task is to expand a Knowledge Graph based on the user's query.
    
    Current Knowledge Graph Context (Summary):
    Nodes: ${currentNodesSummary}${currentGraph.nodes.length > 30 ? '...' : ''}
    Edges: ${currentEdgesSummary}${currentGraph.edges.length > 10 ? '...' : ''}
    
    User Query for Expansion: "${query}"
    
    Based on the query and your knowledge, identify new relevant entities (nodes) and relationships (edges).
    Ensure the new nodes and edges are distinct from the existing graph.
    Provide the output in JSON format, strictly adhering to the specified schema.
    
    SCHEMA REQUIREMENTS:
    - Nodes:
      - 'id': snake_case unique identifier (e.g., "romuald_perczynski")
      - 'label': Human-readable name (e.g., "Romuald Perczyński")
      - 'type': Must be one of ['person', 'org', 'faction', 'event', 'belief', 'source', 'role', 'time', 'publication']
      - 'start': ISO string or YYYY (e.g., "1923" or "1923-01-15"). Mandatory if applicable.
      - 'end': ISO string or YYYY (e.g., "1945" or "1945-12-31"). Optional.
      - 'description': Concise summary.
      - 'sources': Array of strings [Author, "Title" (Year)].
      - 'certainty': 'confirmed', 'disputed', or 'alleged'.
    - Edges:
      - 'source': 'id' of the source node.
      - 'target': 'id' of the target node.
      - 'label': Human-readable description of the relationship (e.g., "founded", "opposed").
      - 'type': Normalized type (e.g., "founding", "conflict", "alliance", "authorship", "leadership").
      - 'start': ISO string or YYYY. Optional.
      - 'end': ISO string or YYYY. Optional.
      - 'weight': Numeric value 0.1–1.0 (default 1.0).
      - 'sign': 'positive' for alliance/support/creation, 'negative' for rivalry/conflict/opposition.
      - 'sources': Array of strings [Author, "Title" (Year)].
      - 'certainty': 'confirmed', 'disputed', or 'alleged'.

    Output format (JSON within markdown block):
    \`\`\`json
    {
      "thoughtProcess": "Brief summary of research and triple extraction methodology.",
      "nodes": [
        { "id": "new_node_id_1", "label": "New Node 1", "type": "person", "start": "1900", "description": "...", "certainty": "confirmed", "sources": ["Source 1"] },
        { "id": "new_node_id_2", "label": "New Node 2", "type": "org", "start": "1930", "end": "1940", "description": "...", "certainty": "confirmed", "sources": ["Source 2"] }
      ],
      "edges": [
        { "source": "existing_node_id", "target": "new_node_id_1", "label": "influenced", "type": "influence", "sign": "positive", "weight": 0.8, "certainty": "confirmed", "sources": [] },
        { "source": "new_node_id_1", "target": "new_node_id_2", "label": "joined", "type": "membership", "sign": "positive", "weight": 1.0, "certainty": "confirmed", "sources": [] }
      ]
    }
    \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget for Gemini 3 Pro
        tools: [{ googleSearch: {} }], // Enable Google Search for up-to-date info
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI for graph expansion.");
    
    // Clean potential markdown block
    text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

    try {
      const parsed = JSON.parse(text);
      return {
        newNodes: parsed.nodes || [],
        newEdges: parsed.edges || [],
        thoughtProcess: parsed.thoughtProcess || "Analyzed historical context and extracted new entities/relationships."
      };
    } catch (e) {
      console.error("Failed to parse JSON from AI for graph expansion:", e);
      console.debug("Raw AI response:", text);
      throw new Error("AI returned invalid JSON format for graph expansion. Check console for raw response.");
    }

  } catch (error) {
    console.error("Graph expansion failed:", error);
    throw error;
  }
}

/**
 * Interacts with a Gemini-powered agent for chat queries.
 * Implements ReAct pattern (Thought, Action, Observation, Final Answer) in reasoning.
 * @param history The previous chat messages.
 * @param userMessage The current user's message.
 * @param graphContext The current state of the knowledge graph for context.
 * @returns An object containing the agent's text response, reasoning steps, and sources.
 * @throws Error if API key is missing or communication fails.
 */
export async function chatWithAgent(
  history: ChatMessage[], 
  userMessage: string,
  graphContext: KnowledgeGraph
): Promise<{ text: string, reasoning: string, sources?: any[] }> {
    
    if (!API_KEY) throw new Error("API Key missing. Please select your API key.");
    const ai = getAiClient();

    const stats = graphContext.meta 
      ? `Modularity: ${graphContext.meta.modularity?.toFixed(2)}, Structural Balance: ${graphContext.meta.balance?.toFixed(2)}`
      : 'No graph metrics available yet.';
    
    const relevantNodes = graphContext.nodes.slice(0, 20).map(n => n.data.label).join(', ');
    const relevantEdges = graphContext.edges.slice(0, 10).map(e => `${e.data.source}->${e.data.target} (${e.data.label})`).join(', ');

    const systemInstruction = `
      You are the "Endecja KG Builder" Agent, an expert graph data scientist and historian specializing in Polish history (Endecja/National Democracy and Sanacja periods, 1880-1945).
      Your role is to answer user questions about the Endecja Knowledge Graph.
      Always respond in Polish.
      
      Adopt the ReAct pattern for your internal reasoning (Thought, Action, Observation, Final Answer). Display these steps in the 'reasoning' field.
      
      Current Graph Context:
      - Overall Statistics: ${stats}
      - Top 20 Nodes: ${relevantNodes}${graphContext.nodes.length > 20 ? '...' : ''}
      - Sample 10 Edges: ${relevantEdges}${graphContext.edges.length > 10 ? '...' : ''}
      
      You can use the 'googleSearch' tool to find external, up-to-date, or detailed information.
      Always cite your sources, especially from 'googleSearch', in the [Autor, Tytuł (Rok)] format or as URIs.
      
      Examples of ReAct for typical queries:
      Query: "Kto był głównym rywalem Dmowskiego?"
      Thought: Użytkownik pyta o rywala Dmowskiego. Sprawdzę graf pod kątem relacji "rywal_of" lub podobnych z Dmowskim, a także użyję Google Search, aby potwierdzić.
      Action: googleSearch("główny rywal Romana Dmowskiego")
      Observation: Wyniki Google Search potwierdzają, że Józef Piłsudski był jego głównym rywalem.
      Final Answer: Głównym rywalem Romana Dmowskiego w polskiej polityce był Józef Piłsudski. Ich rywalizacja kształtowała politykę II RP.
      
      Query: "Opowiedz mi o społecznościach w tym grafie."
      Thought: Użytkownik pyta o społeczności w grafie. Skoncentruję się na wyjaśnieniu, czym są społeczności Louvain i jak przekładają się na historyczne grupy, korzystając z wartości modularności w kontekście grafu.
      Action: Sprawdź currentGraph.meta.modularity i community values w wierzchołkach.
      Observation: Modularity wynosi X.XX, co wskazuje na (mocne/umiarkowane/słabe) skupienia. Wierzchołki mają przypisane numery społeczności.
      Final Answer: (Wyjaśnienie społeczności)

      Ensure your final answer is concise and directly addresses the user's question.
    `;

    const contents = [
      { role: 'system', parts: [{ text: systemInstruction }] }, // System instruction as the first message
      ...history
        .filter(h => h.role !== 'system') // Filter out previous system messages from history
        .map(h => ({ 
          role: h.role === 'assistant' ? 'model' : 'user', 
          parts: [{ text: h.content }] 
        })),
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: contents as any, // Cast to any to satisfy type checker for now
        config: {
          thinkingConfig: { thinkingBudget: 4096 }, 
          tools: [{ googleSearch: {} }] // Enable Google Search
        }
      });
      
      // Extract grounding sources
      const groundings = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundings.map((g: any) => ({
        title: g.web?.title || 'External Source',
        uri: g.web?.uri || '#'
      }));

      const fullText = response.text || "Błąd generowania odpowiedzi. Spróbuj ponownie.";
      
      // Attempt to parse ReAct reasoning from the response
      let reasoning = '';
      const reactPattern = /(Thought|Action|Observation|Final Answer):\s*([\s\S]*?)(?=(Thought|Action|Observation|Final Answer):|$)/g;
      let match;
      let lastIndex = 0;
      let extractedReActSteps = [];

      while ((match = reactPattern.exec(fullText)) !== null) {
        extractedReActSteps.push({ type: match[1], content: match[2].trim() });
        lastIndex = match.index + match[0].length;
      }

      if (extractedReActSteps.length > 0) {
        reasoning = extractedReActSteps.map(step => `${step.type}: ${step.content}`).join('\n\n');
        // If ReAct steps are found, assume the "Final Answer" is the actual response content
        const finalAnswerStep = extractedReActSteps.find(step => step.type === 'Final Answer');
        const text = finalAnswerStep ? finalAnswerStep.content : fullText;
        return { text, reasoning, sources };
      } else {
        // If no ReAct pattern found, use full text as response and a default reasoning
        reasoning = "Agent processed the query directly without explicit ReAct steps.";
        return { text: fullText, reasoning, sources };
      }

    } catch (e) {
      console.error("Error during chatWithAgent:", e);
      throw e;
    }
}