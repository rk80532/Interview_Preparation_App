import Interview from "../models/Interview.js";
import genAI from "../config/gemini.js";

export const generateQuestion = async (req, res) => {
  try {
    const { role, difficulty } = req.body;

    let question = "";

    if (role === "java") {
      if (difficulty === "easy") {
        question = "What is Java? Explain its basic features.";
      } else if (difficulty === "medium") {
        question = "Explain OOP concepts in Java with examples.";
      } else {
        question = "Explain JVM architecture and memory management in detail.";
      }
    } else if (role === "mern") {
      if (difficulty === "easy") {
        question = "What is React?";
      } else if (difficulty === "medium") {
        question = "How does JWT authentication work?";
      } else {
        question =
          "Design a scalable MERN app with authentication and real-time features.";
      }
    } else if (role === "dsa") {
      if (difficulty === "easy") {
        question = "What is an array?";
      } else if (difficulty === "medium") {
        question = "Explain merge sort time complexity.";
      } else {
        question = "Design LRU cache with O(1) operations.";
      }
    } else if (role === "hr") {
      if (difficulty === "easy") {
        question = "Tell me about yourself.";
      } else if (difficulty === "medium") {
        question = "Why should we hire you?";
      } else {
        question = "Describe a failure and what you learned from it.";
      }
    }

    if (!question) {
      return res.status(400).json({ message: "Invalid role or difficulty" });
    }

    res.status(200).json({ question });
  } catch (error) {
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
      model: "gemini-1.5-flash",
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
