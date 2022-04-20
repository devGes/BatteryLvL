import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName:   {type: [String], required: true },
    email:      {type: String,   required: true },
    deviceIDs:  {type: [String]},
    userCreated:{type: Date}
  }
);

export const UserModel = model("UserModel", userSchema);