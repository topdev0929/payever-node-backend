const common = [
  '--format progress',
  '--parallel 1',
  '--require-module ts-node/register',
  '--require ./features/bootstrap/**/*.ts',
  '--require ./features/step_definitions/**/*.ts',
  '--exit',
].join(' ');

module.exports = {
  default: common,
};
