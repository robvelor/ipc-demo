const cp = require('child_process');
const {
  sleep,
  getRandomBetween,
  ONE_SECOND,
  SIXTY_SECONDS,
} = require('./helpers');

const pid = process.pid;

let childProcesses;
const ONE_AND_SIXTY_SECONDS = { min: ONE_SECOND, max: SIXTY_SECONDS };

process.on('exit', code => {
  console.log(`[${pid}] parent process exiting with`, code);
});

const getWorkerProcessForkParams = () => ({
  module: `${__dirname}/worker`,
  args: [],
  options: { stdio: [0, 1, 2, 'ipc'] },
});

const getArgs = argv => {
  const [, , ...args] = argv;
  const [totalChildProcesses = 10] = args;

  return {
    totalChildProcesses: parseInt(totalChildProcesses),
  };
};

const main = async argv => {
  const { totalChildProcesses } = getArgs(argv);

  console.log(
    `[${pid}] parent process forking`,
    totalChildProcesses,
    'processes',
  );

  const { module, args, options } = getWorkerProcessForkParams();
  // fork the child processes
  childProcesses = [...Array(totalChildProcesses)].map(() =>
    cp.fork(module, args, options),
  );

  // send exit command to child processes after simulating some work done
  await Promise.all(
    childProcesses.map(async childProcess => {
      const processTime = getRandomBetween(ONE_AND_SIXTY_SECONDS);
      console.log(
        `[${childProcess.pid}] processing for`,
        parseInt(processTime / ONE_SECOND),
        'seconds',
      );

      // simulate process time and when done send the exit message through the ipc channel
      await sleep(processTime);
      childProcess.send({ exit: true });
    }),
  );
};

main(process.argv)
  .then(async () => {
    await sleep(ONE_SECOND);
    console.log(`[${pid}] all child processes have exited`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
