#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-deployment checks...\n');

const checks = [
  {
    name: 'Package.json exists',
    check: () => fs.existsSync('package.json'),
    fix: 'Make sure you are in the correct directory'
  },
  {
    name: 'Next.js config exists',
    check: () => fs.existsSync('next.config.mjs'),
    fix: 'Create next.config.mjs file'
  },
  {
    name: 'Netlify config exists',
    check: () => fs.existsSync('netlify.toml'),
    fix: 'Create netlify.toml file'
  },
  {
    name: 'Environment example exists',
    check: () => fs.existsSync('.env.example'),
    fix: 'Create .env.example file'
  },
  {
    name: 'Source directory exists',
    check: () => fs.existsSync('src'),
    fix: 'Make sure src directory exists'
  },
  {
    name: 'App directory exists',
    check: () => fs.existsSync('src/app'),
    fix: 'Make sure src/app directory exists'
  },
  {
    name: 'Business dashboard exists',
    check: () => fs.existsSync('src/app/(main)/dashboard/business'),
    fix: 'Make sure business dashboard is created'
  },
  {
    name: 'Static export configuration',
    check: () => {
      try {
        const config = fs.readFileSync('next.config.mjs', 'utf8');
        return config.includes("output: 'export'");
      } catch {
        return false;
      }
    },
    fix: 'Add output: "export" to next.config.mjs'
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  console.log(`${index + 1}. ${status} ${check.name}`);
  
  if (!passed) {
    console.log(`   💡 Fix: ${check.fix}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 All checks passed! Ready for deployment.');
  console.log('\nNext steps:');
  console.log('1. git add .');
  console.log('2. git commit -m "Configure for Netlify deployment"');
  console.log('3. git push origin main');
  console.log('4. Create site on Netlify');
  console.log('5. Set environment variables');
} else {
  console.log('❌ Some checks failed. Please fix the issues above.');
  process.exit(1);
}

console.log('\n📚 See DEPLOYMENT.md for detailed instructions.');
console.log('⚡ See QUICK_DEPLOY.md for quick setup guide.');
