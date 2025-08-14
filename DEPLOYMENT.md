# AI Oracle Deployment Guide

This guide will help you deploy the AI Oracle application to production using Vercel for the frontend and a serverless platform for the backend.

## Architecture Overview

- **Frontend**: React application deployed on Vercel
- **Backend**: Node.js/Express API deployed on Railway/Render/similar
- **Database**: SQLite (for development) or PostgreSQL (for production)

## Prerequisites

1. [Vercel CLI](https://vercel.com/cli) installed
2. [Git](https://git-scm.com/) repository
3. Claude API key from Anthropic
4. Account on Railway, Render, or similar for backend hosting

## Backend Deployment (Railway - Recommended)

### Option 1: Railway

1. **Sign up at [Railway.app](https://railway.app)**

2. **Create a new project from GitHub**
   - Connect your repository
   - Select the `backend` folder

3. **Set environment variables in Railway dashboard:**
   ```
   CLAUDE_API_KEY=your_claude_api_key_here
   NODE_ENV=production
   PORT=3002
   ```

4. **Add a PostgreSQL database:**
   - In Railway dashboard, click "Add Service" → "Database" → "PostgreSQL"
   - Railway will automatically provide DATABASE_URL

5. **Update backend for production:**
   - Railway automatically detects Node.js and runs `npm install` and `npm start`

### Option 2: Render

1. **Sign up at [Render.com](https://render.com)**

2. **Create a new Web Service:**
   - Connect your repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set environment variables:**
   ```
   CLAUDE_API_KEY=your_claude_api_key_here
   NODE_ENV=production
   ```

4. **Add PostgreSQL database:**
   - Create a new PostgreSQL service
   - Copy the connection string to your web service environment variables

## Frontend Deployment (Vercel)

### Method 1: Vercel Dashboard

1. **Sign up at [Vercel.com](https://vercel.com)**

2. **Import your project:**
   - Click "New Project"
   - Import from Git repository
   - Select your repository
   - Set Framework Preset: "Create React App"
   - Root Directory: `frontend`

3. **Configure environment variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Method 2: Vercel CLI

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

5. **Set environment variables:**
   ```bash
   vercel env add REACT_APP_API_URL
   # Enter your backend URL when prompted
   ```

## Database Migration for Production

If using PostgreSQL in production, you'll need to update the backend database configuration:

1. **Install pg dependency:**
   ```bash
   cd backend
   npm install pg
   ```

2. **Update database configuration** in `services/database.js` to support PostgreSQL

## Environment Variables Summary

### Backend (.env)
```
CLAUDE_API_KEY=your_claude_api_key_here
NODE_ENV=production
DATABASE_URL=postgresql://... (if using PostgreSQL)
PORT=3002
```

### Frontend (Vercel Environment Variables)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Testing the Deployment

1. **Check backend health:**
   - Visit `https://your-backend-url.com/api/status`
   - Should return JSON with status information

2. **Test frontend:**
   - Visit your Vercel URL
   - Try asking the Oracle a question
   - Verify speech functionality works
   - Check that all personas are working

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Update backend CORS configuration to include your Vercel domain
   - Add to `server.js`: 
   ```javascript
   app.use(cors({
     origin: ['http://localhost:3000', 'https://your-vercel-app.vercel.app']
   }));
   ```

2. **API Connection Errors:**
   - Verify `REACT_APP_API_URL` is correct
   - Check that backend is running and accessible

3. **Speech Not Working:**
   - Ensure HTTPS is used (required for Web Speech API)
   - Check browser compatibility

4. **Database Errors:**
   - Verify database connection string
   - Check that tables are created (run migrations if needed)

## Continuous Deployment

Both Vercel and Railway support automatic deployments:

- **Vercel**: Automatically deploys on git push to main branch
- **Railway**: Automatically deploys backend on git push

## Security Checklist

- [ ] Claude API key is set as environment variable (not in code)
- [ ] CORS is properly configured
- [ ] Database credentials are secure
- [ ] HTTPS is enabled
- [ ] API rate limiting is configured (if needed)

## Monitoring

- **Vercel**: Provides built-in analytics and performance monitoring
- **Railway**: Provides logs and metrics dashboard
- **Backend Logging**: Monitor application logs for errors

Your AI Oracle should now be live and accessible to users worldwide!