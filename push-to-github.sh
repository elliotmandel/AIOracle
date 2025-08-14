#!/bin/bash

# AI Oracle - Push to GitHub Script
echo "🔮 AI Oracle - GitHub Push Script"
echo "================================="

# Check if GitHub repository URL is provided
if [ -z "$1" ]; then
    echo "❌ Please provide your GitHub repository URL"
    echo ""
    echo "Usage: ./push-to-github.sh https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git"
    echo ""
    echo "Steps:"
    echo "1. Create a new repository on GitHub (github.com/new)"
    echo "2. Copy the repository URL"
    echo "3. Run: ./push-to-github.sh <repository-url>"
    exit 1
fi

REPO_URL=$1

echo "📡 Adding GitHub remote..."
git remote add origin "$REPO_URL"

echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Successfully pushed to GitHub!"
    echo "📖 Repository URL: $REPO_URL"
    echo ""
    echo "🚀 Next Steps for Deployment:"
    echo "1. Deploy backend to Railway: https://railway.app"
    echo "2. Deploy frontend to Vercel: https://vercel.com"
    echo "3. Set environment variables on both platforms"
    echo ""
    echo "📚 See DEPLOYMENT.md and QUICK-DEPLOY.md for detailed instructions"
else
    echo "❌ Failed to push to GitHub"
    echo "💡 Make sure:"
    echo "   - Repository exists on GitHub"
    echo "   - You have push permissions"
    echo "   - Repository URL is correct"
fi