#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔮 AI Oracle Pre-Deployment Check');
console.log('=================================');

let allChecksPass = true;

function checkExists(filePath, description) {
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`);
    if (!exists) allChecksPass = false;
    return exists;
}

function checkFileContains(filePath, searchTerm, description) {
    if (!fs.existsSync(filePath)) {
        console.log(`❌ ${description}: ${filePath} (file not found)`);
        allChecksPass = false;
        return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const contains = content.includes(searchTerm);
    console.log(`${contains ? '✅' : '❌'} ${description}: ${searchTerm} in ${filePath}`);
    if (!contains) allChecksPass = false;
    return contains;
}

// Check project structure
console.log('\n📁 Project Structure:');
checkExists('./frontend/package.json', 'Frontend package.json');
checkExists('./backend/package.json', 'Backend package.json');
checkExists('./frontend/src/App.js', 'Frontend App.js');
checkExists('./backend/server.js', 'Backend server.js');

// Check configuration files
console.log('\n⚙️  Configuration Files:');
checkExists('./frontend/vercel.json', 'Vercel configuration');
checkExists('./backend/railway.toml', 'Railway configuration');
checkExists('./frontend/.env.example', 'Frontend environment template');
checkExists('./backend/.env.example', 'Backend environment template');

// Check environment variable setup
console.log('\n🔐 Environment Variables:');
checkFileContains('./frontend/src/services/api.js', 'REACT_APP_API_URL', 'Frontend API URL configuration');
checkFileContains('./backend/server.js', 'corsOptions', 'Backend CORS configuration');

// Check for Claude API integration
console.log('\n🤖 Claude API Integration:');
checkExists('./backend/services/claudeAPI.js', 'Claude API service');
checkFileContains('./backend/services/claudeAPI.js', 'CLAUDE_API_KEY', 'Claude API key configuration');

// Check for essential features
console.log('\n🎭 Oracle Features:');
checkExists('./backend/services/oracleEngine.js', 'Oracle Engine');
checkExists('./frontend/src/services/speechService.js', 'Speech Service');
checkFileContains('./backend/services/oracleEngine.js', 'ORACLE_PERSONAS', 'Oracle personas configuration');

// Check build configuration
console.log('\n🏗️  Build Configuration:');
checkFileContains('./frontend/package.json', '"build":', 'Frontend build script');
checkFileContains('./backend/package.json', '"start":', 'Backend start script');

console.log('\n' + '='.repeat(50));

if (allChecksPass) {
    console.log('🎉 All checks passed! Your AI Oracle is ready for deployment.');
    console.log('\n📝 Next Steps:');
    console.log('1. Commit and push your code to GitHub');
    console.log('2. Deploy backend to Railway: https://railway.app');
    console.log('3. Deploy frontend to Vercel: https://vercel.com');
    console.log('4. Set environment variables on both platforms');
    console.log('5. Test your deployed application');
    console.log('\n🚀 Run ./deploy.sh for automated deployment');
    process.exit(0);
} else {
    console.log('❌ Some checks failed. Please fix the issues above before deploying.');
    console.log('\n📖 See DEPLOYMENT.md for detailed setup instructions');
    process.exit(1);
}