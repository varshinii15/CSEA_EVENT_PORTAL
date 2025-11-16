import mongoose from "mongoose";
import PlayerAnswers from "../models/PlayerAnswers.js";
import Questions, {Crossword} from "../models/roundonemodel.js";
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

    const question = await Questions.findById(questionId);
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

export const submitStegAnswer = async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;
    const { email, year, name } = req.user;

    if (!questionId || !userAnswer) {
      return res.status(400).json({
        success: false,
        message: "Question ID and answer are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(questionId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid questionId" });

    const question = await steg.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    if (Number(question.yr) !== Number(year)) {
      return res.status(403).json({
        success: false,
        message: "You can only answer questions for your year",
      });
    }

    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = question.ans.trim().toLowerCase();
    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

    let playerAnswer = await PlayerAnswers.findOne({
      name,
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
          message: "Correct answer!",
          data: {
            questionId: playerAnswer.questionId,
            isCorrect: true,
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
          },
        });
      } else {
        playerAnswer.userAnswer = normalizedUserAnswer;
        playerAnswer.isCorrect = false;
        playerAnswer.attemptedAt = Date.now();
        await playerAnswer.save();

        return res.status(200).json({
          success: true,
          message: "Incorrect answer",
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

// ...existing code...
export const submitCrosswordAnswer = async (req, res) => {
  try {
    const { crosswordId, answers } = req.body;
    const { email, year, name } = req.user;

    if (!crosswordId || !answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "crosswordId and answers object are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(crosswordId)) {
      return res.status(400).json({ success: false, message: "Invalid crosswordId" });
    }

    const crossword = await Crossword.findById(crosswordId);
    if (!crossword) {
      return res.status(404).json({ success: false, message: "Crossword not found" });
    }

    // year check (support yr or year)
    if (crossword.yr != null && year != null && Number(crossword.yr) !== Number(year)) {
      return res.status(403).json({ success: false, message: "You can only submit crosswords for your year" });
    }
    if (crossword.year != null && year != null && Number(crossword.year) !== Number(year)) {
      return res.status(403).json({ success: false, message: "You can only submit crosswords for your year" });
    }

    const normalize = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");

    const storedAcross = (crossword.answers && crossword.answers.across) || {};
    const storedDown = (crossword.answers && crossword.answers.down) || {};

    const getExpected = (store, key) => (typeof store.get === "function" ? store.get(key) : store?.[key]);

    const result = { across: {}, down: {} };
    let total = 0;
    let correct = 0;

    const submittedAcross = answers.across || {};
    for (const k of Object.keys(submittedAcross)) {
      total++;
      const expected = getExpected(storedAcross, k);
      const isCorrect = normalize(submittedAcross[k]) === normalize(expected);
      if (isCorrect) correct++;
      result.across[k] = { submitted: submittedAcross[k], expected: expected ?? null, correct: isCorrect };
    }

    const submittedDown = answers.down || {};
    for (const k of Object.keys(submittedDown)) {
      total++;
      const expected = getExpected(storedDown, k);
      const isCorrect = normalize(submittedDown[k]) === normalize(expected);
      if (isCorrect) correct++;
      result.down[k] = { submitted: submittedDown[k], expected: expected ?? null, correct: isCorrect };
    }
    // Check if all required answers were submitted
    const totalRequired = Object.keys(storedAcross).length + Object.keys(storedDown).length;
    const totalSubmitted = Object.keys(submittedAcross).length + Object.keys(submittedDown).length;
    
    if (totalSubmitted < totalRequired) {
      return res.status(400).json({
        success: false,
        message: `Incomplete submission. Expected ${totalRequired} answers, received ${totalSubmitted}.`
      });
    }
    const allCorrect = total > 0 && correct === total;

    let playerAnswer = await PlayerAnswers.findOne({
      name,
      questionId: crosswordId,
      round: "roundone",
    });

    const payload = {
      name,
      email,
      year,
      questionId: crosswordId,
      userAnswer: JSON.stringify(answers),
      isCorrect: allCorrect,
      round: "roundone",
      attemptedAt: Date.now(),
      meta: { total, correct, details: result },
    };

    if (playerAnswer) {
      playerAnswer.userAnswer = payload.userAnswer;
      playerAnswer.isCorrect = payload.isCorrect;
      playerAnswer.attemptedAt = payload.attemptedAt;
      playerAnswer.meta = payload.meta;
      await playerAnswer.save();

      if (allCorrect) {
        return res.status(200).json({
          success: true,
          message: "Correct answer! Congratulations.",
          data: { questionId: crosswordId, isCorrect: true, total, correct, details: result },
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Submission recorded",
          data: { questionId: crosswordId, isCorrect: false, total, correct, details: result },
        });
      }
    }

    const newAnswer = new PlayerAnswers(payload);
    await newAnswer.save();

    if (allCorrect) {
      return res.status(201).json({
        success: true,
        message: "Correct answer! Congratulations.",
        data: { questionId: crosswordId, isCorrect: true, total, correct, details: result },
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "Submission recorded",
        data: { questionId: crosswordId, isCorrect: false, total, correct, details: result },
      });
    }
  } catch (error) {
    console.error("submitCrosswordAnswer error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
