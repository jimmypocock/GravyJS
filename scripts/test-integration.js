#!/usr/bin/env node

/**
 * Integration test to verify gravyjs can be imported in a Next.js-like environment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const testDir = path.join(__dirname, '..', 'test-integration');
const packagePath = path.join(__dirname, '..');

console.log('🧪 Setting up integration test environment...\n');

// Create test directory
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Create a minimal package.json for the test
const testPackageJson = {
  "name": "gravyjs-integration-test",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
};

fs.writeFileSync(
  path.join(testDir, 'package.json'),
  JSON.stringify(testPackageJson, null, 2)
);

// Create test file that mimics Next.js import
const testFile = `
const React = require('react');
const ReactDOM = require('react-dom');

console.log('Testing gravyjs import...');

try {
  // Test CommonJS require
  const GravyJS = require('${packagePath}');
  console.log('✅ CommonJS require succeeded');
  
  // Test if it's a valid React component
  if (typeof GravyJS.default !== 'function') {
    throw new Error('GravyJS.default is not a function');
  }
  
  // Try to create element (won't render, just checking it doesn't throw)
  const element = React.createElement(GravyJS.default, { ref: React.createRef() });
  console.log('✅ React element creation succeeded');
  
} catch (error) {
  console.error('❌ Import test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}

console.log('\\n✅ All integration tests passed!');
`;

fs.writeFileSync(path.join(testDir, 'test.js'), testFile);

// Install dependencies
console.log('📦 Installing test dependencies...');
execSync('npm install', { cwd: testDir, stdio: 'inherit' });

// Run the test
console.log('\n🚀 Running integration test...\n');
try {
  execSync('node test.js', { cwd: testDir, stdio: 'inherit' });
} catch (error) {
  console.error('\n❌ Integration test failed');
  process.exit(1);
} finally {
  // Cleanup
  console.log('\n🧹 Cleaning up...');
  fs.rmSync(testDir, { recursive: true, force: true });
}

console.log('\n✅ Integration test completed successfully!');