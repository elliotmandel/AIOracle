const { OracleEngine } = require('./oracleEngine');
const { ClaudeAPIService } = require('./claudeAPI');
const { ContextInjectionService } = require('./contextInjection');

class ResponseProcessor {
  constructor() {
    this.oracleEngine = new OracleEngine();
    this.claudeAPI = new ClaudeAPIService();
    this.contextInjection = new ContextInjectionService();
  }

  async processQuestion(question, sessionId = null, offerings = [], enhancements = null) {
    try {
      const questionAnalysis = this.oracleEngine.analyzeQuestion(question);
      let selectedPersona = this.oracleEngine.selectPersona();
      const responseType = this.oracleEngine.selectResponseType();
      
      // Apply offerings enhancements
      if (enhancements?.rarePersonas) {
        selectedPersona = this.selectRarePersona() || selectedPersona;
      }
      
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
        claudeResponse = await this.generateClaudeResponse(question, selectedPersona, context, responseType, enhancements);
      }
      
      this.oracleEngine.markResponseUsed(responseId);
      
      const processedResponse = this.enhanceResponse(claudeResponse, selectedPersona, responseType, questionAnalysis, enhancements);
      
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
          timestamp: new Date().toISOString(),
          offerings: offerings,
          enhancementLevel: enhancements ? this.getEnhancementLevel(enhancements) : 'standard'
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

  async generateClaudeResponse(question, persona, context, responseType, enhancements = null) {
    const startTime = Date.now();
    
    const contextString = this.contextInjection.formatContextForPrompt(context);
    let fullPrompt = persona.promptTemplate
      .replace('{question}', question)
      .replace('{context}', contextString);
    
    // Apply offerings enhancements to prompt
    if (enhancements) {
      fullPrompt = this.applyOfferingsToPrompt(fullPrompt, enhancements);
    }
    
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
      directWisdom: "Be clear and actionable while maintaining mystical authority. Use minimal metaphor.",
      metaphoricalRiddle: "Embed your wisdom using only 1-2 metaphors and symbolic language.",
      tangentialInsight: "Approach the question from an unexpected but illuminating angle with minimal metaphor.",
      absurdistPhilosophy: "Embrace one beautiful paradox and surreal connection.",
      pureNonsense: "Be delightfully absurd while somehow remaining oddly helpful. Use one metaphor at most."
    };

    return `${prompt}\n\nResponse style: ${guidance[responseType.name] || guidance.directWisdom}`;
  }

  enhanceResponse(claudeResponse, persona, responseType, questionAnalysis, enhancements = null) {
    console.log('enhanceResponse called with enhancements:', enhancements);
    let enhancedText = claudeResponse.text;
    let maxLength = 300; // Reduced from 400 for more concise responses
    
    // Apply offerings enhancements
    if (enhancements?.extendedResponse) {
      maxLength = 600; // Reduced from 800 for more concise responses
    }
    
    // Removed automatic metaphor injection to maintain max 2 metaphor limit
    
    if (questionAnalysis.sentiment === 'negative' && Math.random() < 0.3) {
      enhancedText += "\n\nRemember: even the darkest night gives way to dawn.";
    }
    
    if (enhancedText.length < 50 && responseType.name !== 'pureNonsense') {
      enhancedText += ` The universe speaks in whispers.`;
    }
    
    // Add Good Omens if enhancement is active
    console.log('Checking for good_omens:', enhancements?.good_omens, 'goodOmens:', enhancements?.goodOmens);
    if (enhancements?.good_omens || enhancements?.goodOmens) {
      console.log('Good Omens enhancement active, generating omens...');
      const omens = this.generateOmens(questionAnalysis, responseType);
      console.log('Generated omens:', omens);
      enhancedText += "\n\n🌟 **Three Omens to Watch For:**\n" + omens.join("\n");
    }
    
    // Only truncate if not using extended response enhancement
    if (enhancedText.length > maxLength && !enhancements?.extendedResponse && !enhancements?.goodOmens && !enhancements?.good_omens) {
      const sentences = enhancedText.split('. ');
      enhancedText = sentences.slice(0, 2).join('. ') + '.'; // Reduced from 3 to 2 sentences
    }
    
    return {
      text: enhancedText,
      processingTime: claudeResponse.processingTime
    };
  }

