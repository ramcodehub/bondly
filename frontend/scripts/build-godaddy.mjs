import { execSync } from 'child_process';
import { existsSync, renameSync, copyFileSync, cpSync } from 'fs';
import { chdir } from 'process';
import { resolve } from 'path';

console.log('Starting GoDaddy build process...');

try {
  // Get the current directory
  const currentDir = process.cwd();
  console.log('Current directory:', currentDir);
  
  // Backup the original config
  const originalConfigPath = resolve(currentDir, 'next.config.mjs');
  const backupConfigPath = resolve(currentDir, 'next.config.mjs.backup');
  const godaddyConfigPath = resolve(currentDir, 'next.config.godaddy.mjs');
  
  if (existsSync(originalConfigPath)) {
    console.log('Backing up original next.config.mjs...');
    copyFileSync(originalConfigPath, backupConfigPath);
  }

  // Copy the GoDaddy config to the main config file
  if (existsSync(godaddyConfigPath)) {
    console.log('Using GoDaddy configuration...');
    copyFileSync(godaddyConfigPath, originalConfigPath);
  }

  // Run the build
  console.log('Running Next.js build...');
  execSync('npx next build', { stdio: 'inherit' });

  // Copy public files to the output directory
  console.log('Copying public files to output directory...');
  const outputPath = resolve(currentDir, '.next/server/app');
  if (existsSync(outputPath)) {
    cpSync(resolve(currentDir, 'public'), outputPath, { recursive: true });
  }

  // Note: We don't run next export because we're using App Router
  // The static files will be generated during the build process with output: 'export'

  // Restore the original config
  if (existsSync(backupConfigPath)) {
    console.log('Restoring original configuration...');
    renameSync(backupConfigPath, originalConfigPath);
  }

  console.log('GoDaddy build completed successfully!');
  console.log('The static files are available in the ".next/server/app" directory.');
  console.log('For deployment to GoDaddy, you will need to configure your server to serve these files.');
} catch (error) {
  // Restore the original config in case of error
  const currentDir = process.cwd();
  const originalConfigPath = resolve(currentDir, 'next.config.mjs');
  const backupConfigPath = resolve(currentDir, 'next.config.mjs.backup');
  
  if (existsSync(backupConfigPath)) {
    console.log('Restoring original configuration due to error...');
    renameSync(backupConfigPath, originalConfigPath);
  }
  
  console.error('Build failed:', error.message);
  process.exit(1);
}