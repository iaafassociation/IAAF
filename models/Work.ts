import { Schema, model, models } from "mongoose";

const workSchema = new Schema({
  name: String,
  bDate: String,
  education: String,
  job: String,
  college: String,
  university: String,
  gradYear: String,
  address: String,
  military: String,
  phone: String,
  email: String,
  experience: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const Work = models.work || model("work", workSchema);

export default Work;
