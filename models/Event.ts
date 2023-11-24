import { Schema, model, models } from "mongoose";

const eventSchema = new Schema({
  titleAR: String,
  descriptionAR: String,
  titleEN: String,
  descriptionEN: String,
  date: String,
  image: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const Event = models.event || model("event", eventSchema);

export default Event;
