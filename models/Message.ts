import { Schema, model, models } from "mongoose";

const messageSchema = new Schema({
  name: String,
  email: String,
  reason: String,
  phone: String,
  message: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const Message = models.message || model("message", messageSchema);

export default Message;
