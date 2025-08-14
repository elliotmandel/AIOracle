const { ResponseProcessor } = require('../../backend/services/responseProcessor');
const { DatabaseService } = require('../../backend/models/database');

let responseProcessor;
let dbService;

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
    // Initialize services if not already done
    if (!responseProcessor) {
      responseProcessor = new ResponseProcessor();
    }
    if (!dbService) {
      dbService = new DatabaseService();
    }

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

    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = await dbService.createSession();
    } else {
      await dbService.updateSessionActivity(currentSessionId);
    }

    // Convert single enhancement to enhancements format for backward compatibility
    let finalEnhancements = enhancements;
    if (enhancement && enhancement.type) {
      console.log('Enhancement received:', enhancement);
      // Map enhancement types to offerings for the processor
      const enhancementMap = {
        'rare_persona': 'rare_persona',
        'good_omens': 'good_omens'
      };
      
      if (enhancementMap[enhancement.type]) {
        const enhancementOffering = enhancementMap[enhancement.type];
        finalEnhancements = { [enhancementOffering]: true };
        console.log('Final enhancements:', finalEnhancements);
      }
    }

    const result = await responseProcessor.processQuestion(question, currentSessionId, offerings, finalEnhancements);

    if (result.success) {
      const questionId = await dbService.saveQuestion({
        sessionId: currentSessionId,
        question: question.trim(),
        response: result.response,
        persona: result.metadata.persona,
        responseType: result.metadata.responseType,
        themes: result.metadata.themes,
        sentiment: result.metadata.sentiment,
        mood: result.metadata.mood,
        processingTime: result.metadata.processingTime
      });

      result.metadata.questionId = questionId;
      result.metadata.sessionId = currentSessionId;
    }

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