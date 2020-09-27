import mongoose, { Schema, Document } from "mongoose";

export interface IFollow extends Document {
  username: string;
  full_name: string;
  follower_count: number;
  following_count: number;
  timestamp: Date;
  status: boolean;
}

const followSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  full_name: { type: String },
  timestamp: { type: Date, default: Date.now },
  status: { type: Boolean, default: false },
});

export default mongoose.model<IFollow>("Follow", followSchema);
