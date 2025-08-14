export default async function handler(req, res) {
  // Enable CORS for production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, sessionId, offerings = [], enhancements = null, enhancement = null } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    if (question.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Question too long. Please keep it under 500 characters.'
      });
    }

    console.log('Processing question:', question);
    console.log('Enhancement received:', enhancement);
    
    // Mock session handling
    const currentSessionId = sessionId || `session_${Date.now()}`;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Mock Oracle responses with persona variety
    const personas = [
      { name: 'The Mystic Seer', type: 'mystical' },
      { name: 'The Ancient Oracle', type: 'ancient' },
      { name: 'The Cosmic Guide', type: 'cosmic' },
      { name: 'The Ethereal Whisper', type: 'ethereal' },
      { name: 'The Sage of Time', type: 'temporal' }
    ];
    
    const selectedPersona = personas[Math.floor(Math.random() * personas.length)];
    
    // Generate mock response
    const responses = [
      "The threads of fate weave intricate patterns around your inquiry. I sense great potential in the path ahead.",
      "The cosmos whispers of change approaching. Embrace the uncertainty, for it carries hidden gifts.",
      "Ancient wisdom speaks through the mists of time. Your journey requires patience and inner strength.",
      "The ethereal realm reveals multiple possibilities. Trust your intuition to guide you forward.",
      "Time flows like a river, carrying opportunities. Be ready to seize the moment when it presents itself."
    ];
    
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    // Add Good Omens if enhancement is active
    if (enhancement?.type === 'good_omens' || enhancements?.good_omens) {
      const omens = [
        "🌟 Watch for a meaningful conversation with a stranger that provides unexpected insight",
        "🦋 Notice when animals or nature seem to acknowledge your presence - this signals alignment",
        "✨ Pay attention to repeated numbers or symbols appearing in your daily life"
      ];
      response += "\n\n🌟 **Three Omens to Watch For:**\n" + omens.join("\n");
    }
    
    const result = {
      success: true,
      response: response,
      metadata: {
        persona: selectedPersona.name,
        personaType: selectedPersona.type,
        responseType: enhancement?.type === 'good_omens' ? 'enhanced_omens' : 'standard',
        themes: ['guidance', 'wisdom', 'future'],
        sentiment: 'positive',
        mood: 'mystical',
        processingTime: Math.floor(1000 + Math.random() * 2000),
        questionId: `q_${Date.now()}`,
        sessionId: currentSessionId,
        timestamp: new Date().toISOString()
      }
    };

    res.json(result);

  } catch (error) {
    console.error('Ask endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'The Oracle encountered an unexpected disturbance',
      fallback: 'The cosmic energies are in flux. Perhaps try asking your question in a different way.'
    });
  }
}