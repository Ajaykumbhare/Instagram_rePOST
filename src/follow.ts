import { connectDB } from "./db/db";
import { follow } from "./services/services";
import { findFollowers } from "./services/post";
import env from "./env";
// Connect Database
connectDB();

findFollowers().then((users) =>
  users.map((user) => follow("./cookie.json", user.username))
);

setTimeout(function () {
  process.exit(0);
}, env.FOLLOWINTERVAL * 60 * 60 * 1000);
