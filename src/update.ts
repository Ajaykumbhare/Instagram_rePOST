import { connectDB } from "./db/db";
import { updateProfile } from "./services/collectors";

// Connect Database
connectDB();

updateProfile()
  .then(() => console.log("profiles updated"))
  .catch((e) => console.log(e));

setTimeout(function () {
  process.exit(0);
}, 24 * 7 * 60 * 60 * 1000);
