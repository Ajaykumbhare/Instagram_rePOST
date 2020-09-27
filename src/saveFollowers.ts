import { connectDB } from "./db/db";
import { saveFollowers } from "./services/collectors";
import env from "./env";

// Connect Database
connectDB();

saveFollowers()
  .then(() => console.log("Saved followers"))
  .catch((e) => console.log(e));

setTimeout(function () {
  process.exit(0);
}, (env.FOLLOWINTERVAL - 1) * 60 * 60 * 1000);
