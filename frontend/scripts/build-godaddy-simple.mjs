import { execSync } from 'child_process';
import { existsSync, renameSync, copyFileSync, cpSync, mkdirSync } from 'fs';
import { resolve } from 'path';

console.log('Starting GoDaddy build process...');

// Get the current directory (should be the frontend directory)
const projectRoot = process.cwd();
console.log('Project root:', projectRoot);

try {
  // Define file paths
  const originalConfig = resolve(projectRoot, 'next.config.mjs');
  const backupConfig = resolve(projectRoot, 'next.config.mjs.backup');
  const godaddyConfig = resolve(projectRoot, 'next.config.godaddy.mjs');
  const publicDir = resolve(projectRoot, 'public');
  const outputDir = resolve(projectRoot, '.next/server/app');
  const distZip = resolve(projectRoot, 'dist.zip');

  // Backup the original config
  if (existsSync(originalConfig)) {
    console.log('Backing up original next.config.mjs...');
    copyFileSync(originalConfig, backupConfig);
  }

  // Copy the GoDaddy config to the main config file
  if (existsSync(godaddyConfig)) {
    console.log('Using GoDaddy configuration...');
    copyFileSync(godaddyConfig, originalConfig);
  }

  // Run the build
  console.log('Running Next.js build...');
  execSync('npx next build', { stdio: 'inherit' });

  // Copy public files to the output directory
  console.log('Copying public files to output directory...');
  if (existsSync(outputDir) && existsSync(publicDir)) {
    cpSync(publicDir, outputDir, { recursive: true });
    console.log('Public files copied successfully');
  } else {
    console.log('Warning: Could not copy public files');
  }

  console.log('GoDaddy build completed successfully!');
  console.log('Files are available in:', outputDir);
  console.log('To deploy to GoDaddy:');
  console.log('1. Upload all files from .next/server/app to your GoDaddy root directory');
  console.log('2. Ensure .htaccess is in the root directory');
  console.log('3. Set environment variables in GoDaddy control panel');

  // Restore the original config
  if (existsSync(backupConfig)) {
    console.log('Restoring original configuration...');
    renameSync(backupConfig, originalConfig);
  }
} catch (error) {
  console.error('Build failed:', error.message);
  
  // Restore the original config in case of error
  const projectRoot = process.cwd();
  const originalConfig = resolve(projectRoot, 'next.config.mjs');
  const backupConfig = resolve(projectRoot, 'next.config.mjs.backup');
  
  if (existsSync(backupConfig)) {
    console.log('Restoring original configuration due to error...');
    renameSync(backupConfig, originalConfig);
  }
  
  process.exit(1);
}