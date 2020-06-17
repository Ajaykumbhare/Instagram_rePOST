const seconds = (min: number, max: number): number =>
  Math.floor(Math.random() * (max * 1000 - min * 1000 + 1)) + min * 1000;

export default seconds;
