const { getDatabase } = require('../database/init');

// Offering types and their costs
const OFFERINGS = {
  candle: { 
    cost: 5, 
    name: 'Sacred Candle',
    icon: '🕯️',
    description: 'Extended, detailed responses',
    enhancement: 'extended_response'
  },
  lotus: { 
    cost: 8, 
    name: 'Lotus Petals',
    icon: '🌸',
    description: 'More empathetic, personalized guidance',
    enhancement: 'empathetic_tone'
  },
  crystal: { 
    cost: 12, 
    name: 'Crystal Focus',
    icon: '💎',
    description: 'Access to rare Oracle personas',
    enhancement: 'rare_personas'
  },
  starlight: { 
    cost: 15, 
    name: 'Starlight Blessing',
    icon: '⭐',
    description: 'Premium experience with all enhancements',
    enhancement: 'premium_all'
  },
  rare_persona: {
    cost: 10,
    name: 'Rare Persona',
    icon: '🔮',
    description: 'Increase chances of rare Oracle persona',
    enhancement: 'rare_persona_boost'
  },
  good_omens: {
    cost: 25,
    name: 'Good Omens',
    icon: '✨',
    description: 'Receive positive omens and uplifting guidance',
    enhancement: 'good_omens'
  }
};

// Earning activities and their rewards
const EARNING_ACTIVITIES = {
  first_visit_today: { coins: 10, description: "Dawn's blessing" },
  ask_question: { coins: 3, description: "Seeking wisdom" },
  quality_question: { coins: 5, description: "Thoughtful inquiry" }, // 15+ words
  provide_feedback: { coins: 5, description: "Sharing insight" },
  consecutive_day_bonus: { coins: 2, description: "Devotion bonus" }, // per day in streak
  first_question_ever: { coins: 15, description: "Welcome seeker" },
  session_duration: { coins: 2, description: "Contemplative presence" }, // 5+ minutes
  topic_professional: { coins: 1, description: "Professional insight" },
  topic_personal: { coins: 1, description: "Personal growth" },
  topic_relationships: { coins: 1, description: "Relationship wisdom" },
  topic_past: { coins: 1, description: "Past reflection" },
  topic_present: { coins: 1, description: "Present awareness" },
  topic_future: { coins: 1, description: "Future guidance" }
};

class OfferingsService {
  constructor() {
    this.db = getDatabase();
  }

  // Initialize or get existing session
  async initializeSession(anonymousId, localData = null) {
    return new Promise((resolve, reject) => {
      if (!anonymousId) {
        // Generate new session
        const newSessionId = this.generateSessionId();
        const today = new Date().toISOString().split('T')[0];
        
        const stmt = this.db.prepare(`
          INSERT INTO oracle_sessions (id, last_visit, daily_activities)
          VALUES (?, ?, ?)
        `);
        
        const dailyActivities = {};
        dailyActivities[today] = {
          visited: true,
          questionsAsked: 0,
          feedbackGiven: 0,
          coinsEarned: 15
        };
        
        stmt.run([newSessionId, today, JSON.stringify(dailyActivities)], (err) => {
          if (err) {
            reject(err);
          } else {
            // Award welcome bonus (using a separate try-catch for this call)
            try {
              this.recordTransaction(newSessionId, 'earn', 15, 'welcome_bonus');
            } catch (transErr) {
              console.error('Transaction recording error:', transErr);
            }
            resolve({
              sessionId: newSessionId,
              coins: 15,
              totalEarned: 15,
              streak: 1,
              isNewUser: true,
              dailyActivities: dailyActivities
            });
          }
        });
      } else {
        // Get existing session
        this.db.get(
          'SELECT * FROM oracle_sessions WHERE id = ?',
          [anonymousId],
          (err, row) => {
            if (err) {
              reject(err);
            } else if (row) {
              // Update streak and daily check
              this.updateDailyActivity(anonymousId);
              resolve({
                sessionId: row.id,
                coins: row.coins,
                totalEarned: row.total_earned,
                streak: row.streak,
                totalQuestions: row.total_questions,
                dailyActivities: JSON.parse(row.daily_activities || '{}'),
                achievements: JSON.parse(row.achievements || '[]'),
                isNewUser: false
              });
            } else {
              // Session not found, create new one
              this.initializeSession(null).then(resolve).catch(reject);
            }
          }
        );
      }
    });
  }

