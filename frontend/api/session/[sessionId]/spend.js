const { OfferingsService } = require('../../../../backend/services/offeringsService');

let offeringsService;

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
    // Initialize offerings service if not already done
    if (!offeringsService) {
      offeringsService = new OfferingsService();
    }

    const { sessionId } = req.query;
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
}