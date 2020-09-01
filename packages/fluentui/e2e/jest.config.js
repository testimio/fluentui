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
  reporters: [['@testim/root-cause-jest/lib/reporter/default', { runId }]],
  globals: {
    runId,
  },
};
