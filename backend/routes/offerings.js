const express = require('express');
const router = express.Router();
const { OfferingsService } = require('../services/offeringsService');

const offeringsService = new OfferingsService();

// Initialize or resume session
router.post('/session/init', async (req, res) => {
  try {
    const { anonymousId, localData } = req.body;
    
    const sessionData = await offeringsService.initializeSession(anonymousId, localData);
    
    res.json({
      success: true,
      session: sessionData,
      offerings: offeringsService.getAvailableOfferings()
    });
  } catch (error) {
    console.error('Session initialization error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to initialize session',
      fallback: { sessionId: 'temp', coins: 15, isNewUser: true }
    });
  }
});

// Get user progress
router.get('/session/:sessionId/progress', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const progress = await offeringsService.getUserProgress(sessionId);
    
    res.json({
      success: true,
      progress: progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ success: false, error: 'Failed to get progress' });
  }
});

// Award coins for activities
router.post('/session/:sessionId/earn', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { activity, metadata = {} } = req.body;
    
    let coinsAwarded = 0;
    
    // Handle different earning activities
    let earningDetails = [];
    
    switch (activity) {
      case 'ask_question':
        const questionText = metadata.questionText || '';
        const questionLength = metadata.questionLength || 0;
        const result = await offeringsService.awardQuestionCoins(sessionId, questionText, questionLength);
        coinsAwarded = result.totalAwarded;
        earningDetails = result.earningDetails;
        break;
      
      case 'provide_feedback':
        coinsAwarded = await offeringsService.awardCoins(sessionId, 5, 'provide_feedback', metadata);
        break;
        
      case 'quality_question':
        coinsAwarded = await offeringsService.awardCoins(sessionId, 5, 'quality_question', metadata);
        break;
        
      default:
        return res.status(400).json({ success: false, error: 'Unknown activity' });
    }
    
    const progress = await offeringsService.getUserProgress(sessionId);
    
    res.json({
      success: true,
      coinsAwarded: coinsAwarded,
      currentCoins: progress.coins,
      activity: activity,
      earningDetails: earningDetails
    });
  } catch (error) {
    console.error('Earn coins error:', error);
    res.status(500).json({ success: false, error: 'Failed to award coins' });
  }
});

// Spend coins on offerings
router.post('/session/:sessionId/spend', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { offerings, questionId } = req.body;
    
    if (!Array.isArray(offerings) || offerings.length === 0) {
      return res.status(400).json({ success: false, error: 'No offerings specified' });
    }
    
    const result = await offeringsService.spendCoins(sessionId, offerings, questionId);
    const enhancements = offeringsService.getOfferingEnhancements(offerings);
    const progress = await offeringsService.getUserProgress(sessionId);
    
    res.json({
      success: true,
      spent: result.spent,
      offerings: result.offerings,
      enhancements: enhancements,
      currentCoins: progress.coins
    });
  } catch (error) {
    console.error('Spend coins error:', error);
    if (error.message === 'Insufficient coins') {
      res.status(400).json({ success: false, error: 'Not enough mystical coins' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to process offerings' });
    }
  }
});

// Get available offerings
router.get('/offerings', (req, res) => {
  res.json({
    success: true,
    offerings: offeringsService.getAvailableOfferings()
  });
});

// Daily reset and streak calculation
router.get('/session/:sessionId/daily-reset', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Update daily activity is handled automatically in getUserProgress
    await offeringsService.updateDailyActivity(sessionId);
    const progress = await offeringsService.getUserProgress(sessionId);
    
    res.json({
      success: true,
      progress: progress,
      dailyReset: true
    });
  } catch (error) {
    console.error('Daily reset error:', error);
    res.status(500).json({ success: false, error: 'Failed to process daily reset' });
  }
});

// Get coin transaction history
router.get('/session/:sessionId/transactions', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 20 } = req.query;
    
    const db = offeringsService.db;
    
    db.all(`
      SELECT type, amount, reason, metadata, created_at
      FROM coin_transactions 
      WHERE session_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `, [sessionId, parseInt(limit)], (err, rows) => {
      if (err) {
        res.status(500).json({ success: false, error: 'Failed to get transactions' });
      } else {
        const transactions = rows.map(row => ({
          ...row,
          metadata: JSON.parse(row.metadata || '{}')
        }));
        
        res.json({
          success: true,
          transactions: transactions
        });
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, error: 'Failed to get transaction history' });
  }
});

module.exports = router;