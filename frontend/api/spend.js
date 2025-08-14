module.exports = async (req, res) => {
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
    const { sessionId } = req.query;
    const { offeringId, cost } = req.body;
    
    console.log(`Spending ${cost} coins for session ${sessionId}, offering: ${offeringId}`);
    
    // For serverless, return mock spending - in production this would connect to a database
    const success = true; // Mock successful spending
    const remainingCoins = Math.max(0, 15 - cost); // Mock remaining coins
    
    res.json({
      success: success,
      remainingCoins: remainingCoins,
      offeringId: offeringId,
      spent: cost
    });
  } catch (error) {
    console.error('Spend coins error:', error);
    res.status(500).json({ success: false, error: 'Failed to spend coins' });
  }
};