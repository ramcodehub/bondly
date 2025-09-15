#!/usr/bin/env node

/**
 * Test Dist Files Locally Script
 * This script helps you test your built dist files locally before deploying to GoDaddy
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execPromise = promisify(exec);

async function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...\n');
  
  try {
    // Check if http-server is installed
    await execPromise('http-server --version');
    console.log('✅ http-server is installed');
    return 'http-server';
  } catch (error) {
    console.log('❌ http-server not found');
  }
  
  try {
    // Check if Python is installed
    await execPromise('python --version');
    console.log('✅ Python is installed');
    return 'python';
  } catch (error) {
    console.log('❌ Python not found');
  }
  
  try {
    // Check if Python3 is installed
    await execPromise('python3 --version');
    console.log('✅ Python3 is installed');
    return 'python3';
  } catch (error) {
    console.log('❌ Python3 not found');
  }
  
  console.log('\n⚠️  No local server option found. Installing http-server...\n');
  try {
    await execPromise('npm install -g http-server');
    console.log('✅ http-server installed successfully');
    return 'http-server';
  } catch (error) {
    console.error('❌ Failed to install http-server:', error.message);
    return null;
  }
}

async function checkDistFiles() {
  console.log('\n🔍 Checking dist files...\n');
  
  const distPath = path.join(__dirname, '..', 'dist');
  
  if (!fs.existsSync(distPath)) {
    console.error('❌ Dist folder not found. Please build your project first.');
    console.log('Run: npm run build:godaddy');
    return false;
  }
  
  const files = fs.readdirSync(distPath);
  
  // Check for essential files
  const essentialFiles = ['index.html', '.htaccess'];
  const missingFiles = [];
  
  essentialFiles.forEach(file => {
    if (!files.includes(file)) {
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length > 0) {
    console.warn(`⚠️  Missing essential files: ${missingFiles.join(', ')}`);
  } else {
    console.log('✅ Essential files present');
  }
  
  console.log(`\n📁 Dist folder contains ${files.length} files/directories`);
  console.log('Files:', files.filter(f => !f.startsWith('.')).slice(0, 10).join(', '));
  if (files.length > 10) {
    console.log(`... and ${files.length - 10} more files`);
  }
  
  return true;
}

async function startServer(serverType) {
  console.log(`\n🚀 Starting ${serverType} server...\n`);
  
  const distPath = path.join(__dirname, '..', 'dist');
  const port = 3000;
  
  try {
    let command;
    
    switch (serverType) {
      case 'http-server':
        command = `npx http-server "${distPath}" -p ${port} -o`;
        break;
      case 'python':
        command = `cd "${distPath}" && python -m http.server ${port}`;
        break;
      case 'python3':
        command = `cd "${distPath}" && python3 -m http.server ${port}`;
        break;
      default:
        throw new Error('Unsupported server type');
    }
    
    console.log(`Executing: ${command}\n`);
    console.log(`🌍 Server will be available at: http://localhost:${port}\n`);
    console.log('Press Ctrl+C to stop the server\n');
    
    const { stdout, stderr } = await execPromise(command, { cwd: distPath });
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
  } catch (error) {
    // This is expected as the server will keep running
    if (error.signal !== 'SIGINT') {
      console.error('Error starting server:', error.message);
    } else {
      console.log('\n👋 Server stopped');
    }
  }
}

async function main() {
  console.log('🧪 Bondly CRM - Dist Files Testing Script\n');
  console.log('==========================================\n');
  
  // Check dist files
  const distExists = await checkDistFiles();
  if (!distExists) {
    process.exit(1);
  }
  
  // Check prerequisites
  const serverType = await checkPrerequisites();
  if (!serverType) {
    console.error('\n❌ No server option available. Please install either http-server or Python.');
    process.exit(1);
  }
  
  // Ask user if they want to start the server
  console.log('\n❓ Do you want to start a local server to test your dist files?');
  console.log('   This will open your default browser to http://localhost:3000');
  
  // For now, we'll just show instructions since we can't get user input in this script
  console.log('\n📋 To start testing, run one of these commands in your terminal:');
  console.log('   cd frontend/dist && npx http-server -p 3000');
  console.log('   cd frontend/dist && python -m http.server 3000');
  console.log('   cd frontend/dist && python3 -m http.server 3000');
  
  console.log('\n✅ Testing preparation complete!');
  console.log('Follow the instructions above to test your dist files locally.');
}

main().catch(console.error);