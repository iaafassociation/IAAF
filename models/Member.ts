import { Schema, model, models } from "mongoose";

const memberSchema = new Schema({
  nameAR: String,
  nameEN: String,
  image: String,
  role: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const Member = models.member || model("member", memberSchema);

export default Member;
