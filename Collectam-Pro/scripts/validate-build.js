#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating build output...\n');

const requiredFiles = [
  'out/index.html',
  'out/_next',
  'out/auth/v2/login.html',
  'out/dashboard/business.html',
  'out/business-pricing.html'
];

const requiredDirs = [
  'out',
  'out/_next/static',
  'out/dashboard',
  'out/auth'
];

let allValid = true;

// Check directories
console.log('📁 Checking directories...');
requiredDirs.forEach(dir => {
  const exists = fs.existsSync(dir);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${dir}`);
  if (!exists) allValid = false;
});

console.log('\n📄 Checking files...');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file}`);
  if (!exists) allValid = false;
});

// Check file sizes
console.log('\n📊 Checking file sizes...');
try {
  const stats = fs.statSync('out');
  if (stats.isDirectory()) {
    const files = getAllFiles('out');
    const totalSize = files.reduce((sum, file) => {
      try {
        return sum + fs.statSync(file).size;
      } catch {
        return sum;
      }
    }, 0);
    
    const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
    console.log(`📦 Total build size: ${sizeMB} MB`);
    
    if (totalSize > 100 * 1024 * 1024) { // 100MB
      console.log('⚠️  Build size is quite large (>100MB)');
    }
  }
} catch (error) {
  console.log('❌ Could not calculate build size');
  allValid = false;
}

// Check for common issues
console.log('\n🔍 Checking for common issues...');

// Check for API calls in static files
try {
  const indexContent = fs.readFileSync('out/index.html', 'utf8');
  if (indexContent.includes('localhost:5000')) {
    console.log('⚠️  Found localhost references in build');
  } else {
    console.log('✅ No localhost references found');
  }
} catch {
  console.log('❌ Could not read index.html');
  allValid = false;
}

console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('🎉 Build validation passed!');
  console.log('\n📤 Ready for deployment:');
  console.log('1. Upload /out directory to Netlify');
  console.log('2. Configure environment variables');
  console.log('3. Test production URLs');
} else {
  console.log('❌ Build validation failed!');
  console.log('Please fix the issues above before deploying.');
  process.exit(1);
}

function getAllFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  });
  
  return files;
}
