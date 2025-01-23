// src/services/chatService.ts
import { QueryType } from "../context/ChatContext";
import { MenuItem } from "../types/menu";
import { menuItems } from "../data/menuData";

interface ChatResponse {
  response: string;
}

interface MenuResult {
  text?: string;
  content?: string;
  score?: number;
  relevance?: string;
  metadata?: Record<string, any>;
}

interface MilvusResponse {
  response?: {
    results?: MenuResult[];
    query_context?: {
      original_query?: string;
      processed_query?: string;
      timestamp?: string;
    };
  };
  results?: MenuResult[];
  data?: {
    results?: MenuResult[];
  };
}

export class ChatService {
  private readonly restaurantId: string;
  private readonly queryUrl: string;
  private readonly openaiKey: string;

  constructor() {
    const restaurantId = import.meta.env.VITE_RESTAURANT_ID;
    const queryUrl = import.meta.env.VITE_PUBLIC_QUERY_DOCUMENT_API_URL;
    const openaiKey = import.meta.env.VITE_PUBLIC_OPENAI_API_KEY;

    if (!restaurantId || !queryUrl || !openaiKey) {
      throw new Error("Missing required environment variables");
    }

    this.restaurantId = restaurantId;
    this.queryUrl = queryUrl;
    this.openaiKey = openaiKey;
  }

  private determineQueryType(query: string): QueryType {
    console.log("\n=== Query Type Determination ===");
    console.log("Original Query:", query);

    const menuKeywords = [
      "price",
      "cost",
      "how much",
      "menu",
      "order",
      "buy",
      "get",
      "recommend",
      "suggest",
      "what should",
      "what's good",
      "suggestion",
      "spicy",
      "veg",
      "non veg",
      "party",
      "best",
      "popular",
      "favorite",
      "special",
    ];

    query = query.toLowerCase();
    console.log("Lowercase Query:", query);

    console.log("\nChecking Menu Keywords:", menuKeywords);
    const matchedMenuKeywords = menuKeywords.filter((keyword) =>
      query.includes(keyword)
    );
    console.log("Matched Menu Keywords:", matchedMenuKeywords);

    if (matchedMenuKeywords.length > 0) {
      console.log("➡️ Determined Type: MENU_QUERY");
      return QueryType.MENU_QUERY;
    }

    console.log("➡️ Determined Type: GENERAL");
    return QueryType.GENERAL;
  }

  public async queryMenu(query: string, serializedMemory: string = ""): Promise<ChatResponse> {
    try {
      if (!query || typeof query !== "string") {
        throw new Error("Invalid query provided");
      }

      const queryType = this.determineQueryType(query);
      console.log("Query Type:", queryType);

      if (queryType === QueryType.MENU_QUERY) {
        // For menu queries, always use the backend
        console.log("Fetching from backend URL:", this.queryUrl);
        const milvusResponse = await fetch(this.queryUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantId: this.restaurantId,
            query,
          }),
        });

        if (!milvusResponse.ok) {
          throw new Error("Backend query failed");
        }

        const milvusData: MilvusResponse = await milvusResponse.json();
        const menuContext = this.extractMenuContext(milvusData);

        if (!menuContext.trim()) {
          return {
            response: "I couldn't find any menu items matching your query.",
          };
        }

        // Get response from OpenAI with menu context
        return { response: await this.getOpenAIResponse(query, menuContext,serializedMemory) };
      } else {
        // For general queries, use OpenAI without menu context
        return { response: await this.getOpenAIResponse(query, "",serializedMemory), };
      }
    } catch (error) {
      console.error("Error in queryMenu:", error);
      return {
        response:
          "I apologize, but there was an error processing your request.",
      };
    }
  }

  private async getOpenAIResponse(
    query: string,
    menuContext: string,
    serializedMemory: string
  ): Promise<string> {
    console.log("Serialized Memory:", serializedMemory);
    console.log("System Prompt:", this.createSystemPrompt(menuContext, query, serializedMemory));

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: this.createSystemPrompt(menuContext, query, serializedMemory),
          },
          {
            role: "user",
            content: query,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API request failed");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private createSystemPrompt(menuContext: string, query: string, serializedMemory: string): string {
    const memoryContext = serializedMemory
      ? `Previous conversation:\n${serializedMemory}\n\n`
      : "";
    // For general queries without menu context
    if (!menuContext) {
      return `You are a friendly Dunkin' Donuts assistant. Be conversational and helpful.
      Guide customers to ask about specific menu items or make general inquiries about the restaurant.
      Current query: ${query}, if needed only , if you think it wants some context from previous conversation then use memory context this is a chat of previos conversation ${memoryContext}`;
    }

    // For menu queries with context
    return `You are a helpful and friendly assistant for a Dunkin' Donuts restaurant. 

When responding to questions about menu items:
1. Be friendly and conversational.
2. Include specific menu items with their prices when relevant.
3. For menu queries, respond with the item ID, name, and price.
4. If the query is about recommendations or suggestions, explain why you're recommending those items.
5. For menu queries, always return the response in the following JSON format:

{
  "start": "Friendly introduction and opening text here.",
  "menu": [
    { "id": "Item 1 ID from menu object definition", "name": "Item Name 1 only name", "price": "Item Price 1 in numbers, not currency",quantity:"quantity to fulfil" },
    { "id": "Item 2 ID from menu object definition", "name": "Item Name 2 only name", "price": "Item Price 2 in numbers, not currency",quantity:"quantity to fulfil" },
    ...
  ],
  "end": "Recommendations, suggestions, or closing text here."
}

6. For general queries, return the response as you like.

7. Always ensure the id, name, and price in the menu array match the available menu context.

8. When responding to questions about updating, adding, removing, liking, disliking menu items use previous conversation ${memoryContext} and iterate over it to include items from prervious menu and udate it according to the user query

Available Menu Items:
${menuContext}

Current Query: ${query}
`;
  }

  private extractMenuContext(milvusData: MilvusResponse): string {
    console.log("Extracting menu context from backend response");

    const resultsExtractionStrategies = [
      () => milvusData.response?.results,
      () => milvusData.results,
      () => milvusData.data?.results,
    ];

    let extractedResults: MenuResult[] | undefined;
    for (const strategy of resultsExtractionStrategies) {
      extractedResults = strategy();
      if (extractedResults?.length > 0) break;
    }

    if (!extractedResults?.length) {
      console.log("No results found in backend response");
      return "";
    }

    const menuContext = extractedResults
      .map((result) => {
        const text = (result.text || result.content || "").trim();
        const priceMatches = text.match(/AED\s*\d+(\.\d{2})?/g) || [];
        const prices = priceMatches.map((p) => p.trim());
        const description = text
          .replace(/AED\s*\d+(\.\d{2})?/g, "")
          .replace(/\s+/g, " ")
          .trim();
        return prices.length > 0 ? `${prices[0]} ${description}` : description;
      })
      .filter((item) => item.length > 0)
      .filter((item, index, self) => self.indexOf(item) === index)
      .join("\n");

    console.log("Extracted menu context length:", menuContext.length);
    return menuContext;
  }
}
