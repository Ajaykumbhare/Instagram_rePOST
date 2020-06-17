import { connectDB } from "./db/db";
import { saveTodayPosts } from "./services/collectors";

// Connect Database
connectDB();

saveTodayPosts()
  .then(() => console.log("Saved Posts"))
  .catch((e) => console.log(e));

setTimeout(function () {
  process.exit(0);
}, 12 * 60 * 60 * 1000);
