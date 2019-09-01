const { sleep, ONE_SECOND } = require('./helpers');

const pid = process.pid;

let shouldExit = false;

process.on('message', msg => {
  console.log(`[${pid}] message from parent`, msg);
  const { exit } = msg || {};
  shouldExit = !!exit;
});

process.on('exit', code => {
  console.log(`[${pid}] child process exiting with`, code);
});

const main = async () => {
  while (!shouldExit) {
    await sleep(ONE_SECOND);
  }
};

main(process.argv)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
