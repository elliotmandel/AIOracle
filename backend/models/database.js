const { getDatabase } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

class DatabaseService {
  constructor() {
    this.db = getDatabase();
  }

  async createSession() {
    return new Promise((resolve, reject) => {
      const sessionId = uuidv4();
      const query = 'INSERT INTO sessions (id) VALUES (?)';
      
      this.db.run(query, [sessionId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(sessionId);
        }
      });
    });
  }

  async updateSessionActivity(sessionId) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE sessions SET last_activity = CURRENT_TIMESTAMP WHERE id = ?';
      
      this.db.run(query, [sessionId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  async saveQuestion(questionData) {
    return new Promise((resolve, reject) => {
      const {
        sessionId,
        question,
        response,
        persona,
        responseType,
        themes,
        sentiment,
        mood,
        processingTime
      } = questionData;

      const query = `
        INSERT INTO questions (
          session_id, question, response, persona_name, persona_description,
          response_type, themes, sentiment, mood, processing_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        sessionId,
        question,
        response,
        persona?.name || null,
        persona?.description || null,
        responseType,
        JSON.stringify(themes),
        sentiment,
        JSON.stringify(mood),
        processingTime
      ];

      this.db.run(query, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async saveFeedback(questionId, rating) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO feedback (question_id, rating) VALUES (?, ?)';
      
      this.db.run(query, [questionId, rating], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async getSessionHistory(sessionId, limit = 10) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT id, question, response, persona_name, response_type, timestamp
        FROM questions 
        WHERE session_id = ? 
        ORDER BY timestamp DESC 
        LIMIT ?
      `;
      
      this.db.all(query, [sessionId, limit], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getQuestionById(questionId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM questions WHERE id = ?';
      
      this.db.get(query, [questionId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getAnalytics(days = 7) {
    return new Promise((resolve, reject) => {
      const queries = [
        // Total questions
        `SELECT COUNT(*) as total FROM questions WHERE timestamp >= datetime('now', '-${days} days')`,
        
        // Persona usage
        `SELECT persona_name, COUNT(*) as count 
         FROM questions 
         WHERE timestamp >= datetime('now', '-${days} days') AND persona_name IS NOT NULL
         GROUP BY persona_name 
         ORDER BY count DESC`,
        
        // Response type usage
        `SELECT response_type, COUNT(*) as count 
         FROM questions 
         WHERE timestamp >= datetime('now', '-${days} days')
         GROUP BY response_type 
         ORDER BY count DESC`,
        
        // Feedback summary
        `SELECT f.rating, COUNT(*) as count 
         FROM feedback f 
         JOIN questions q ON f.question_id = q.id 
         WHERE q.timestamp >= datetime('now', '-${days} days')
         GROUP BY f.rating`,
        
        // Average processing time
        `SELECT AVG(processing_time) as avg_time 
         FROM questions 
         WHERE timestamp >= datetime('now', '-${days} days') AND processing_time IS NOT NULL`
      ];

      const results = {};
      let completed = 0;

      const executeQuery = (query, key) => {
        this.db.all(query, (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          
          results[key] = rows;
          completed++;
          
          if (completed === queries.length) {
            resolve({
              totalQuestions: results.total[0]?.total || 0,
              personaUsage: results.personas || [],
              responseTypeUsage: results.types || [],
              feedbackSummary: results.feedback || [],
              averageProcessingTime: results.avgTime[0]?.avg_time || 0
            });
          }
        });
      };

      executeQuery(queries[0], 'total');
      executeQuery(queries[1], 'personas');
      executeQuery(queries[2], 'types');
      executeQuery(queries[3], 'feedback');
      executeQuery(queries[4], 'avgTime');
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = { DatabaseService };