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
    const { activity, metadata = {} } = req.body;
    
    let coinsAwarded = 0;
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
}