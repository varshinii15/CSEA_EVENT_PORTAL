import mongoose from 'mongoose';

const playerAnswersSchema = new mongoose.Schema(
  {
    name:{type:String,required:true,trim:true},
    email: { type: String, required: true, lowercase: true, trim: true },
    year: { type: Number, required: true, enum: [1, 2] },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'roundonemodel.js', required: true },
    userAnswer: { type: String, required: true, trim: true, lowercase: true },
    isCorrect: { type: Boolean, default: false },
    round: { type: String, required: true, enum: ['roundone'], default: 'roundone' },
    attemptedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

playerAnswersSchema.index({ name: 1, questionId: 1, round: 1 }, { unique: true });

const PlayerAnswers = mongoose.model('PlayerAnswers', playerAnswersSchema);

export default PlayerAnswers;
