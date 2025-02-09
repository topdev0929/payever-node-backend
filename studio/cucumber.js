const args = [
  '--format progress',
  '--parallel 1',
  '--require-module ts-node/register',
  '--require ./features/bootstrap/**/*.ts',
  '--exit',
];

module.exports = {
  default: args.join(" ")
};
