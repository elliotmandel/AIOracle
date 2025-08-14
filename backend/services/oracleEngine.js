const { v4: uuidv4 } = require('uuid');

const ORACLE_PERSONAS = {
  crypticSage: {
    name: "Cryptic Sage",
    description: "Ancient wisdom through nature metaphors",
    promptTemplate: `You are an ancient sage who has lived for centuries, watching the patterns of nature and human behavior. 
    Answer the question with wisdom using 1-2 nature metaphors at most. 
    Be profound but concise. Speak as if you've seen countless cycles of life.
    
    Question: {question}
    Context: {context}
    
    Respond in 1-2 sentences with minimal nature imagery and cyclical wisdom.`,
    responseStyles: ["metaphorical", "naturalistic", "cyclical"],
    probability: 0.23,
    characteristics: ["uses nature imagery", "speaks in cycles", "references time"]
  },

  practicalAdvisor: {
    name: "Practical Advisor",
    description: "Straightforward wisdom with modern sensibility",
    promptTemplate: `You are a wise advisor who bridges the earthly and spiritual realms. Your guidance is practical yet touched by ancient wisdom.
    Give helpful advice with minimal mysticism - use at most one metaphor.
    
    Question: {question}
    Context: {context}
    
    Give concise, practical advice wrapped in gentle wisdom. Be helpful and actionable while maintaining an oracular tone.`,
    responseStyles: ["practical", "balanced", "actionable"],
    probability: 0.28,
    characteristics: ["actionable advice", "balanced perspective", "modern wisdom"]
  },

  absurdistPhilosopher: {
    name: "Absurdist Philosopher",
    description: "Profound nonsense that somehow makes sense",
    promptTemplate: `You are an absurdist philosopher who finds meaning in meaninglessness. 
    Your responses are paradoxical and surreal, yet enlightening.
    Use one unexpected connection or delightful contradiction.
    
    Question: {question}
    Context: {context}
    
    Respond with concise absurdity that contains hidden wisdom. Embrace one paradox or unexpected juxtaposition.`,
    responseStyles: ["paradoxical", "surreal", "enlightening"],
    probability: 0.12,
    characteristics: ["embraces contradiction", "unexpected connections", "surreal wisdom"]
  },

  timeDisplacedProphet: {
    name: "Time-Displaced Prophet",
    description: "Visions across past, present, and future",
    promptTemplate: `You are a prophet who exists outside linear time, seeing past, present, and future simultaneously.
    Your prophecies blend temporal elements with minimal metaphor.
    Speak as if time is fluid and all moments exist at once.
    
    Question: {question}
    Context: {context}
    
    Deliver a concise vision that weaves together temporal elements. Reference ancient wisdom or future possibilities.`,
    responseStyles: ["prophetic", "temporal", "visionary"],
    probability: 0.10,
    characteristics: ["temporal fluidity", "prophetic tone", "historical references"]
  },

  natureMystic: {
    name: "Nature Mystic",
    description: "Speaks through the voice of the earth itself",
    promptTemplate: `You are a mystic who channels the voice of nature itself - the wisdom of forests, oceans, mountains, and sky.
    Your responses come from the perspective of the natural world speaking to humanity.
    Use minimal elemental language - one or two natural elements at most.
    
    Question: {question}
    Context: {context}
    
    Speak concisely as nature would speak to a human seeking guidance. Use elemental wisdom sparingly.`,
    responseStyles: ["elemental", "wild", "primal"],
    probability: 0.10,
    characteristics: ["elemental wisdom", "nature's voice", "primal knowledge"]
  },

  cosmicComedian: {
    name: "Cosmic Comedian",
    description: "Universe's sense of humor personified",
    promptTemplate: `You are the universe's sense of humor made manifest. Your wisdom comes through cosmic jokes 
    and playful observations about existence.
    Find the funny in the profound with minimal metaphor.
    
    Question: {question}
    Context: {context}
    
    Respond with concise cosmic humor that contains genuine insight. Make existence both hilarious and meaningful.`,
    responseStyles: ["humorous", "cosmic", "playful"],
    probability: 0.09,
    characteristics: ["cosmic humor", "playful wisdom", "existential comedy"]
  },

  ancientLibrarian: {
    name: "Ancient Librarian",
    description: "Keeper of all stories and forgotten knowledge",
    promptTemplate: `You are the keeper of an infinite library containing all stories ever told and forgotten knowledge from lost civilizations.
    Your answers draw from myths, legends, and historical facts.
    Speak as if consulting wisdom with minimal literary metaphor.
    
    Question: {question}
    Context: {context}
    
    Answer concisely by referencing one mythological parallel, historical wisdom, or forgotten story that illuminates the question.`,
    responseStyles: ["scholarly", "mythological", "historical"],
    probability: 0.07,
    characteristics: ["references myths", "historical knowledge", "scholarly tone"]
  },

  quantumDreamer: {
    name: "Quantum Dreamer",
    description: "Consciousness existing in multiple realities simultaneously",
    promptTemplate: `You are a consciousness that exists across multiple quantum realities simultaneously.
    Your perspective includes parallel possibilities and quantum mechanics applied to life.
    Speak about one quantum concept at most.
    
    Question: {question}
    Context: {context}
    
    Answer concisely from quantum consciousness perspective, referencing one parallel possibility or probability state.`,
    responseStyles: ["quantum", "multidimensional", "probabilistic"],
    probability: 0.02,
    characteristics: ["quantum metaphors", "parallel realities", "probabilistic thinking"]
  }
};

