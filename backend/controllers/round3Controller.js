import Round3Answer from '../models/Round3Answer.js';
import Round3Player from '../models/Round3Player.js';


// 🟢 Create (POST)
export const createAnswer = async (req, res) => {
  try {
    const { answer, yr } = req.body;
    if (!answer || !yr)
      return res.status(400).json({ success: false, message: "Answer and year are required" });

    const existing = await Round3Answer.findOne({ yr });
    if (existing)
      return res.status(409).json({ success: false, message: `Answer for year ${yr} already exists` });

    const newAnswer = await Round3Answer.create({ answer, yr });
    res.status(201).json({
      success: true,
      message: `Answer for year ${yr} created successfully`,
      data: newAnswer
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ⚪ Get all answers
export const getAllAnswers = async (req, res) => {
  try {
    const answers = await Round3Answer.find();
    if (answers.length === 0) {
      return res.status(404).json({ success: false, message: "No answers found" });
    }
    res.status(200).json({ success: true, data: answers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// 🔵 Read (GET)
export const getAnswer = async (req, res) => {
  try {
    const { year } = req.params;
    const answer = await Round3Answer.findOne({ yr: year });
    if (!answer)
      return res.status(404).json({ success: false, message: `No answer found for year ${year}` });

    res.status(200).json({ success: true, data: answer });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🟡 Update (PUT)
export const updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const updated = await Round3Answer.findOneAndUpdate(
      { _id: id },
      { answer },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: `No existing answer for year ${year} to update` });

    res.status(200).json({
      success: true,
      message: `Answer for year ${year} updated successfully`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔴 Delete (DELETE)
export const deleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Round3Answer.findOneAndDelete({ _id: id });

    if (!deleted)
      return res.status(404).json({ success: false, message: `No answer found for id ${id}` });

    res.status(200).json({
      success: true,
      message: `Answer for id ${id} deleted successfully`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🟣 Player Submit Answer (POST)
export const submitPlayerAnswer = async (req, res) => {
  try {
    const { year, answer } = req.body;
    const email = req.user?.email || req.body.email || null;

    if (year == null || !answer) return res.status(400).json({ success: false, message: "Year and answer are required" });

    // fetch answer key from Round3Answer model
    const key = await Round3Answer.findOne({ yr: Number(year) });
    if (!key) return res.status(404).json({ success: false, message: "No answer key found for this year" });

    const playerAns = String(answer).trim().toLowerCase();
    const correctArr = Array.isArray(key.answer) ? key.answer : [key.answer];
    const normalizedCorrect = correctArr.map(a => String(a).trim().toLowerCase());
    const isCorrect = normalizedCorrect.includes(playerAns);

    // record player attempt if email present (upsert by email+year)
    if (email) {
      await Round3Player.findOneAndUpdate(
        { email: email.toLowerCase(), year: Number(year) },
        { email: email.toLowerCase(), year: Number(year), answered: true, lastResult: isCorrect },
        { upsert: true, new: true }
      );
    }

    return res.status(200).json({ success: true, isCorrect, message: isCorrect ? "Correct answer" : "Wrong answer" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};