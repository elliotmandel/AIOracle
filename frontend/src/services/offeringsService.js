class OfferingsService {
  constructor() {
    this.sessionData = this.loadSessionData();
  }

  // Load session data from localStorage
  loadSessionData() {
    const stored = localStorage.getItem('oracleUser');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored session data:', error);
      }
    }
    return null;
  }

  // Save session data to localStorage
  saveSessionData(data) {
    try {
      localStorage.setItem('oracleUser', JSON.stringify(data));
      this.sessionData = data;
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  }

  // Initialize session with server
  async initializeSession() {
    try {
      const response = await fetch('/api/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymousId: this.sessionData?.sessionId,
          localData: this.sessionData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const sessionData = {
          sessionId: data.session.sessionId,
          coins: data.session.coins,
          totalEarned: data.session.totalEarned,
          streak: data.session.streak,
          totalQuestions: data.session.totalQuestions || 0,
          dailyActivities: data.session.dailyActivities || {},
          achievements: data.session.achievements || [],
          isNewUser: data.session.isNewUser,
          lastSync: new Date().toISOString()
        };
        
        this.saveSessionData(sessionData);
        return sessionData;
      }
      
      throw new Error('Failed to initialize session');
    } catch (error) {
      console.error('Session initialization error:', error);
      // Fallback to localStorage data or create basic session
      return this.sessionData || this.createFallbackSession();
    }
  }

  // Create fallback session if server unavailable
  createFallbackSession() {
    const fallbackSession = {
      sessionId: 'fallback_' + Date.now(),
      coins: 15,
      totalEarned: 15,
      streak: 1,
      totalQuestions: 0,
      dailyActivities: {},
      achievements: [],
      isNewUser: true,
      lastSync: null
    };
    
    this.saveSessionData(fallbackSession);
    return fallbackSession;
  }

  // Get current session data
  getSessionData() {
    return this.sessionData;
  }

  // Spend coins on offerings
  async spendCoins(offerings, questionId) {
    try {
      const response = await fetch(`/api/spend?sessionId=${this.sessionData.sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerings, questionId })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local session data
        this.sessionData.coins = data.currentCoins;
        this.saveSessionData(this.sessionData);
        
        return {
          success: true,
          spent: data.spent,
          enhancements: data.enhancements,
          currentCoins: data.currentCoins
        };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Spend coins error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Award coins for activities
  async awardCoins(activity, metadata = {}) {
    console.log('OfferingsService.awardCoins called:', { activity, metadata, sessionId: this.sessionData?.sessionId });
    
    if (!this.sessionData || !this.sessionData.sessionId) {
      console.error('No session data available for coin award');
      await this.initializeSession();
      if (!this.sessionData || !this.sessionData.sessionId) {
        return { success: false, error: 'Session initialization failed' };
      }
    }
    
    try {
      console.log('Making API call to:', `/api/earn?sessionId=${this.sessionData.sessionId}`);
      const response = await fetch(`/api/earn?sessionId=${this.sessionData.sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity, metadata })
      });

      console.log('API response status:', response.status);
      const data = await response.json();
      console.log('API response data:', data);
      
      if (data.success) {
        // Update local session data
        this.sessionData.coins = data.currentCoins;
        this.saveSessionData(this.sessionData);
        
        return {
          success: true,
          coinsAwarded: data.coinsAwarded,
          currentCoins: data.currentCoins,
          earningDetails: data.earningDetails || []
        };
      }
      
      return { success: false, error: data.error };
    } catch (error) {
      console.error('Award coins error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Calculate total cost of offerings
  calculateOfferingsCost(offerings) {
    const costs = {
      candle: 5,
      lotus: 8,
      crystal: 12,
      starlight: 15,
      rare_persona: 10,
      good_omens: 25
    };
    
    return offerings.reduce((total, offering) => {
      return total + (costs[offering] || 0);
    }, 0);
  }

  // Check if user can afford offerings
  canAfford(offerings) {
    const totalCost = this.calculateOfferingsCost(offerings);
    return this.sessionData.coins >= totalCost;
  }

  // Get available offerings with user affordability
  getAvailableOfferings() {
    const offerings = {
      candle: { 
        cost: 5, 
        name: 'Sacred Candle',
        icon: '🕯️',
        description: 'Extended, detailed responses',
        affordable: this.sessionData.coins >= 5
      },
      lotus: { 
        cost: 8, 
        name: 'Lotus Petals',
        icon: '🌸',
        description: 'More empathetic, personalized guidance',
        affordable: this.sessionData.coins >= 8
      },
      crystal: { 
        cost: 12, 
        name: 'Crystal Focus',
        icon: '💎',
        description: 'Access to rare Oracle personas',
        affordable: this.sessionData.coins >= 12
      },
      starlight: { 
        cost: 15, 
        name: 'Starlight Blessing',
        icon: '⭐',
        description: 'Premium experience with all enhancements',
        affordable: this.sessionData.coins >= 15
      }
    };
    
    return offerings;
  }

  // Sync with server (daily check, streak updates)
  async syncWithServer() {
    try {
      const response = await fetch(`/api/session/${this.sessionData.sessionId}/daily-reset`);
      const data = await response.json();
      
      if (data.success) {
        const updatedData = {
          ...this.sessionData,
          coins: data.progress.coins,
          streak: data.progress.streak,
          totalEarned: data.progress.totalEarned,
          dailyActivities: data.progress.dailyActivities,
          lastSync: new Date().toISOString()
        };
        
        this.saveSessionData(updatedData);
        return updatedData;
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
    
    return this.sessionData;
  }

  // Get user progress
  async getUserProgress() {
    try {
      const response = await fetch(`/api/session/${this.sessionData.sessionId}/progress`);
      const data = await response.json();
      
      if (data.success) {
        return data.progress;
      }
    } catch (error) {
      console.error('Get progress error:', error);
    }
    
    return null;
  }
}

const offeringsService = new OfferingsService();
export default offeringsService;