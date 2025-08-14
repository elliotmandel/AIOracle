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
  // Create base tables first
  const createQueries = [
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
      offerings_used TEXT DEFAULT '[]',
      enhancement_level TEXT DEFAULT 'standard',
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
    )`,
    
    `CREATE TABLE IF NOT EXISTS oracle_sessions (
      id TEXT PRIMARY KEY,
      coins INTEGER DEFAULT 15,
      total_earned INTEGER DEFAULT 15,
      streak INTEGER DEFAULT 0,
      last_visit DATE,
      total_questions INTEGER DEFAULT 0,
      sessions_count INTEGER DEFAULT 1,
      daily_activities TEXT DEFAULT '{}',
      achievements TEXT DEFAULT '[]',
      preferences TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS coin_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT,
      type TEXT CHECK (type IN ('earn', 'spend')),
      amount INTEGER,
      reason TEXT,
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES oracle_sessions (id)
    )`
  ];

  createQueries.forEach((query, index) => {
    db.run(query, (err) => {
      if (err) {
        console.error(`Error creating table ${index + 1}:`, err.message);
      } else {
        console.log(`✓ Table ${index + 1} created/verified`);
      }
    });
  });

  // Handle schema migrations safely
  db.all("PRAGMA table_info(questions)", (err, rows) => {
    if (err) {
      console.error('Error checking questions table schema:', err.message);
      return;
    }
    
    const existingColumns = rows.map(row => row.name);
    
    // Add offerings_used column if it doesn't exist
    if (!existingColumns.includes('offerings_used')) {
      db.run("ALTER TABLE questions ADD COLUMN offerings_used TEXT DEFAULT '[]'", (err) => {
        if (err) {
          console.error('Error adding offerings_used column:', err.message);
        } else {
          console.log('✓ Added offerings_used column to questions table');
        }
      });
    }
    
    // Add enhancement_level column if it doesn't exist
    if (!existingColumns.includes('enhancement_level')) {
      db.run("ALTER TABLE questions ADD COLUMN enhancement_level TEXT DEFAULT 'standard'", (err) => {
        if (err) {
          console.error('Error adding enhancement_level column:', err.message);
        } else {
          console.log('✓ Added enhancement_level column to questions table');
        }
      });
    }
  });
}

function getDatabase() {
  return new sqlite3.Database(DB_PATH);
}

module.exports = { initializeDatabase, getDatabase };