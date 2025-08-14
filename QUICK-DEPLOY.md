# Quick Deploy Guide - AI Oracle

## 🚀 One-Click Deployment Options

### Option 1: Railway (Recommended for Backend)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/github)

**Steps:**
1. Click the Railway button above
2. Connect your GitHub repository
3. Set these environment variables:
   - `CLAUDE_API_KEY` = your Claude API key
   - `FRONTEND_URL` = your Vercel URL (add after frontend deployment)
4. Deploy!

### Option 2: Vercel (For Frontend)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Steps:**
1. Click the Vercel button above  
2. Import your repository
3. Set Root Directory to `frontend`
4. Add environment variable:
   - `REACT_APP_API_URL` = your Railway backend URL + `/api`
5. Deploy!

## 📋 Manual Deployment Steps

### 1. Backend Deployment (Railway)

```bash
# 1. Push your code to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Go to railway.app and create new project from GitHub
# 3. Select your repo and the 'backend' folder
# 4. Add environment variables in Railway dashboard:
#    CLAUDE_API_KEY=your_key_here
#    NODE_ENV=production
```

### 2. Frontend Deployment (Vercel)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to frontend directory
cd frontend

# 3. Deploy
vercel --prod

# 4. Set environment variable
vercel env add REACT_APP_API_URL
# Enter: https://your-railway-app.railway.app/api
```

## 🔧 Environment Variables Required

### Backend (Railway/Render):
- `CLAUDE_API_KEY` - Your Anthropic Claude API key
- `NODE_ENV` - Set to "production"
- `FRONTEND_URL` - Your Vercel app URL for CORS

### Frontend (Vercel):
- `REACT_APP_API_URL` - Your backend API URL + "/api"

## 🧪 Testing Your Deployment

1. **Backend Health Check**: Visit `https://your-backend.railway.app/health`
2. **Frontend**: Visit your Vercel URL
3. **Full Test**: Ask the Oracle a question and verify speech works

## 🐛 Common Issues

**CORS Errors**: Make sure `FRONTEND_URL` is set in backend environment variables

**API Not Found**: Verify `REACT_APP_API_URL` includes `/api` at the end

**Speech Not Working**: Ensure your app is served over HTTPS (both platforms do this automatically)

## 📱 Mobile & Browser Support

- ✅ Chrome, Firefox, Safari, Edge
- ✅ iOS Safari, Android Chrome
- ⚠️ Speech synthesis requires HTTPS (automatically provided)

Your AI Oracle will be live in ~5 minutes! 🔮