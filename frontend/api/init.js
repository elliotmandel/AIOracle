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
    const { anonymousId, localData } = req.body;
    
    // Simple in-memory session for serverless
    const sessionId = anonymousId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const sessionData = {
      sessionId,
      coins: 15,
      isNewUser: true,
      createdAt: new Date().toISOString()
    };
    
    const offerings = [
      {
        id: 'rare_persona',
        cost: 10,
        name: 'Rare Persona',
        description: 'Unlock a rare mystical persona'
      },
      {
        id: 'good_omens',
        cost: 25,
        name: 'Good Omens',
        description: 'Receive three omens with your reading'
      }
    ];
    
    res.json({
      success: true,
      session: sessionData,
      offerings
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