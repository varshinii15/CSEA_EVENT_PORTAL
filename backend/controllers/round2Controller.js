import Round2Question from '../models/Round2Question.js';
import mongoose from 'mongoose';

// POST /api/v1/round2/questions/:lang
export const createQuestion = async (req, res) => {
  try {
    const { lang } = req.params;
    const { buggycode, crctcode, yr, test_cases, title, description } = req.body;

    // Validate required fields
    if (!buggycode || !crctcode || !yr || !test_cases || !Array.isArray(test_cases) || test_cases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: buggycode, crctcode, yr, and test_cases (non-empty array) are required'
      });
    }

    // Validate language matches
    if (lang !== 'python' && lang !== 'c') {
      return res.status(400).json({
        success: false,
        message: 'Invalid language. Must be "python" or "c"'
      });
    }

    // Validate year
    if (yr !== 1 && yr !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Invalid year. Must be 1 or 2'
      });
    }

    // Validate test cases structure
    for (const testCase of test_cases) {
      if (!testCase.input || !testCase.expectedOutput) {
        return res.status(400).json({
          success: false,
          message: 'Each test case must have both input and expectedOutput'
        });
      }
    }

    // Create new question
    const newQuestion = new Round2Question({
      lang,
      buggycode,
      crctcode,
      yr,
      test_cases,
      title: title || undefined,
      description: description || undefined
    });

    const savedQuestion = await newQuestion.save();

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: savedQuestion
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/v1/round2/questions?yr=1 or /api/v1/round2/questions/yr
export const getQuestionsByYear = async (req, res) => {
  try {
    const { yr } = req.query;

    if (!yr) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a year (yr) as query parameter'
      });
    }

    const parsedYr = Number(yr);
    if (isNaN(parsedYr) || (parsedYr !== 1 && parsedYr !== 2)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid year. Must be 1 or 2'
      });
    }

    const questions = await Round2Question.find({ yr: parsedYr });

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No questions found for year ${parsedYr}`
      });
    }

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Get questions by year error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/v1/round2/questions/:id
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID format'
      });
    }

    const question = await Round2Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Get question by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// PUT /api/v1/round2/questions/:id
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { lang, buggycode, crctcode, yr, test_cases, title, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID format'
      });
    }

    // Validate year if provided
    if (yr !== undefined && yr !== 1 && yr !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Invalid year. Must be 1 or 2'
      });
    }

    // Validate language if provided
    if (lang !== undefined && lang !== 'python' && lang !== 'c') {
      return res.status(400).json({
        success: false,
        message: 'Invalid language. Must be "python" or "c"'
      });
    }

    // Validate test cases if provided
    if (test_cases !== undefined) {
      if (!Array.isArray(test_cases) || test_cases.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'test_cases must be a non-empty array'
        });
      }
      for (const testCase of test_cases) {
        if (!testCase.input || !testCase.expectedOutput) {
          return res.status(400).json({
            success: false,
            message: 'Each test case must have both input and expectedOutput'
          });
        }
      }
    }

    // Build update object
    const updateData = {};
    if (lang !== undefined) updateData.lang = lang;
    if (buggycode !== undefined) updateData.buggycode = buggycode;
    if (crctcode !== undefined) updateData.crctcode = crctcode;
    if (yr !== undefined) updateData.yr = yr;
    if (test_cases !== undefined) updateData.test_cases = test_cases;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const updatedQuestion = await Round2Question.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: updatedQuestion
    });
  } catch (error) {
    console.error('Update question error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// DELETE /api/v1/round2/questions/:id
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID format'
      });
    }

    const deletedQuestion = await Round2Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
      data: deletedQuestion
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

