import { Schema, model, models } from "mongoose";

const complaintSchema = new Schema({
  name: String,
  email: String,
  company: String,
  job: String,
  companyEmail: String,
  companyPhone: String,
  phone: String,
  whats: String,
  message: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const Complaint = models.complaint || model("complaint", complaintSchema);

export default Complaint;
