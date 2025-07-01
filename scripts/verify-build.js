#!/usr/bin/env node

/**
 * Build verification script to ensure the package builds correctly
 * and can be imported without module resolution errors.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verifying gravyjs build...\n');

// Check if dist directory exists
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Error: dist directory not found. Run npm run build first.');
  process.exit(1);
}

// Check required files exist
const requiredFiles = [
  'dist/index.js',
  'dist/index.es.js',
  'dist/index.d.ts',
  'dist/index.css'
];

let fileCheckPassed = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} missing`);
    fileCheckPassed = false;
  }
});

if (!fileCheckPassed) {
  console.error('\n❌ Build verification failed: Missing required files');
  process.exit(1);
}

console.log('\n📦 Checking package.json configuration...');

// Read package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
);

// Verify package.json doesn't have "type": "module" for CommonJS compatibility
if (packageJson.type === 'module') {
  console.error('❌ Error: package.json has "type": "module" which conflicts with CommonJS output');
  console.error('   Remove "type": "module" from package.json to fix CommonJS compatibility');
  process.exit(1);
} else {
  console.log('✅ package.json CommonJS compatibility verified');
}

// Check main and module fields
if (packageJson.main !== 'dist/index.js') {
  console.error('❌ Error: package.json "main" field should be "dist/index.js"');
  process.exit(1);
}

if (packageJson.module !== 'dist/index.es.js') {
  console.error('❌ Error: package.json "module" field should be "dist/index.es.js"');
  process.exit(1);
}

console.log('✅ package.json entry points verified');

// Test CommonJS import
console.log('\n🧪 Testing CommonJS import...');
try {
  const testScript = `
    try {
      const module = require('${path.join(__dirname, '..', 'dist', 'index.js')}');
      // Check for either default export or named export
      const GravyJS = module.default || module;
      if (!GravyJS) {
        throw new Error('GravyJS export not found');
      }
      console.log('✅ CommonJS import successful');
    } catch (error) {
      console.error('❌ CommonJS import failed:', error.message);
      if (error.stack) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  `;
  execSync(`node -e "${testScript}"`, { stdio: 'inherit' });
} catch (error) {
  console.error('❌ CommonJS import test failed');
  process.exit(1);
}

// Test ES Module import (in a separate process)
console.log('\n🧪 Testing ES Module import...');
try {
  const esmTestFile = path.join(__dirname, 'test-esm.mjs');
  const esmTestContent = `
import GravyJS from '${path.join(__dirname, '..', 'dist', 'index.es.js')}';
if (!GravyJS) {
  throw new Error('GravyJS ES module export not found');
}
console.log('✅ ES Module import successful');
`;
  fs.writeFileSync(esmTestFile, esmTestContent);
  execSync(`node ${esmTestFile}`, { stdio: 'inherit' });
  fs.unlinkSync(esmTestFile);
} catch (error) {
  console.error('❌ ES Module import test failed');
  process.exit(1);
}

// Check for problematic require() statements in ES module build
console.log('\n🔍 Checking for CommonJS syntax in ES module build...');
const esModuleContent = fs.readFileSync(
  path.join(__dirname, '..', 'dist', 'index.es.js'),
  'utf8'
);

// Look for require() calls that might cause issues
const requirePattern = /require\s*\(\s*['"][^'"]+['"]\s*\)/g;
const requireMatches = esModuleContent.match(requirePattern) || [];

if (requireMatches.length > 0) {
  console.warn('⚠️  Warning: Found require() statements in ES module build:');
  const uniqueRequires = [...new Set(requireMatches)];
  uniqueRequires.slice(0, 5).forEach(match => {
    console.warn(`   ${match}`);
  });
  if (uniqueRequires.length > 5) {
    console.warn(`   ... and ${uniqueRequires.length - 5} more`);
  }
  console.warn('\n   This might cause issues when imported as an ES module.');
  console.warn('   Consider updating build configuration to handle these dependencies.\n');
}

console.log('\n✅ Build verification completed successfully!');