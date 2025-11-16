import mongoose from "mongoose";

const round3AnswerSchema = new mongoose.Schema({
  answer: {
    type: String, // array of strings like ["ABCD", "1234"]
    required: true,
  },
  yr: {
    type: Number, // 1 or 2
    required: true,
    enum: [1, 2], // only allows 1 or 2
    unique: true, // only one per year
  },
});

const Round3Answer = mongoose.model("Round3Answer", round3AnswerSchema);

export default Round3Answer;
