const { OfferingsService } = require('../../../backend/services/offeringsService');

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
}