  // Update daily activity and streak
  updateDailyActivity(sessionId) {
    const today = new Date().toISOString().split('T')[0];
    
    this.db.get(
      'SELECT daily_activities, last_visit, streak FROM oracle_sessions WHERE id = ?',
      [sessionId],
      (err, row) => {
        if (err || !row) return;
        
        const dailyActivities = JSON.parse(row.daily_activities || '{}');
        const lastVisit = row.last_visit;
        let newStreak = row.streak;
        
        if (!dailyActivities[today]) {
          // New day visit
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          
          if (lastVisit === yesterday) {
            // Consecutive day
            newStreak += 1;
            this.awardCoins(sessionId, EARNING_ACTIVITIES.consecutive_day_bonus.coins, 'consecutive_day_bonus');
          } else if (lastVisit !== today) {
            // Broke streak
            newStreak = 1;
          }
          
          dailyActivities[today] = {
            visited: true,
            questionsAsked: 0,
            feedbackGiven: 0,
            coinsEarned: EARNING_ACTIVITIES.first_visit_today.coins
          };
          
          // Award daily visit bonus
          this.awardCoins(sessionId, EARNING_ACTIVITIES.first_visit_today.coins, 'first_visit_today');
          
          // Update session
          this.db.run(`
            UPDATE oracle_sessions 
            SET daily_activities = ?, last_visit = ?, streak = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, [JSON.stringify(dailyActivities), today, newStreak, sessionId]);
        }
      }
    );
  }

  // Award coins for activities
  async awardCoins(sessionId, amount, reason, metadata = {}) {
    return new Promise((resolve, reject) => {
      // First update session coins
      this.db.run(`
        UPDATE oracle_sessions 
        SET coins = coins + ?, total_earned = total_earned + ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [amount, amount, sessionId], (err) => {
        if (err) {
          reject(err);
        } else {
          // Record transaction
          this.recordTransaction(sessionId, 'earn', amount, reason, metadata);
          resolve({ awarded: amount, reason });
        }
      });
    });
  }

  // Spend coins for offerings
  async spendCoins(sessionId, offerings, questionId) {
    const totalCost = this.calculateOfferingsCost(offerings);
    
    return new Promise((resolve, reject) => {
      // Check if user has enough coins
      this.db.get(
        'SELECT coins FROM oracle_sessions WHERE id = ?',
        [sessionId],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (!row || row.coins < totalCost) {
            reject(new Error('Insufficient coins'));
          } else {
            // Deduct coins
            this.db.run(`
              UPDATE oracle_sessions 
              SET coins = coins - ?, updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `, [totalCost, sessionId], (err) => {
              if (err) {
                reject(err);
              } else {
                // Record transaction
                this.recordTransaction(sessionId, 'spend', totalCost, 'offerings', {
                  offerings: offerings,
                  questionId: questionId
                });
                resolve({ spent: totalCost, offerings: offerings });
              }
            });
          }
        }
      );
    });
  }

  // Record coin transaction
  recordTransaction(sessionId, type, amount, reason, metadata = {}) {
    const stmt = this.db.prepare(`
      INSERT INTO coin_transactions (session_id, type, amount, reason, metadata)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run([sessionId, type, amount, reason, JSON.stringify(metadata)]);
    stmt.finalize();
  }

  // Calculate total cost of offerings
  calculateOfferingsCost(offerings) {
    return offerings.reduce((total, offering) => {
      return total + (OFFERINGS[offering]?.cost || 0);
    }, 0);
  }

  // Get offering enhancements for response processing
  getOfferingEnhancements(offerings) {
    const enhancements = {
      extendedResponse: offerings.includes('candle') || offerings.includes('starlight'),
      empathetic: offerings.includes('lotus') || offerings.includes('starlight'),
      rarePersonas: offerings.includes('crystal') || offerings.includes('starlight') || offerings.includes('rare_persona'),
      premiumVoice: offerings.includes('starlight'),
      visualEffects: offerings.length > 0,
      rarePersonaBoost: offerings.includes('rare_persona'),
      goodOmens: offerings.includes('good_omens')
    };

    return enhancements;
  }

  // Award coins for question-related activities
  async awardQuestionCoins(sessionId, questionText, questionLength, providedFeedback = false) {
    let totalAwarded = 0;
    const earningDetails = [];
    
    // Base question reward
    await this.awardCoins(sessionId, EARNING_ACTIVITIES.ask_question.coins, 'ask_question');
    totalAwarded += EARNING_ACTIVITIES.ask_question.coins;
    earningDetails.push({
      reason: 'ask_question',
      amount: EARNING_ACTIVITIES.ask_question.coins,
      description: EARNING_ACTIVITIES.ask_question.description
    });
    
    // Quality question bonus (15+ words)
    if (questionLength >= 15) {
      await this.awardCoins(sessionId, EARNING_ACTIVITIES.quality_question.coins, 'quality_question');
      totalAwarded += EARNING_ACTIVITIES.quality_question.coins;
      earningDetails.push({
        reason: 'quality_question',
        amount: EARNING_ACTIVITIES.quality_question.coins,
        description: EARNING_ACTIVITIES.quality_question.description
      });
    }
    
    // Topic-based coin rewards
    const categories = this.categorizeQuestion(questionText);
    for (const category of categories) {
      const activityKey = `topic_${category}`;
      if (EARNING_ACTIVITIES[activityKey]) {
        await this.awardCoins(sessionId, EARNING_ACTIVITIES[activityKey].coins, activityKey);
        totalAwarded += EARNING_ACTIVITIES[activityKey].coins;
        earningDetails.push({
          reason: activityKey,
          amount: EARNING_ACTIVITIES[activityKey].coins,
          description: EARNING_ACTIVITIES[activityKey].description
        });
      }
    }
    
    // Feedback bonus
    if (providedFeedback) {
      await this.awardCoins(sessionId, EARNING_ACTIVITIES.provide_feedback.coins, 'provide_feedback');
      totalAwarded += EARNING_ACTIVITIES.provide_feedback.coins;
      earningDetails.push({
        reason: 'provide_feedback',
        amount: EARNING_ACTIVITIES.provide_feedback.coins,
        description: EARNING_ACTIVITIES.provide_feedback.description
      });
    }
    
    // Update question count
    this.db.run(`
      UPDATE oracle_sessions 
      SET total_questions = total_questions + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [sessionId]);
    
    return { totalAwarded, earningDetails };
  }

