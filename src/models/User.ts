import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  full_name: string;
  is_private: boolean;
  profile_pic_url?: string;
  is_verified: boolean;
  media_count: number;
  follower_count: number;
  following_count: number;
  biography: string;
  external_url?: string;
  is_business: boolean;
  timestamp: Date;
  status: Number;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  biography: { type: String },
  external_url: { type: String },
  follower_count: { type: Number },
  following_count: { type: Number },
  full_name: { type: String, required: true },
  is_business: { type: Boolean },
  is_private: { type: String, required: true },
  is_verified: { type: Boolean },
  media_count: { type: Number },
  profile_pic_url: { type: String },
  timestamp: { type: Date, default: Date.now },
  status: { type: Number, default: 0 },
});

export default mongoose.model<IUser>("User", UserSchema);
