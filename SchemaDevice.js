import { ObjectId } from "mongodb";
import { model, Schema } from "mongoose";

const deviceSchema = new Schema(
  {
    userID: { type: String, required: true , ref: "UserModel"},
    deviceID: { type: String, required: true },
    String: { type: String, required: true },
    String: { type: String, required: true },
  },
  { versionKey: false, autoIndex: true }
);



export const BookModel = model("DeviceModel", deviceSchema);