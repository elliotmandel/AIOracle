const axios = require('axios');

class ClaudeAPIService {
  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    this.baseURL = 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-3-5-sonnet-20241022';
    this.maxTokens = 300;
  }

  async generateResponse(prompt, context = {}) {
    if (!this.apiKey) {
      throw new Error('CLAUDE_API_KEY not configured');
    }

    try {
      const response = await axios.post(
        this.baseURL,
        {
          model: this.model,
          max_tokens: this.maxTokens,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          top_p: 0.9
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          },
          timeout: 30000
        }
      );

      if (response.data && response.data.content && response.data.content[0]) {
        return {
          success: true,
          response: response.data.content[0].text.trim(),
          usage: response.data.usage || {}
        };
      } else {
        throw new Error('Invalid response format from Claude API');
      }
    } catch (error) {
      console.error('Claude API Error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid Claude API key');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded');
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('Network connection failed');
      }
      
      return {
        success: false,
        error: error.message,
        fallback: this.generateFallbackResponse(context.question)
      };
    }
  }

  generateFallbackResponse(question) {
    const fallbacks = [
      "The mists of time obscure the answer you seek. Perhaps the question itself holds the key.",
      "Like a river that changes course, your path will become clear when the time is right.",
      "The universe whispers its secrets to those who listen with patience and an open heart.",
      "Some truths can only be discovered through your own journey of exploration.",
      "The answer you seek lies not in the stars, but in the courage to trust your inner wisdom."
    ];
    
    const randomIndex = Math.floor(Math.random() * fallbacks.length);
    return fallbacks[randomIndex];
  }

  async testConnection() {
    try {
      const testPrompt = "Respond with exactly: 'Connection successful'";
      const result = await this.generateResponse(testPrompt);
      return result.success;
    } catch (error) {
      return false;
    }
  }
}

module.exports = { ClaudeAPIService };