#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify build process...');

try {
  // Check if we're in the right directory
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json not found. Are you in the right directory?');
  }

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm ci', { stdio: 'inherit' });

  // Run linting (optional, can be skipped if it fails)
  try {
    console.log('🔍 Running linter...');
    execSync('npm run lint', { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️ Linting failed, continuing build...');
  }

  // Build the application
  console.log('🏗️ Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Check if build output exists
  const buildOutputPath = path.join(process.cwd(), 'out');
  if (fs.existsSync(buildOutputPath)) {
    console.log('✅ Static export found in /out directory');
  } else {
    console.log('✅ Build completed successfully');
  }

  console.log('🎉 Build process completed successfully!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
