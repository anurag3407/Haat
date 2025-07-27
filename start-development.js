#!/usr/bin/env node

/**
 * Haat Platform - Complete Development Setup Script
 * 
 * This script handles the complete setup and running of both frontend and backend
 * servers using concurrently for better process management.
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader() {
  log('🚀 Haat - Street Vendor Supply Management Platform', 'cyan');
  log('=================================================', 'cyan');
  log('', 'reset');
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

async function checkPrerequisites() {
  logInfo('Checking prerequisites...');
  
  // Check Node.js
  try {
    await new Promise((resolve, reject) => {
      exec('node --version', (error, stdout) => {
        if (error) reject(error);
        else {
          logSuccess(`Node.js version: ${stdout.trim()}`);
          resolve();
        }
      });
    });
  } catch (error) {
    logError('Node.js is not installed. Please install Node.js and try again.');
    process.exit(1);
  }

  // Check npm
  try {
    await new Promise((resolve, reject) => {
      exec('npm --version', (error, stdout) => {
        if (error) reject(error);
        else {
          logSuccess(`npm version: ${stdout.trim()}`);
          resolve();
        }
      });
    });
  } catch (error) {
    logError('npm is not installed. Please install npm and try again.');
    process.exit(1);
  }

  // Check if required files exist
  const requiredFiles = [
    { path: 'package.json', description: 'Frontend package.json' },
    { path: 'backend/package.json', description: 'Backend package.json' },
    { path: 'backend/.env.template', description: 'Environment template' }
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(file.path)) {
      logError(`${file.description} not found at: ${file.path}`);
      process.exit(1);
    }
  }

  logSuccess('All prerequisites met!');
}

async function setupEnvironment() {
  logInfo('Setting up environment...');
  
  // Create .env file if it doesn't exist
  if (!fs.existsSync('backend/.env')) {
    logWarning('Creating .env file from template...');
    fs.copyFileSync('backend/.env.template', 'backend/.env');
    logSuccess('Created .env file. Please update it with your configuration.');
    logWarning('⚠️  Remember to add your MongoDB URI, JWT secrets, and API keys!');
  } else {
    logSuccess('Environment file already exists.');
  }
}

async function installDependencies() {
  logInfo('Installing dependencies...');
  
  // Install frontend dependencies
  logInfo('Installing frontend dependencies...');
  await new Promise((resolve, reject) => {
    const npmInstall = spawn('npm', ['install'], { 
      stdio: 'pipe',
      shell: true 
    });
    
    npmInstall.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    npmInstall.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    npmInstall.on('close', (code) => {
      if (code === 0) {
        logSuccess('Frontend dependencies installed!');
        resolve();
      } else {
        logError('Failed to install frontend dependencies');
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
  });

  // Install backend dependencies
  logInfo('Installing backend dependencies...');
  await new Promise((resolve, reject) => {
    const npmInstall = spawn('npm', ['install'], { 
      stdio: 'pipe',
      cwd: 'backend',
      shell: true 
    });
    
    npmInstall.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    npmInstall.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    npmInstall.on('close', (code) => {
      if (code === 0) {
        logSuccess('Backend dependencies installed!');
        resolve();
      } else {
        logError('Failed to install backend dependencies');
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
  });
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

async function populateDatabase() {
  const answer = await askQuestion(log('🗄️  Do you want to populate the database with dummy data? (y/n): ', 'yellow'));
  
  if (['y', 'Y', 'yes', 'Yes', 'YES'].includes(answer.trim())) {
    logInfo('Populating database with dummy data...');
    
    await new Promise((resolve, reject) => {
      const populateScript = spawn('node', ['populate-database-complete.js'], {
        stdio: 'inherit',
        cwd: 'backend',
        shell: true
      });
      
      populateScript.on('close', (code) => {
        if (code === 0) {
          logSuccess('Database populated successfully!');
          resolve();
        } else {
          logWarning('Database population failed or was cancelled');
          resolve(); // Continue anyway
        }
      });
    });
  } else {
    logInfo('Skipping database population.');
  }
}

async function startServers() {
  logInfo('Starting development servers...');
  log('', 'reset');
  
  // Check if concurrently is installed
  try {
    require.resolve('concurrently');
  } catch (error) {
    logWarning('Installing concurrently...');
    await new Promise((resolve, reject) => {
      const install = spawn('npm', ['install', 'concurrently', '--save-dev'], {
        stdio: 'inherit',
        shell: true
      });
      
      install.on('close', (code) => {
        if (code === 0) {
          logSuccess('Concurrently installed!');
          resolve();
        } else {
          logError('Failed to install concurrently');
          reject();
        }
      });
    });
  }

  // Start both servers using concurrently
  const concurrentlyCmd = [
    'concurrently',
    '--names', '"🔧 Backend,🎨 Frontend"',
    '--prefix-colors', '"yellow,blue"',
    '--kill-others-on-fail',
    '--restart-tries', '3',
    '"cd backend && npm run dev"',
    '"npm run dev"'
  ].join(' ');

  logSuccess('Starting both servers concurrently...');
  log('', 'reset');
  log('📱 Frontend: http://localhost:5173', 'green');
  log('🔧 Backend:  http://localhost:5000', 'green');
  log('📊 API Health: http://localhost:5000/api/health', 'green');
  log('', 'reset');
  log('💡 Press Ctrl+C to stop both servers', 'yellow');
  log('', 'reset');

  const servers = spawn(concurrentlyCmd, {
    stdio: 'inherit',
    shell: true
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('\n🛑 Shutting down servers...', 'yellow');
    servers.kill('SIGTERM');
    setTimeout(() => {
      log('👋 Servers shut down. Goodbye!', 'green');
      process.exit(0);
    }, 2000);
  });

  servers.on('close', (code) => {
    if (code !== 0) {
      logError(`Servers exited with code ${code}`);
    }
    process.exit(code);
  });
}

async function main() {
  try {
    logHeader();
    
    await checkPrerequisites();
    await setupEnvironment();
    await installDependencies();
    await populateDatabase();
    await startServers();
    
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
