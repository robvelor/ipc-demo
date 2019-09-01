const ONE_SECOND = 1000; // milliseconds
const SIXTY_SECONDS = ONE_SECOND * 60; // milliseconds

const sleep = (delay = ONE_SECOND) =>
  new Promise(resolve => {
    setTimeout(() => resolve(), delay);
  });

const getRandomBetween = ({ min = 1, max = 100 }) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  sleep,
  getRandomBetween,
  ONE_SECOND,
  SIXTY_SECONDS,
};
