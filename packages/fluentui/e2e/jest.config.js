const commonConfig = require('@uifabric/build/jest');

const runId = Date.now().toString();

module.exports = {
  ...commonConfig,
  moduleNameMapper: require('lerna-alias').jest({
    directory: require('@uifabric/build/monorepo/findGitRoot')(),
  }),
  name: 'e2e',
  testRegex: '.*-test\\.tsx?$',
  setupFilesAfterEnv: ['./setup.test.ts'],
  reporters: ['default', ['@testim/screenplay/src/jest/reporter/RunConclusion.js', { runId }]],
  globals: {
    runId,
  },
};
