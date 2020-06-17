import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface UserFeedResponseImage_versions2 {
  candidates: UserFeedResponseCandidatesItem[];
}

export interface UserFeedResponseCandidatesItem {
  width: number;
  height: number;
  url: string;
}

export interface CarouselMedia {
  media_type: number;
  image_versions2: UserFeedResponseImage_versions2[];
  video_versions?: string | null;
}

export interface IPost extends Document {
  user: IUser["_id"];
  code: string;
  media_type: number;
  image_versions2: UserFeedResponseImage_versions2[];
  video_versions?: string | null;
  caption: string | null;
  carousel_media: CarouselMedia[];
  status: number;
  timestamp: Date;
}

const PostSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  code: { type: String, required: true, unique: true },
  media_type: { type: Number, required: true },
  image_versions2: { type: Array, default: [] },
  video_versions: { type: String },
  caption: { type: String },
  carousel_media: { type: Array, default: [] },
  status: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IPost>("Post", PostSchema);
