module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'refactor', 'test', 'docs', 'perf', 'ci', 'revert'],
    ],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-max-length': [2, 'always', 72],
  },
};
