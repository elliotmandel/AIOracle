const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DATABASE_PATH || './database/oracle.db';

function initializeDatabase() {
  const dbDir = path.dirname(DB_PATH);
  
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('📚 Connected to SQLite database');
      createTables(db);
    }
  });

  return db;
}

function createTables(db) {
  const queries = [
    `CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT,
      question TEXT NOT NULL,
      response TEXT NOT NULL,
      persona_name TEXT,
      persona_description TEXT,
      response_type TEXT,
      themes TEXT,
      sentiment TEXT,
      mood TEXT,
      processing_time INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions (id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER,
      rating TEXT CHECK (rating IN ('makes_sense', 'beautifully_nonsensical', 'unhelpful')),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (question_id) REFERENCES questions (id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS oracle_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE,
      total_questions INTEGER DEFAULT 0,
      persona_usage TEXT,
      response_type_usage TEXT,
      average_processing_time REAL,
      feedback_summary TEXT
    )`
  ];

  queries.forEach((query, index) => {
    db.run(query, (err) => {
      if (err) {
        console.error(`Error creating table ${index + 1}:`, err.message);
      } else {
        console.log(`✓ Table ${index + 1} created/verified`);
      }
    });
  });
}

function getDatabase() {
  return new sqlite3.Database(DB_PATH);
}

module.exports = { initializeDatabase, getDatabase };