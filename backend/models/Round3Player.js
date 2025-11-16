import mongoose from "mongoose";

const round3PlayerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  year: { type: Number, required: true },
  answered: { type: Boolean, default: false }
});

export default mongoose.model("Round3Player", round3PlayerSchema);
