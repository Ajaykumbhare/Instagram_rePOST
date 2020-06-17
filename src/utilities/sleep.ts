import Bluebird from "bluebird";

const sleep = (t: number) => new Bluebird((r) => setTimeout(r, t));

export default sleep;
