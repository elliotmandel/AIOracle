#!/bin/bash

# AI Oracle Deployment Script
echo "🔮 AI Oracle Deployment Script"
echo "==============================="

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the oracle-app root directory"
    exit 1
fi

# Check if required tools are installed
echo "📋 Checking prerequisites..."

if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install it with: npm install -g vercel"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git not found. Please install Git first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Frontend deployment
echo "🚀 Deploying Frontend to Vercel..."
cd frontend

# Check if environment variables are set
if [ -z "$REACT_APP_API_URL" ]; then
    echo "⚠️  Warning: REACT_APP_API_URL not set. You'll need to configure this in Vercel dashboard."
    echo "   Example: https://your-backend-url.railway.app/api"
fi

# Deploy to Vercel
echo "📦 Building and deploying frontend..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Frontend deployed successfully!"
else
    echo "❌ Frontend deployment failed"
    exit 1
fi

cd ..

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📝 Next Steps:"
echo "1. Deploy your backend to Railway, Render, or similar platform"
echo "2. Set the backend URL in Vercel environment variables:"
echo "   vercel env add REACT_APP_API_URL"
echo "3. Set your Claude API key in the backend platform"
echo "4. Test your deployed application"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"