const express = require('express');
const { ResponseProcessor } = require('../services/responseProcessor');
const { DatabaseService } = require('../models/database');

const router = express.Router();
const responseProcessor = new ResponseProcessor();
const dbService = new DatabaseService();

router.post('/ask', async (req, res) => {
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
});

router.get('/oracle-mood', async (req, res) => {
  try {
    const state = responseProcessor.getCurrentOracleState();
    res.json({
      success: true,
      ...state
    });
  } catch (error) {
    console.error('Oracle mood endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to read the Oracle\'s current state'
    });
  }
});

router.post('/feedback', async (req, res) => {
  try {
    const { questionId, rating } = req.body;

    if (!questionId || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Question ID and rating are required'
      });
    }

    const validRatings = ['makes_sense', 'beautifully_nonsensical', 'unhelpful'];
    if (!validRatings.includes(rating)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid rating. Must be one of: ' + validRatings.join(', ')
      });
    }

    const question = await dbService.getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    const feedbackId = await dbService.saveFeedback(questionId, rating);

    res.json({
      success: true,
      feedbackId,
      message: 'Thank you for your feedback. The Oracle learns from your wisdom.'
    });

  } catch (error) {
    console.error('Feedback endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to record feedback'
    });
  }
});

router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    if (limit > 50) {
      return res.status(400).json({
        success: false,
        error: 'Limit cannot exceed 50'
      });
    }

    const history = await dbService.getSessionHistory(sessionId, limit);

    res.json({
      success: true,
      history,
      sessionId
    });

  } catch (error) {
    console.error('History endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve session history'
    });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    
    if (days > 365) {
      return res.status(400).json({
        success: false,
        error: 'Analytics period cannot exceed 365 days'
      });
    }

    const analytics = await dbService.getAnalytics(days);

    res.json({
      success: true,
      period: `${days} days`,
      ...analytics
    });

  } catch (error) {
    console.error('Analytics endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to generate analytics'
    });
  }
});

router.get('/status', async (req, res) => {
  try {
    const connections = await responseProcessor.testConnections();
    const oracleState = responseProcessor.getCurrentOracleState();

    res.json({
      success: true,
      status: 'operational',
      connections,
      currentMood: oracleState.mood,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Status endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to check Oracle status'
    });
  }
});

module.exports = router;