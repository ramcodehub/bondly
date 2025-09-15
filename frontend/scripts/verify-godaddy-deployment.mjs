import { existsSync, readdirSync } from 'fs';
import { resolve } from 'path';

console.log('GoDaddy Deployment Verification Script');
console.log('=====================================');

// Check if we're in the right directory
const projectRoot = process.cwd();
console.log('Current directory:', projectRoot);

// Check for essential files and directories
const essentialPaths = [
  'public/.htaccess',
  'next.config.godaddy.mjs',
  'src/app',
  'src/pages'
];

console.log('\nChecking essential files:');
essentialPaths.forEach(path => {
  const fullPath = resolve(projectRoot, path);
  const exists = existsSync(fullPath);
  console.log(`  ${path}: ${exists ? '✓ Found' : '✗ Missing'}`);
});

// Check if dist.zip exists
const distZipPath = resolve(projectRoot, 'dist.zip');
const hasDistZip = existsSync(distZipPath);
console.log(`\n  dist.zip: ${hasDistZip ? '✓ Found' : '✗ Missing'}`);
if (hasDistZip) {
  const stats = require('fs').statSync(distZipPath);
  console.log(`    Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

// Check build scripts
const packageJsonPath = resolve(projectRoot, 'package.json');
if (existsSync(packageJsonPath)) {
  const packageJson = require(packageJsonPath);
  console.log('\nAvailable build scripts:');
  Object.keys(packageJson.scripts || {}).filter(script => script.includes('godaddy')).forEach(script => {
    console.log(`  ${script}: ${packageJson.scripts[script]}`);
  });
}

// Check .next directory
const nextDir = resolve(projectRoot, '.next');
if (existsSync(nextDir)) {
  console.log('\n.next directory exists');
  try {
    const files = readdirSync(nextDir);
    console.log(`  Contents: ${files.join(', ')}`);
  } catch (e) {
    console.log('  Could not read .next directory contents');
  }
} else {
  console.log('\n.next directory does not exist (this is normal before building)');
}

console.log('\nDeployment Instructions:');
console.log('1. If dist.zip exists and is recent, extract it and upload to GoDaddy');
console.log('2. If dist.zip is missing or old, run: npm run build:godaddy:simple');
console.log('3. Upload contents of .next/server/app to GoDaddy root directory');
console.log('4. Ensure .htaccess is in the root directory');
console.log('5. Set environment variables in GoDaddy control panel');