  generateOmens(questionAnalysis, responseType) {
    const omenTemplates = {
      professional: [
        "✨ A door you hadn't noticed opens when you least expect it",
        "🌙 The counsel of an unexpected ally arrives at the perfect moment", 
        "⭐ Your authentic voice carries further than forced confidence ever could"
      ],
      personal: [
        "🌸 A moment of clarity blooms from embracing uncertainty",
        "🦋 What seems like a detour reveals itself as the true path",
        "💫 Your intuition speaks loudest in the quiet spaces between thoughts"
      ],
      relationships: [
        "🌹 Understanding flows both ways when you listen with your heart",
        "🕊️ A gesture of vulnerability becomes a bridge of connection",
        "💝 The love you seek is already being reflected back to you"
      ],
      past: [
        "🎭 A forgotten lesson resurfaces exactly when you need it most",
        "🪐 What once felt like an ending reveals itself as a beginning",
        "🌅 Healing happens in layers, and today another layer lifts"
      ],
      present: [
        "🧭 The next right step becomes clear when you trust the process",
        "🌊 Flow emerges naturally when you stop fighting the current",
        "☀️ Today's small actions create tomorrow's significant changes"
      ],
      future: [
        "🎯 Your vision aligns with opportunities you haven't yet seen",
        "🌱 Seeds planted in hope will sprout in perfect timing",
        "🔮 The path forward illuminates as you take each faithful step"
      ]
    };

    // Select omens based on question themes, with fallback to general positive omens
    let selectedOmens = [];
    
    if (questionAnalysis.themes && questionAnalysis.themes.length > 0) {
      const theme = questionAnalysis.themes[0].toLowerCase();
      if (omenTemplates[theme]) {
        selectedOmens = [...omenTemplates[theme]];
      }
    }
    
    // Fallback to general omens if no specific theme match
    if (selectedOmens.length === 0) {
      const allOmens = Object.values(omenTemplates).flat();
      selectedOmens = this.shuffleArray(allOmens).slice(0, 3);
    }
    
    // Ensure we have exactly 3 omens
    while (selectedOmens.length < 3) {
      const generalOmens = [
        "✨ Serendipity dances around your daily choices",
        "🌟 Your unique perspective becomes a gift to others",
        "💎 Hidden blessings reveal themselves through small moments"
      ];
      selectedOmens.push(generalOmens[selectedOmens.length % generalOmens.length]);
    }
    
    return selectedOmens.slice(0, 3);
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  generateEmergencyResponse(question) {
    const emergencyResponses = [
      "The cosmic servers are experiencing turbulence. Your question awaits clearer skies.",
      "The Oracle's vision is clouded. Perhaps ask the question differently.",
      "The mystical networks are realigning. Your inquiry travels through distant dimensions.",
      "Even oracles must admit the limitations of mortal technology. The wisdom requires patience.",
      "The universe is buffering. Reality recalibrates its response algorithms."
    ];
    
    return emergencyResponses[Math.floor(Math.random() * emergencyResponses.length)];
  }

  // Select rare persona for crystal/starlight offerings
  selectRarePersona() {
    const { ORACLE_PERSONAS } = require('./oracleEngine');
    const rarePersonas = ['ancientLibrarian', 'quantumDreamer', 'timeDisplacedProphet'];
    const randomRare = rarePersonas[Math.floor(Math.random() * rarePersonas.length)];
    return ORACLE_PERSONAS[randomRare];
  }

  // Apply offerings enhancements to prompt
  applyOfferingsToPrompt(prompt, enhancements) {
    let enhancedPrompt = prompt;
    
    if (enhancements.extendedResponse) {
      enhancedPrompt += "\n\nProvide a detailed response with deeper insights, but use maximum 2 metaphors.";
    }
    
    if (enhancements.empathetic) {
      enhancedPrompt += "\n\nSpeak with gentle compassion, addressing the human directly with empathy. Use 'you' frequently and acknowledge their feelings. Limit metaphors to 2 maximum.";
    }
    
    if (enhancements.rarePersonas) {
      enhancedPrompt += "\n\nDraw upon ancient wisdom and scholarly knowledge. Use maximum 2 metaphors.";
    }
    
    if (enhancements.goodOmens || enhancements.good_omens) {
      enhancedPrompt += "\n\nProvide an uplifting, positive response with favorable outcomes. Use maximum 2 metaphors.";
    }
    
    return enhancedPrompt;
  }

  // Get enhancement level for metadata
  getEnhancementLevel(enhancements) {
    if (enhancements.premiumVoice) return 'starlight';
    if (enhancements.goodOmens) return 'good_omens';
    if (enhancements.rarePersonas || enhancements.rarePersonaBoost) return 'rare_persona';
    if (enhancements.empathetic) return 'lotus';
    if (enhancements.extendedResponse) return 'candle';
    return 'standard';
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