#!/usr/bin/env node

/**
 * Haat Platform Development Server Launcher
 * 
 * This script starts both the frontend and backend servers concurrently
 * for development purposes.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  if (!fs.existsSync(filePath)) {
    log(`❌ ${description} not found at: ${filePath}`, 'red');
    return false;
  }
  return true;
}

function checkEnvironment() {
  log('🔍 Checking environment setup...', 'blue');
  
  const checks = [
    checkFile('package.json', 'Frontend package.json'),
    checkFile('backend/package.json', 'Backend package.json'),
    checkFile('backend/.env', 'Backend environment file')
  ];
  
  if (!checks.every(Boolean)) {
    log('❌ Environment check failed. Please ensure all required files exist.', 'red');
    process.exit(1);
  }
  
  log('✅ Environment check passed!', 'green');
}

function startServer(name, command, cwd, color) {
  log(`🚀 Starting ${name}...`, color);
  
  const child = spawn(command, { 
    shell: true, 
    stdio: 'pipe',
    cwd: cwd 
  });
  
  child.stdout.on('data', (data) => {
    const message = data.toString().trim();
    if (message) {
      log(`[${name}] ${message}`, color);
    }
  });
  
  child.stderr.on('data', (data) => {
    const message = data.toString().trim();
    if (message && !message.includes('Warning')) {
      log(`[${name}] ${message}`, 'red');
    }
  });
  
  child.on('error', (error) => {
    log(`❌ ${name} failed to start: ${error.message}`, 'red');
  });
  
  child.on('close', (code) => {
    if (code !== 0) {
      log(`❌ ${name} exited with code ${code}`, 'red');
    } else {
      log(`✅ ${name} shut down gracefully`, 'green');
    }
  });
  
  return child;
}

function main() {
  log('🎯 Haat Platform Development Server', 'cyan');
  log('===================================', 'cyan');
  
  checkEnvironment();
  
  // Start backend server
  const backendProcess = startServer(
    'Backend',
    'npm run dev',
    path.join(__dirname, 'backend'),
    'yellow'
  );
  
  // Wait a moment for backend to start
  setTimeout(() => {
    // Start frontend server
    const frontendProcess = startServer(
      'Frontend',
      'npm run dev',
      __dirname,
      'blue'
    );
    
    // Handle process termination
    function cleanup() {
      log('\n🛑 Shutting down servers...', 'yellow');
      
      if (backendProcess) {
        backendProcess.kill('SIGTERM');
      }
      
      if (frontendProcess) {
        frontendProcess.kill('SIGTERM');
      }
      
      setTimeout(() => {
        log('👋 Servers shut down. Goodbye!', 'green');
        process.exit(0);
      }, 2000);
    }
    
    // Listen for termination signals
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
    // Show access URLs after both servers likely started
    setTimeout(() => {
      log('\n🌐 Access URLs:', 'cyan');
      log('   Frontend: http://localhost:5173', 'green');
      log('   Backend:  http://localhost:5000', 'green');
      log('   API Docs: http://localhost:5000/api/health', 'green');
      log('\n💡 Press Ctrl+C to stop both servers', 'yellow');
    }, 5000);
    
  }, 3000);
}

// Run the script
if (require.main === module) {
  main();
}
