#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🧪 Running Card Persistence Tests...\n');

const jest = spawn('npx', ['jest', '--verbose'], {
  stdio: 'inherit',
  shell: true
});

jest.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ All tests passed!');
  } else {
    console.log('\n❌ Some tests failed.');
    process.exit(code);
  }
});