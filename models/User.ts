import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  username: String,
  password: String,
  role: String,
});

const User = models.user || model("user", userSchema);

export default User;