  // Get user progress
  async getUserProgress(sessionId) {
    return new Promise((resolve, reject) => {
      this.db.get(`
        SELECT 
          coins, total_earned, streak, total_questions, sessions_count,
          daily_activities, achievements, last_visit, created_at
        FROM oracle_sessions WHERE id = ?
      `, [sessionId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            coins: row?.coins || 0,
            totalEarned: row?.total_earned || 0,
            streak: row?.streak || 0,
            totalQuestions: row?.total_questions || 0,
            sessionsCount: row?.sessions_count || 0,
            dailyActivities: JSON.parse(row?.daily_activities || '{}'),
            achievements: JSON.parse(row?.achievements || '[]'),
            memberSince: row?.created_at
          });
        }
      });
    });
  }

  // Generate unique session ID
  generateSessionId() {
    return 'oracle_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
  }

  // Get available offerings
  getAvailableOfferings() {
    return OFFERINGS;
  }

  // Categorize question by topic for coin rewards
  categorizeQuestion(question) {
    const questionLower = question.toLowerCase();
    const categories = [];

    // Professional keywords
    const professionalKeywords = [
      'career', 'job', 'work', 'workplace', 'professional', 'business', 'interview', 
      'promotion', 'colleague', 'boss', 'manager', 'client', 'project', 'salary',
      'office', 'company', 'industry', 'skill', 'resume', 'employment', 'profession'
    ];

    // Personal keywords
    const personalKeywords = [
      'myself', 'personal', 'self', 'identity', 'purpose', 'meaning', 'growth',
      'change', 'habit', 'goal', 'dream', 'aspiration', 'potential', 'confidence',
      'fear', 'anxiety', 'happiness', 'fulfillment', 'passion', 'talent', 'strength'
    ];

    // Relationship keywords
    const relationshipKeywords = [
      'relationship', 'love', 'partner', 'spouse', 'marriage', 'dating', 'friend',
      'friendship', 'family', 'parent', 'child', 'sibling', 'romantic', 'social',
      'connection', 'trust', 'conflict', 'communication', 'intimacy', 'breakup'
    ];

    // Past keywords
    const pastKeywords = [
      'past', 'history', 'childhood', 'previous', 'before', 'earlier', 'used to',
      'remember', 'memory', 'regret', 'mistake', 'lesson', 'experience', 'was',
      'were', 'had', 'did', 'happened', 'ago', 'yesterday', 'last'
    ];

    // Present keywords
    const presentKeywords = [
      'now', 'currently', 'present', 'today', 'right now', 'at the moment',
      'these days', 'lately', 'recent', 'am', 'is', 'are', 'doing', 'happening',
      'current', 'this', 'immediate', 'contemporary'
    ];

    // Future keywords
    const futureKeywords = [
      'future', 'will', 'going to', 'plan', 'next', 'tomorrow', 'upcoming',
      'ahead', 'later', 'eventually', 'someday', 'potential', 'possibility',
      'destiny', 'fate', 'prediction', 'forecast', 'hope', 'expect', 'anticipate'
    ];

    // Check each category
    if (professionalKeywords.some(keyword => questionLower.includes(keyword))) {
      categories.push('professional');
    }
    if (personalKeywords.some(keyword => questionLower.includes(keyword))) {
      categories.push('personal');
    }
    if (relationshipKeywords.some(keyword => questionLower.includes(keyword))) {
      categories.push('relationships');
    }
    if (pastKeywords.some(keyword => questionLower.includes(keyword))) {
      categories.push('past');
    }
    if (presentKeywords.some(keyword => questionLower.includes(keyword))) {
      categories.push('present');
    }
    if (futureKeywords.some(keyword => questionLower.includes(keyword))) {
      categories.push('future');
    }

    return categories;
  }
}

module.exports = { OfferingsService, OFFERINGS, EARNING_ACTIVITIES };