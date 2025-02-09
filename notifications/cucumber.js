const common = [
  '--format progress',
  '--parallel 1',
  '--require-module ts-node/register/transpile-only',
  '--require ./features/bootstrap/**/*.ts',
  '--publish-quiet',
  '--exit'
].join(' ');

module.exports = {
  default: common,
};
