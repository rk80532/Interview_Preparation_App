import Interview from "../models/Interview.js";
import genAI from "../config/gemini.js";

export const generateQuestion = async (req, res) => {
  try {
    const { role, difficulty, askedQuestions = [] } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const previousQuestionsText =
      askedQuestions.length > 0
        ? askedQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")
        : "None";

    const prompt = `
You are an expert interviewer.

Generate ONE unique interview question.

Role: ${role}
Difficulty: ${difficulty}

Previously asked questions in this session:
${previousQuestionsText}

Rules:
- Generate only one question
- Do not repeat or closely paraphrase any previous question
- Keep it realistic and interview-quality
- Match the role and difficulty level
- Return only the question text
`;

    const result = await model.generateContent(prompt);
    const question = result.response.text().trim();

    if (!question) {
      return res.status(500).json({ message: "Failed to generate question" });
    }

    res.status(200).json({ question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating question" });
  }
};
export const submitAnswer = async (req, res) => {
  try {
    const { role, difficulty, question, answer } = req.body;

    if (!role || !question || !answer) {
      return res
        .status(400)
        .json({ message: "Role, question and answer are required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an expert interviewer.

Evaluate the candidate answer.

Role: ${role}
Difficulty: ${difficulty}
Question: ${question}
Answer: ${answer}

Return ONLY valid JSON in this exact format:
{
  "score": number,
  "feedback": "text",
  "idealAnswer": "text"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    let parsed;

    try {
      const cleanedText = text.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleanedText);
    } catch (err) {
      return res.status(500).json({
        message: "AI parsing failed",
        raw: text,
      });
    }

    const interview = await Interview.create({
      userId: req.user.id,
      role,
      difficulty,
      question,
      answer,
      score: parsed.score,
      feedback: parsed.feedback,
      idealAnswer: parsed.idealAnswer,
    });

    res.status(200).json({ interview });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error submitting answer",
      error: error.message,
    });
  }
};

export const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      interviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id });

    const totalInterviews = interviews.length;

    const averageScore =
      totalInterviews > 0
        ? (
            interviews.reduce((sum, item) => sum + item.score, 0) /
            totalInterviews
          ).toFixed(2)
        : 0;

    const roleStats = {};

    interviews.forEach((item) => {
      if (!roleStats[item.role]) {
        roleStats[item.role] = {
          count: 0,
          totalScore: 0,
        };
      }

      roleStats[item.role].count += 1;
      roleStats[item.role].totalScore += item.score;
    });

    const formattedRoleStats = Object.keys(roleStats).map((role) => ({
      role,
      interviews: roleStats[role].count,
      averageScore: (
        roleStats[role].totalScore / roleStats[role].count
      ).toFixed(2),
    }));

    res.status(200).json({
      totalInterviews,
      averageScore,
      roleStats: formattedRoleStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};
