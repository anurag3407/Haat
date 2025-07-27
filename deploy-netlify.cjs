#!/usr/bin/env node

/**
 * Netlify Deployment Helper Script
 * 
 * This script helps prepare and deploy the Haat platform to Netlify
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logHeader() {
  log('🚀 Haat Platform - Netlify Deployment Helper', 'cyan');
  log('===============================================', 'cyan');
  log('', 'reset');
}

async function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function checkPrerequisites() {
  logInfo('Checking deployment prerequisites...');
  
  // Check if we're in the right directory
  if (!fs.existsSync('package.json') || !fs.existsSync('backend/package.json')) {
    logError('Please run this script from the root of the Haat project');
    process.exit(1);
  }
  
  // Check if environment template exists
  if (!fs.existsSync('.env.netlify')) {
    logError('.env.netlify template not found. Please create it first.');
    process.exit(1);
  }
  
  logSuccess('Prerequisites check passed!');
}

async function setupEnvironmentGuide() {
  logInfo('Environment Setup Guide:');
  log('', 'reset');
  
  log('📋 You need to set these environment variables in Netlify:', 'yellow');
  
  const envTemplate = fs.readFileSync('.env.netlify', 'utf8');
  const envVars = envTemplate
    .split('\n')
    .filter(line => line.startsWith('VITE_') && line.includes('='))
    .map(line => line.split('=')[0]);
  
  envVars.forEach(envVar => {
    log(`   • ${envVar}`, 'cyan');
  });
  
  log('', 'reset');
  log('🔧 Set these in: Netlify Dashboard → Site Settings → Environment Variables', 'blue');
  log('', 'reset');
}

async function deploymentChecklist() {
  logInfo('Pre-deployment checklist:');
  log('', 'reset');
  
  const questions = [
    'Have you deployed your backend to Railway/Render? (y/n): ',
    'Have you updated VITE_API_URL with your backend URL? (y/n): ',
    'Have you set up MongoDB Atlas? (y/n): ',
    'Do you have Google Maps API key ready? (y/n): ',
    'Do you have Gemini API key ready? (y/n): '
  ];
  
  for (const question of questions) {
    const answer = await askQuestion(question);
    if (!['y', 'Y', 'yes', 'Yes', 'YES'].includes(answer.trim())) {
      logWarning('Please complete all prerequisites before deploying to Netlify');
      log('', 'reset');
      log('📖 Check NETLIFY_DEPLOYMENT.md for detailed instructions', 'blue');
      process.exit(0);
    }
  }
  
  logSuccess('All prerequisites completed!');
}

async function buildProject() {
  logInfo('Building project for production...');
  
  return new Promise((resolve, reject) => {
    const build = spawn('npm', ['run', 'build'], {
      stdio: 'inherit',
      shell: true
    });
    
    build.on('close', (code) => {
      if (code === 0) {
        logSuccess('Build completed successfully!');
        resolve();
      } else {
        logError(`Build failed with code ${code}`);
        reject(new Error(`Build failed with code ${code}`));
      }
    });
  });
}

async function deploymentInstructions() {
  log('', 'reset');
  logInfo('🎉 Your project is ready for Netlify deployment!');
  log('', 'reset');
  
  log('Next steps:', 'cyan');
  log('1. Go to https://netlify.com and login', 'white');
  log('2. Click "New site from Git"', 'white');
  log('3. Connect your GitHub repository', 'white');
  log('4. Configure build settings:', 'white');
  log('   • Build command: npm run build', 'blue');
  log('   • Publish directory: dist', 'blue');
  log('5. Add environment variables from .env.netlify', 'white');
  log('6. Deploy your site!', 'white');
  log('', 'reset');
  
  log('📖 For detailed steps, see NETLIFY_DEPLOYMENT.md', 'cyan');
  log('', 'reset');
  
  logSuccess('Deployment preparation complete! 🚀');
}

async function main() {
  try {
    logHeader();
    
    await checkPrerequisites();
    await setupEnvironmentGuide();
    await deploymentChecklist();
    await buildProject();
    await deploymentInstructions();
    
  } catch (error) {
    logError(`Deployment preparation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
