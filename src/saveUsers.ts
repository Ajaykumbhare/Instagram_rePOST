import { connectDB } from "./db/db";
import { saveTodayPosts } from "./services/collectors";
import env from "./env";

// Connect Database
connectDB();

saveTodayPosts()
  .then(() => console.log("Saved Posts"))
  .catch((e) => console.log(e));

setTimeout(function () {
  process.exit(0);
}, env.POSTINTERVAL * 2 * 60 * 60 * 1000);
