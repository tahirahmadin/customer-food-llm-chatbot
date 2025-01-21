// src/services/chatService.ts
import { config } from '../config';

// Interfaces for type safety
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
  query_context?: {
    original_query?: string;
    processed_query?: string;
    timestamp?: string;
  };
}

export class ChatService {
  private readonly restaurantId: string;
  private readonly queryUrl: string;
  private readonly openaiKey: string;

  constructor() {
    // Validate and extract environment variables
    const restaurantId = import.meta.env.VITE_RESTAURANT_ID;
    const queryUrl = import.meta.env.VITE_PUBLIC_QUERY_DOCUMENT_API_URL;
    const openaiKey = import.meta.env.VITE_PUBLIC_OPENAI_API_KEY;

    // Throw error if any required variable is missing
    if (!restaurantId || !queryUrl || !openaiKey) {
      throw new Error('Missing required environment variables');
    }

    this.restaurantId = restaurantId;
    this.queryUrl = queryUrl;
    this.openaiKey = openaiKey;
  }

  // Comprehensive method to extract menu context from Milvus response
  private extractMenuContext(milvusData: any): string {
    // Logging for debugging
    console.log('Raw Milvus Data:', JSON.stringify(milvusData, null, 2));

    // Multiple strategies to extract results
    const resultsExtractionStrategies = [
      () => milvusData.response?.results,
      () => milvusData.results,
      () => milvusData.data?.results
    ];

    // Find first non-empty result set
    let extractedResults: MenuResult[] | undefined;
    for (const strategy of resultsExtractionStrategies) {
      extractedResults = strategy();
      if (extractedResults && extractedResults.length > 0) {
        break;
      }
    }

    // Log extracted results
    console.log('Extracted Results:', JSON.stringify(extractedResults, null, 2));

    // Handle case of no results
    if (!extractedResults || extractedResults.length === 0) {
      console.warn('No menu results found');
      return '';
    }

    // Process and clean menu items
    const menuItems = extractedResults
      .map(result => {
        // Ensure we have text to process
        const text = (result.text || result.content || '').trim();
        
        // Extract prices
        const priceMatches = text.match(/AED\s*\d+(\.\d{2})?/g) || [];
        const prices = priceMatches.map(p => p.trim());
        
        // Clean description by removing prices
        const description = text
          .replace(/AED\s*\d+(\.\d{2})?/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        // Combine price and description
        return prices.length > 0 
          ? `${prices[0]} ${description}` 
          : description;
      })
      .filter(item => item.length > 0)
      .filter((item, index, self) => 
        self.findIndex(t => t === item) === index
      );

    // Log processed menu items
    console.log('Processed Menu Items:', menuItems);

    return menuItems.join('\n');
  }

  // Create a system prompt for OpenAI
  private createSystemPrompt(menuContext: string, query: string): string {
    return `You are a precise restaurant menu assistant. Guidelines:
    1. Only recommend items from this exact menu context
    2. Use precise prices as shown
    3. Never invent menu items
    4. Keep responses concise
    5. If no matching items, clearly state that

    User Query: ${query}

    Available Menu Items:
    ${menuContext || 'No menu items available'}`;
  }

  // Main method to query menu
  async queryMenu(query: string): Promise<ChatResponse> {
    try {
      // Validate input
      if (!query || typeof query !== 'string') {
        throw new Error('Invalid query provided');
      }

      // Fetch from Milvus backend
      const milvusResponse = await fetch(this.queryUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: this.restaurantId,
          query
        }),
      });

      // Check Milvus response
      if (!milvusResponse.ok) {
        const errorText = await milvusResponse.text();
        console.error('Milvus Error:', errorText);
        throw new Error(`Milvus fetch failed: ${errorText}`);
      }

      // Parse Milvus response
      const milvusData: MilvusResponse = await milvusResponse.json();

      // Extract menu context
      const menuContext = this.extractMenuContext(milvusData);

      // Handle empty menu context
      if (!menuContext.trim()) {
        return { 
          response: "I apologize, but I couldn't find any menu items matching your query." 
        };
      }

      // Prepare OpenAI request
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: this.createSystemPrompt(menuContext, query)
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.3,
          max_tokens: 150,
        }),
      });

      // Validate OpenAI response
      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error('OpenAI Error:', errorText);
        throw new Error(`OpenAI request failed: ${errorText}`);
      }

      // Process OpenAI response
      const openaiData = await openaiResponse.json();
      const response = openaiData.choices[0].message.content;

      // Final validation
      if (!response.includes('AED') && menuContext.includes('AED')) {
        return this.queryMenu(`Please list the exact items and prices (in AED) for: ${query}`);
      }

      return { response };

    } catch (error) {
      console.error('Comprehensive Error in ChatService:', error);
      return { 
        response: "I apologize, but there was an error processing your request." 
      };
    }
  }
}