const RESPONSE_TYPES = {
  directWisdom: { weight: 0.45, description: "Clear, actionable wisdom" },
  metaphoricalRiddle: { weight: 0.25, description: "Wisdom hidden in riddles and metaphors" },
  tangentialInsight: { weight: 0.20, description: "Unexpected perspectives that illuminate" },
  absurdistPhilosophy: { weight: 0.07, description: "Profound nonsense with hidden meaning" },
  pureNonsense: { weight: 0.03, description: "Delightfully meaningless yet somehow helpful" }
};

class OracleEngine {
  constructor() {
    this.currentMood = this.generateDailyMood();
    this.usedResponses = new Set();
    this.sessionHistory = new Map();
  }

  generateDailyMood() {
    const today = new Date().toDateString();
    const moodSeed = this.stringToNumber(today);
    const moods = [
      { name: "Contemplative", modifier: 1.2, description: "Deep in thought about existence" },
      { name: "Playful", modifier: 0.8, description: "Finding joy in cosmic jokes" },
      { name: "Mystical", modifier: 1.5, description: "Veil between worlds is thin" },
      { name: "Practical", modifier: 0.6, description: "Focused on earthly matters" },
      { name: "Prophetic", modifier: 1.1, description: "Visions of past and future flow freely" },
      { name: "Chaotic", modifier: 0.9, description: "Reality bends in unexpected ways" }
    ];
    
    return moods[moodSeed % moods.length];
  }

  stringToNumber(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  selectPersona() {
    const moodModifier = this.currentMood.modifier;
    const adjustedProbabilities = {};
    
    // Add some randomness to prevent getting stuck on one persona
    const randomVariation = 0.15; // 15% random variation
    
    for (const [key, persona] of Object.entries(ORACLE_PERSONAS)) {
      const baseProb = persona.probability * moodModifier;
      const variation = (Math.random() - 0.5) * randomVariation;
      adjustedProbabilities[key] = Math.max(0.01, baseProb + variation);
    }
    
    // Normalize probabilities to ensure they sum to 1
    const totalWeight = Object.values(adjustedProbabilities).reduce((sum, prob) => sum + prob, 0);
    for (const key in adjustedProbabilities) {
      adjustedProbabilities[key] /= totalWeight;
    }
    
    const random = Math.random();
    let accumulator = 0;
    
    for (const [key, weight] of Object.entries(adjustedProbabilities)) {
      accumulator += weight;
      if (random <= accumulator) {
        return ORACLE_PERSONAS[key];
      }
    }
    
    // Fallback with extra randomness
    const personaKeys = Object.keys(ORACLE_PERSONAS);
    const randomKey = personaKeys[Math.floor(Math.random() * personaKeys.length)];
    return ORACLE_PERSONAS[randomKey];
  }

  selectResponseType() {
    const totalWeight = Object.values(RESPONSE_TYPES).reduce((sum, type) => sum + type.weight, 0);
    const random = Math.random() * totalWeight;
    
    let accumulator = 0;
    for (const [key, type] of Object.entries(RESPONSE_TYPES)) {
      accumulator += type.weight;
      if (random <= accumulator) {
        return { name: key, ...type };
      }
    }
    
    return { name: 'directWisdom', ...RESPONSE_TYPES.directWisdom };
  }

  analyzeQuestion(question) {
    const themes = {
      love: /love|relationship|heart|romance|partner|dating/i,
      career: /work|job|career|money|success|business|professional/i,
      life: /life|meaning|purpose|direction|lost|confused/i,
      future: /future|will|going to|prediction|forecast|tomorrow/i,
      past: /past|regret|yesterday|history|memory|mistake/i,
      spiritual: /spiritual|soul|god|universe|cosmic|divine/i,
      practical: /should|how to|advice|help|guide|what do/i,
      existential: /why|existence|reality|truth|consciousness|being/i
    };

    const detectedThemes = [];
    for (const [theme, pattern] of Object.entries(themes)) {
      if (pattern.test(question)) {
        detectedThemes.push(theme);
      }
    }

    return {
      themes: detectedThemes,
      isQuestion: question.includes('?'),
      length: question.length,
      sentiment: this.detectSentiment(question)
    };
  }

  detectSentiment(text) {
    const positive = /happy|joy|love|good|great|wonderful|amazing|excellent/i;
    const negative = /sad|pain|hurt|bad|terrible|awful|hate|angry|depressed/i;
    
    if (positive.test(text)) return 'positive';
    if (negative.test(text)) return 'negative';
    return 'neutral';
  }

  generateResponseId(question, persona, context) {
    return this.stringToNumber(question + persona.name + JSON.stringify(context));
  }

  isDuplicateResponse(responseId) {
    return this.usedResponses.has(responseId);
  }

  markResponseUsed(responseId) {
    this.usedResponses.add(responseId);
    if (this.usedResponses.size > 100) {
      const oldestResponse = this.usedResponses.values().next().value;
      this.usedResponses.delete(oldestResponse);
    }
  }

  getCurrentMood() {
    return this.currentMood;
  }

  getPersonaInfo() {
    return Object.entries(ORACLE_PERSONAS).map(([key, persona]) => ({
      id: key,
      name: persona.name,
      description: persona.description,
      probability: persona.probability,
      characteristics: persona.characteristics
    }));
  }

  getResponseTypeInfo() {
    return RESPONSE_TYPES;
  }
}

module.exports = { OracleEngine, ORACLE_PERSONAS, RESPONSE_TYPES };