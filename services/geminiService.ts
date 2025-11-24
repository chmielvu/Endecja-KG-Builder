
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, KnowledgeGraph } from "../types";

const API_KEY = process.env.API_KEY || '';

const getAiClient = () => new GoogleGenAI({ apiKey: API_KEY });

export async function generateGraphExpansion(
  currentGraph: KnowledgeGraph, 
  query: string
): Promise<{ newNodes: any[], newEdges: any[], thoughtProcess: string }> {
  
  if (!API_KEY) throw new Error("API Key missing");
  const ai = getAiClient();

  const prompt = `
    You are an expert historian and graph data scientist specializing in Polish history (Endecja/Sanacja period).
    The user wants to expand the Knowledge Graph based on the query: "${query}".
    
    Current Graph Nodes (partial): ${currentGraph.nodes.slice(0, 30).map(n => n.data.label).join(', ')}...
    
    Perform the following:
    1. Reason about what entities are missing related to the query.
    2. Search for factual connections if needed using the googleSearch tool.
    3. Return a list of NEW nodes and edges to add.
    
    The output MUST be a valid JSON object with this schema:
    {
      "thoughtProcess": "Short explanation of your research and decisions.",
      "nodes": [ 
        { "id": "unique_snake_case_id", "label": "Label", "type": "person|organization|event|concept|publication", "dates": "YYYY or YYYY-YYYY", "description": "Short description" } 
      ],
      "edges": [ 
        { "source": "existing_or_new_id", "target": "existing_or_new_id", "relationship": "verb_label", "dates": "YYYY" } 
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // MANDATORY: Thinking mode enabled
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json", // NOT ALLOWED WITH SEARCH
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Clean potential markdown code blocks manually since we can't use responseMimeType w/ search
    text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

    // Attempt to parse JSON
    try {
      const parsed = JSON.parse(text);
      return {
        newNodes: parsed.nodes || [],
        newEdges: parsed.edges || [],
        thoughtProcess: parsed.thoughtProcess || "Analyzed historical context."
      };
    } catch (e) {
      console.error("Failed to parse JSON from response:", text);
      throw new Error("AI returned invalid JSON format.");
    }

  } catch (error) {
    console.error("Expansion failed", error);
    throw error;
  }
}

export async function chatWithAgent(
  history: ChatMessage[], 
  userMessage: string,
  graphContext: KnowledgeGraph
): Promise<{ text: string, reasoning: string, sources?: any[] }> {
    
    if (!API_KEY) throw new Error("API Key missing");
    const ai = getAiClient();

    const graphSummary = `Graph has ${graphContext.nodes.length} nodes. Key entities: ${graphContext.nodes.slice(0, 20).map(n => n.data.label).join(', ')}`;

    const systemInstruction = `
      You are the "Endecja KG Builder" Agent. 
      You help users analyze the knowledge graph of the Polish National Democracy movement.
      Use the ReAct pattern: Thought, Action, Observation, Final Answer.
      
      When answering:
      1. Think step-by-step about the graph data provided.
      2. If you need external info, use the search tool.
      3. Be concise and professional (Academic tone).
      4. Reply in Polish unless asked otherwise.
      
      Context: ${graphSummary}
    `;

    // Flatten history for context, map 'assistant' to 'model', filter system messages
    const contents = [
      ...history
        .filter(h => h.role !== 'system')
        .map(h => ({ 
          role: h.role === 'assistant' ? 'model' : 'user', 
          parts: [{ text: h.content }] 
        })),
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: contents as any,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingBudget: 4096 }, 
          tools: [{ googleSearch: {} }]
        }
      });
      
      const groundings = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundings.map((g: any) => ({
        title: g.web?.title || 'Source',
        uri: g.web?.uri || '#'
      }));

      return {
        text: response.text || "Błąd generowania odpowiedzi.",
        reasoning: "Analiza kontekstu grafu i źródeł zewnętrznych...",
        sources
      };

    } catch (e) {
      console.error(e);
      return { text: "Wystąpił błąd komunikacji z modelem.", reasoning: "" };
    }
}
