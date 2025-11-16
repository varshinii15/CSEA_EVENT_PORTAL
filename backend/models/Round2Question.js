import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
    trim: true
  },
  expectedOutput: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const debugQuestionSchema = new mongoose.Schema({
  lang: {
    type: String,
    required: true,
    enum: ['python', 'c'],
    trim: true
  },
  buggycode: {
    type: String,
    required: true,
    trim: true
  },
  crctcode: {
    type: String,
    required: true,
    trim: true
  },
  yr: {
    type: Number,
    required: true,
    enum: [1, 2]
  },
  test_cases: {
    type: [testCaseSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one test case is required'
    }
  },
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Round2Question = mongoose.model('Round2Question', debugQuestionSchema);

export default Round2Question;

