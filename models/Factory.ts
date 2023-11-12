import { Schema, model, models } from "mongoose";

const factorySchema = new Schema({
  nameAR: String,
  typeAR: String,
  descriptionAR: String,
  nameEN: String,
  typeEN: String,
  descriptionEN: String,
  images: [String],
  email: String,
  phone: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const Factory = models.factory || model("factory", factorySchema);

export default Factory;
