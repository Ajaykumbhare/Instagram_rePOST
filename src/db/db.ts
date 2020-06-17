import mongoose from "mongoose";
import env from "../env";

mongoose.set("useFindAndModify", false);

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export { connectDB };
