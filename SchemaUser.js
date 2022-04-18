import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    userID: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
  },
  { versionKey: false, autoIndex: true }
);

export const AuthorModel = model("UserModel", userSchema);