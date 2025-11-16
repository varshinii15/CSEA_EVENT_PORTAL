import mongoose from "mongoose";
import PlayerAnswers from "../models/PlayerAnswers.js";
import Questions, { Crossword } from "../models/roundonemodel.js";
import steg from "../models/stegmodels.js";
export const submitAnswer = async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;
    const { email, year } = req.user;
    const name = email;

    if (!questionId || !userAnswer) {
      return res.status(400).json({
        success: false,
        message: "Question ID and answer are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid questionId" });
    }
    const [q1, q2] = await Promise.all([
      Questions.findById(questionId),
      steg.findById(questionId),
    ]);
    const question = q1 || q2;
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    if (
      question.yr != null &&
      year != null &&
      Number(question.yr) !== Number(year)
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only answer questions for your year",
      });
    }

    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = question.ans.trim().toLowerCase();

    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

    let playerAnswer = await PlayerAnswers.findOne({
      email,
      questionId,
      round: "roundone",
    });

    if (playerAnswer) {
      if (isCorrect && !playerAnswer.isCorrect) {
        playerAnswer.userAnswer = normalizedUserAnswer;
        playerAnswer.isCorrect = true;
        playerAnswer.attemptedAt = Date.now();
        await playerAnswer.save();

        return res.status(200).json({
          success: true,
          message: "Answer updated successfully! Correct answer!",
          data: {
            questionId: playerAnswer.questionId,
            isCorrect: playerAnswer.isCorrect,
            message: "Congratulations! Your answer is correct.",
          },
        });
      } else if (playerAnswer.isCorrect) {
        return res.status(200).json({
          success: true,
          message: "Already answered correctly",
          data: {
            questionId: playerAnswer.questionId,
            isCorrect: true,
            message: "You have already answered this question correctly.",
          },
        });
      } else {
        playerAnswer.userAnswer = normalizedUserAnswer;
        playerAnswer.isCorrect = false;
        playerAnswer.attemptedAt = Date.now();
        await playerAnswer.save();

        return res.status(200).json({
          success: true,
          message: "Answer submitted",
          data: {
            questionId: playerAnswer.questionId,
            isCorrect: false,
            message: "Incorrect answer. Try again!",
          },
        });
      }
    }

    const newAnswer = new PlayerAnswers({
      name,
      email,
      year,
      questionId,
      userAnswer: normalizedUserAnswer,
      isCorrect,
      round: "roundone",
    });

    await newAnswer.save();

    if (isCorrect) {
      return res.status(201).json({
        success: true,
        message: "Correct answer!",
        data: {
          questionId: newAnswer.questionId,
          isCorrect: true,
          message: "Congratulations! Your answer is correct.",
        },
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "Incorrect answer",
        data: {
          questionId: newAnswer.questionId,
          isCorrect: false,
          message: "Incorrect answer. Try again!",
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAnsweredQuestions = async (req, res) => {
  try {
    const { name, year } = req.user;

    const answeredQuestions = await PlayerAnswers.find({
      name,
      round: "roundone",
    })
      .populate("questionId", "title type yr")
      .sort({ attemptedAt: -1 });

    res.status(200).json({
      success: true,
      count: answeredQuestions.length,
      data: answeredQuestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPlayerScore = async (req, res) => {
  try {
    const { name, year } = req.user;

    const correctAnswers = await PlayerAnswers.countDocuments({
      name,
      round: "roundone",
      isCorrect: true,
    });

    res.status(200).json({
      success: true,
      data: {
        correctAnswers,
        score: correctAnswers,
        year,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const submitCrosswordAnswer = async (req, res) => {
  try {
    const { answers } = req.body;
    const { email, year } = req.user;
    const name = email;
    const { yr } = req.params;

    console.log("=== submitCrosswordAnswer ===");
    console.log("req.params.yr:", yr);
    console.log("req.user.year:", year);
    console.log("req.body.answers:", answers);

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers array is required",
      });
    }

    // Year restriction
    if (Number(yr) !== Number(year)) {
      return res.status(403).json({
        success: false,
        message: "You can only submit crosswords for your year",
      });
    }

    // Get crossword for that year from Questions collection
    const stored = await Questions.findOne({
      yr: Number(yr),
      type: "crossword",
    });

    console.log("Found crossword:", stored ? `ID: ${stored._id}` : "NULL");
    console.log("Full stored document:", JSON.stringify(stored, null, 2));
    console.log("stored.answer:", stored?.answer);
    console.log("stored.answers:", stored?.answers);
    console.log(
      "All keys:",
      stored ? Object.keys(stored.toObject ? stored.toObject() : stored) : "N/A"
    );

    if (!stored) {
      return res.status(500).json({
        success: false,
        message: "Crossword not found in database",
      });
    }

    // Try different possible field names
    const answerArray = stored.answer || stored.answers || stored.ans || [];

    console.log("answerArray:", answerArray);
    console.log("answerArray type:", typeof answerArray);
    console.log("answerArray isArray:", Array.isArray(answerArray));

    if (!Array.isArray(answerArray) || answerArray.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Invalid crossword answer format in database",
      });
    }

    const total = answerArray.length;
    let correct = 0;
    const result = [];

    for (let i = 0; i < total; i++) {
      const expected = answerArray[i]?.trim().toLowerCase() || "";
      const submitted = answers[i]?.answer?.trim().toLowerCase() || "";

      const isCorrect = expected === submitted && expected !== "";
      if (isCorrect) correct++;

      result.push({
        pos: i + 1,
        submitted,
        correct: isCorrect,
      });
    }

    const allCorrect = correct === total;

    // Save or update player's crossword submission
    let playerAnswer = await PlayerAnswers.findOne({
      name,
      questionId: stored._id, // 🔥 ADD THIS
      round: "roundone",
    });

    const payload = {
      name,
      email,
      year,
      questionId: stored._id, // 🔥 ADD THIS
      userAnswer: JSON.stringify(answers),
      isCorrect: allCorrect,
      round: "roundone",
      attemptedAt: Date.now(),
      meta: { total, correct, details: result },
    };

    if (playerAnswer) {
      Object.assign(playerAnswer, payload);
      await playerAnswer.save();
    } else {
      playerAnswer = new PlayerAnswers(payload);
      await playerAnswer.save();
    }

    return res.status(200).json({
      success: true,
      message: allCorrect ? "All correct! 🎉" : "Submitted",
      data: { total, correct, allCorrect, details: result },
    });
  } catch (error) {
    console.error("submitCrosswordAnswer error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
