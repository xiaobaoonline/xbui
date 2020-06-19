const base = require('../../jest.config');

module.exports = {
  ...base,
  name: 'XBFilter',
  displayName: 'XBFilter',
  preset: '@vue/cli-plugin-unit-jest',
  // transformIgnorePatterns: ['node_modules/(?!(@xb)/)'],
  setupFiles: ['./tests/setup.ts'],
};
