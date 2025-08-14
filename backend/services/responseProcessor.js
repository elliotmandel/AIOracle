const { OracleEngine } = require('./oracleEngine');
const { ClaudeAPIService } = require('./claudeAPI');
const { ContextInjectionService } = require('./contextInjection');

class ResponseProcessor {
  constructor() {
    this.oracleEngine = new OracleEngine();
    this.claudeAPI = new ClaudeAPIService();
    this.contextInjection = new ContextInjectionService();
  }

  async processQuestion(question, sessionId = null) {
    try {
      const questionAnalysis = this.oracleEngine.analyzeQuestion(question);
      const selectedPersona = this.oracleEngine.selectPersona();
      const responseType = this.oracleEngine.selectResponseType();
      const context = this.contextInjection.generateContext(question, questionAnalysis.themes, selectedPersona);
      
      const responseId = this.oracleEngine.generateResponseId(question, selectedPersona, context);
      
      let attempts = 0;
      let claudeResponse;
      
      while (attempts < 3 && this.oracleEngine.isDuplicateResponse(responseId)) {
        const newContext = this.contextInjection.generateContext(question, questionAnalysis.themes, selectedPersona);
        claudeResponse = await this.generateClaudeResponse(question, selectedPersona, newContext, responseType);
        attempts++;
      }
      
      if (!claudeResponse) {
        claudeResponse = await this.generateClaudeResponse(question, selectedPersona, context, responseType);
      }
      
      this.oracleEngine.markResponseUsed(responseId);
      
      const processedResponse = this.enhanceResponse(claudeResponse, selectedPersona, responseType, questionAnalysis);
      
      return {
        success: true,
        question: question.trim(),
        response: processedResponse.text,
        metadata: {
          persona: {
            name: selectedPersona.name,
            description: selectedPersona.description,
            characteristics: selectedPersona.characteristics
          },
          responseType: responseType.name,
          themes: questionAnalysis.themes,
          sentiment: questionAnalysis.sentiment,
          mood: this.oracleEngine.getCurrentMood(),
          processingTime: processedResponse.processingTime,
          sessionId: sessionId,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('Response processing error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.generateEmergencyResponse(question),
        metadata: {
          error: true,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async generateClaudeResponse(question, persona, context, responseType) {
    const startTime = Date.now();
    
    const contextString = this.contextInjection.formatContextForPrompt(context);
    const fullPrompt = persona.promptTemplate
      .replace('{question}', question)
      .replace('{context}', contextString);
    
    const enhancedPrompt = this.addResponseTypeGuidance(fullPrompt, responseType);
    
    const result = await this.claudeAPI.generateResponse(enhancedPrompt, { question });
    
    return {
      text: result.success ? result.response : result.fallback,
      success: result.success,
      processingTime: Date.now() - startTime,
      usage: result.usage || {}
    };
  }

  addResponseTypeGuidance(prompt, responseType) {
    const guidance = {
      directWisdom: "Be clear and actionable while maintaining mystical authority.",
      metaphoricalRiddle: "Embed your wisdom in metaphors and symbolic language.",
      tangentialInsight: "Approach the question from an unexpected but illuminating angle.",
      absurdistPhilosophy: "Embrace beautiful paradoxes and surreal connections.",
      pureNonsense: "Be delightfully absurd while somehow remaining oddly helpful."
    };

    return `${prompt}\n\nResponse style: ${guidance[responseType.name] || guidance.directWisdom}`;
  }

  enhanceResponse(claudeResponse, persona, responseType, questionAnalysis) {
    let enhancedText = claudeResponse.text;
    
    if (responseType.name === 'metaphoricalRiddle' && !enhancedText.includes('like') && !enhancedText.includes('as')) {
      const metaphor = this.contextInjection.getRandomMetaphor();
      enhancedText = `${enhancedText} Consider this ${metaphor}.`;
    }
    
    if (questionAnalysis.sentiment === 'negative' && Math.random() < 0.3) {
      enhancedText += "\n\nRemember: even the darkest night gives way to dawn.";
    }
    
    if (enhancedText.length < 50 && responseType.name !== 'pureNonsense') {
      enhancedText += ` The universe often speaks in whispers that grow louder with contemplation.`;
    }
    
    if (enhancedText.length > 400) {
      const sentences = enhancedText.split('. ');
      enhancedText = sentences.slice(0, 3).join('. ') + '.';
    }
    
    return {
      text: enhancedText,
      processingTime: claudeResponse.processingTime
    };
  }

  generateEmergencyResponse(question) {
    const emergencyResponses = [
      "The cosmic servers are experiencing turbulence. Your question echoes in the void, awaiting clearer skies.",
      "The Oracle's vision is clouded by temporal interference. Perhaps the answer lies in asking the question differently.",
      "The mystical networks are realigning. Your inquiry has been heard, though the response travels through distant dimensions.",
      "Even oracles must sometimes admit the limitations of mortal technology. The wisdom you seek exists, but requires patience.",
      "The universe is buffering. Please hold while reality recalibrates its response algorithms."
    ];
    
    return emergencyResponses[Math.floor(Math.random() * emergencyResponses.length)];
  }

  getCurrentOracleState() {
    return {
      mood: this.oracleEngine.getCurrentMood(),
      personas: this.oracleEngine.getPersonaInfo(),
      responseTypes: this.oracleEngine.getResponseTypeInfo()
    };
  }

  async testConnections() {
    const claudeStatus = await this.claudeAPI.testConnection();
    
    return {
      claude: claudeStatus,
      oracle: true,
      context: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { ResponseProcessor };