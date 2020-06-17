import { connectDB } from "./db/db";
import { find, flatPosts, handleUplaod } from "./services/post";
// Connect Database
connectDB();

find().then((posts) => handleUplaod(posts.map(flatPosts)));

setTimeout(function () {
  process.exit(0);
}, 2 * 60 * 60 * 1000);
