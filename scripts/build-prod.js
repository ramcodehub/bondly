import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');

console.log('Starting production build process...');

// Ensure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Build frontend
console.log('Building frontend...');
process.chdir(frontendDir);
execSync('npm install', { stdio: 'inherit' });
execSync('npm run build', { stdio: 'inherit' });

// Ensure backend public directory exists
const publicDir = path.join(backendDir, 'public');
ensureDir(publicDir);

// Copy frontend build to backend public directory
console.log('Copying frontend build to backend...');
const distDir = path.join(frontendDir, 'dist');
const files = fs.readdirSync(distDir);

files.forEach(file => {
  const srcPath = path.join(distDir, file);
  const destPath = path.join(publicDir, file);
  
  if (fs.lstatSync(srcPath).isDirectory()) {
    // Copy directory recursively
    const copyRecursive = (src, dest) => {
      ensureDir(dest);
      const entries = fs.readdirSync(src);
      
      for (const entry of entries) {
        const srcPath = path.join(src, entry);
        const destPath = path.join(dest, entry);
        
        if (fs.lstatSync(srcPath).isDirectory()) {
          copyRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };
    
    copyRecursive(srcPath, destPath);
  } else {
    // Copy file
    fs.copyFileSync(srcPath, destPath);
  }
});

console.log('Production build completed successfully!');
