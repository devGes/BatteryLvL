import { ObjectId } from "mongodb";
import { model, Schema } from "mongoose";

const deviceSchema = new Schema(
  {
    userID: { type: String, required: true , ref: "UserModel"},
    deviceLocation      : { type: String, required: true },
    currentBatteryStart : { type: Date, required: true },
    prevBatteryData     : { type: [[Date]] },
  },
  { versionKey: false, autoIndex: true }
);



export const DeviceModel = model("DeviceModel", deviceSchema);