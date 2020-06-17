import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface ISkipped extends Document {
  user: IUser["_id"];
  code: string;
  status: number;
  timestamp: Date;
}

const SkippedSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  code: { type: String, required: true, unique: true },
  status: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<ISkipped>("Skipped", SkippedSchema);
