const common = [
  '--format progress',
  '--parallel 1',
  '--require-module ts-node/register',
  '--require ./features/bootstrap/**/*.ts',
  '--require ./features/step_definitions/**/*.ts',
  '--require ./feature/bootstrap/**/*.ts',
  '--require ./feature/step_definitions/**/*.ts',
  '--publish-quiet',
  '--exit',
].join(' ');

module.exports = {
  default: common,
};
