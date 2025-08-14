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
    const { activity, metadata = {} } = req.body;
    
    console.log(`Earning coins for session ${sessionId}, activity: ${activity}`);
    
    let coinsAwarded = 0;
    let earningDetails = [];
    
    // Simplified topic categorization function
    function categorizeQuestion(questionText) {
      const questionLower = questionText.toLowerCase();
      const categories = [];
      
      const categoryKeywords = {
        professional: ['work', 'job', 'career', 'business', 'meeting', 'colleague', 'boss', 'salary', 'promotion', 'interview'],
        personal: ['i am', 'i feel', 'myself', 'my life', 'personal', 'me', 'self', 'identity', 'growth'],
        relationships: ['love', 'relationship', 'partner', 'friend', 'family', 'dating', 'marriage', 'romance', 'heart'],
        past: ['was', 'were', 'had', 'did', 'before', 'ago', 'yesterday', 'last', 'previously', 'happened'],
        present: ['am', 'is', 'are', 'now', 'today', 'currently', 'right now', 'at the moment', 'this'],
        future: ['will', 'going to', 'plan', 'future', 'tomorrow', 'next', 'soon', 'later', 'upcoming']
      };
      
      Object.entries(categoryKeywords).forEach(([category, keywords]) => {
        if (keywords.some(keyword => questionLower.includes(keyword))) {
          categories.push(category);
        }
      });
      
      return categories;
    }
    
    switch (activity) {
      case 'ask_question':
        const questionText = metadata.questionText || '';
        const questionLength = metadata.questionLength || 0;
        
        // Base question coin
        coinsAwarded += 1;
        earningDetails.push({
          reason: 'ask_question',
          amount: 1,
          description: 'Base question reward'
        });
        
        // Quality question bonus (15+ words)
        if (questionLength >= 15) {
          coinsAwarded += 2;
          earningDetails.push({
            reason: 'quality_question',
            amount: 2,
            description: 'Quality question bonus'
          });
        }
        
        // Topic-based coin rewards
        const categories = categorizeQuestion(questionText);
        for (const category of categories) {
          coinsAwarded += 1;
          earningDetails.push({
            reason: `topic_${category}`,
            amount: 1,
            description: `${category.charAt(0).toUpperCase() + category.slice(1)} topic reward`
          });
        }
        break;
      
      case 'provide_feedback':
        coinsAwarded = 5;
        earningDetails.push({ reason: 'provide_feedback', amount: 5, description: 'Feedback reward' });
        break;
        
      case 'quality_question':
        coinsAwarded = 2;
        earningDetails.push({ reason: 'quality_question', amount: 2, description: 'Quality question bonus' });
        break;
        
      default:
        return res.status(400).json({ success: false, error: 'Unknown activity' });
    }
    
    // For serverless, return mock progress - in production this would connect to a database
    const currentCoins = 15 + coinsAwarded; // Mock current coins
    
    res.json({
      success: true,
      coinsAwarded: coinsAwarded,
      currentCoins: currentCoins,
      activity: activity,
      earningDetails: earningDetails
    });
  } catch (error) {
    console.error('Earn coins error:', error);
    res.status(500).json({ success: false, error: 'Failed to award coins' });
  }
};