# 🔮 AI Oracle - Mystical Wisdom Web Application

A full-stack web application that provides mystical, sometimes sensible and sometimes delightfully nonsensical answers to your questions through an AI-powered oracle with distinct personas.

## 🌟 Features

### Core Functionality
- **8 Distinct Oracle Personas** - Each with unique characteristics and response styles
- **Dynamic Response Types** - From direct wisdom to beautiful absurdity
- **Context Injection** - Enriched responses using scientific facts, mythology, and history
- **Oracle Mood System** - Daily moods that affect persona selection
- **Response Analytics** - Track feedback and usage patterns
- **Session History** - View recent consultations
- **Mystical UI** - Dark, ethereal design with smooth animations

### Oracle Personas
1. **Cryptic Sage** - Ancient wisdom through nature metaphors
2. **Practical Advisor** - Straightforward wisdom with modern sensibility
3. **Absurdist Philosopher** - Profound nonsense that somehow makes sense
4. **Time-Displaced Prophet** - Visions across past, present, and future
5. **Nature Mystic** - Speaks through the voice of the earth itself
6. **Cosmic Comedian** - Universe's sense of humor personified
7. **Ancient Librarian** - Keeper of all stories and forgotten knowledge
8. **Quantum Dreamer** - Consciousness existing in multiple realities

### Response Types Distribution
- **Direct Wisdom** (40%) - Clear, actionable wisdom
- **Metaphorical Riddle** (25%) - Wisdom hidden in riddles and metaphors
- **Tangential Insight** (20%) - Unexpected perspectives that illuminate
- **Absurdist Philosophy** (10%) - Profound nonsense with hidden meaning
- **Pure Nonsense** (5%) - Delightfully meaningless yet somehow helpful

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Claude API key from Anthropic

### Installation

1. **Clone or extract the project:**
   ```bash
   cd oracle-app
   ```

2. **Set up the backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Claude API key:
   ```
   CLAUDE_API_KEY=your_claude_api_key_here
   PORT=3001
   NODE_ENV=development
   DATABASE_PATH=./database/oracle.db
   ```

4. **Set up the frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3002`

2. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
CLAUDE_API_KEY=your_claude_api_key_here  # Required: Your Anthropic Claude API key
PORT=3002                                # Optional: Backend server port
NODE_ENV=development                     # Optional: Environment mode
DATABASE_PATH=./database/oracle.db       # Optional: SQLite database path
```

#### Frontend
The frontend automatically proxies API requests to the backend. No additional configuration needed for basic setup.

## 📡 API Endpoints

### Core Endpoints
- `POST /api/ask` - Submit a question to the Oracle
- `GET /api/oracle-mood` - Get current Oracle state and personas
- `POST /api/feedback` - Provide feedback on responses
- `GET /api/history/:sessionId` - Get session history
- `GET /api/analytics` - Get usage analytics
- `GET /api/status` - Check system status

### Example Usage

#### Ask a Question
```bash
curl -X POST http://localhost:3002/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the meaning of life?"}'
```

#### Get Oracle State
```bash
curl http://localhost:3002/api/oracle-mood
```

## 🎨 User Interface

### Main Features
- **Question Input** - Large textarea with character counter
- **Oracle Response** - Typewriter animation with persona information
- **Feedback System** - Rate responses as sensible, nonsensical, or unhelpful
- **History Section** - Expandable list of recent questions
- **Mood Display** - Shows current Oracle mood
- **Responsive Design** - Works on desktop and mobile

### Keyboard Shortcuts
- `Ctrl/Cmd + Enter` - Submit question
- `Escape` - Clear current question

## 📊 Database Schema

The application uses SQLite with the following tables:

- **sessions** - User sessions
- **questions** - Questions, responses, and metadata
- **feedback** - User feedback on responses
- **oracle_stats** - Analytics and usage statistics

## 🛠 Development

### Backend Structure
```
backend/
├── server.js              # Express server setup
├── routes/
│   └── oracle.js          # API routes
├── services/
│   ├── oracleEngine.js    # Core oracle logic and personas
│   ├── claudeAPI.js       # Claude API integration
│   ├── contextInjection.js # Context and facts injection
│   └── responseProcessor.js # Response processing pipeline
├── models/
│   └── database.js        # Database operations
└── database/
    └── init.js            # Database initialization
```

### Frontend Structure
```
frontend/src/
├── App.js                 # Main application component
├── components/
│   ├── OracleContext.js   # React context for state management
│   ├── OracleInterface.js # Main interface component
│   ├── QuestionForm.js    # Question input form
│   ├── ResponseDisplay.js # Response display with animations
│   └── HistorySection.js  # History management
└── services/
    └── api.js             # API client
```

### Adding New Personas

1. Edit `backend/services/oracleEngine.js`
2. Add new persona to `ORACLE_PERSONAS` object
3. Adjust probability weights to sum to 1.0
4. Test the new persona

### Customizing Response Types

1. Edit `RESPONSE_TYPES` in `oracleEngine.js`
2. Adjust weights and descriptions
3. Update response processing logic if needed

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Manual Testing Checklist
- [ ] Oracle responds to questions
- [ ] Different personas appear
- [ ] Feedback system works
- [ ] History displays correctly
- [ ] Mobile responsive design
- [ ] Error handling works
- [ ] Database saves data

## 🚨 Troubleshooting

### Common Issues

#### "CLAUDE_API_KEY not configured"
- Ensure you've set your Claude API key in the `.env` file
- Restart the backend server after setting the key

#### "Network error - unable to reach the Oracle"
- Check that the backend server is running on port 3001
- Verify no firewall is blocking the connection

#### Database errors
- Check that the backend has write permissions in the database directory
- Delete `database/oracle.db` to reset if corrupted

#### Frontend won't connect to backend
- Ensure both servers are running
- Check that backend is on port 3002
- Clear browser cache

### Debug Mode
Set `NODE_ENV=development` in your `.env` file for detailed error logging.

## 🎯 Success Criteria

The application successfully meets all requirements when:

- ✅ Users can ask questions and receive varied, entertaining responses
- ✅ Clear distinction between different oracle personas
- ✅ Good balance of sensible and nonsensical responses (60/40 split)
- ✅ Smooth user experience with proper loading states
- ✅ Basic analytics working (response ratings, persona usage)
- ✅ Mobile-friendly interface
- ✅ Session persistence and history
- ✅ Error handling and fallbacks

## 🔮 Future Enhancements

### Phase 4+ Features (Not Implemented)
- User accounts and persistent history
- Oracle personality customization
- Voice input/output
- Share responses on social media
- Daily oracle wisdom emails
- Advanced analytics dashboard
- Multiple languages support
- Oracle chat rooms

## 📄 License

This project is created for educational and entertainment purposes. Claude API usage subject to Anthropic's terms of service.

## 🙏 Acknowledgments

- **Anthropic** for the Claude API
- **React** and **Express** communities
- **Google Fonts** for mystical typography
- The cosmic forces that inspired this creation

---

*"The Oracle sees all timelines simultaneously. In some, you've already found the answer you seek. In others, the question was the answer all along."* - Quantum Dreamer