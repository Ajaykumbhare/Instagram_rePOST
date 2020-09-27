import { connectDB } from "./db/db";
import { find, flatPosts, handleUplaod } from "./services/post";
import env from "./env";

// Connect Database
connectDB();

find().then((posts) => handleUplaod(posts.map(flatPosts)));

setTimeout(function () {
  process.exit(0);
}, env.POSTINTERVAL * 60 * 60 * 1000);
