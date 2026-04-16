import Interview from "../models/Interview.js";
import genAI from "../config/gemini.js";

export const generateQuestion = async (req, res) => {
  try {
    const { role, difficulty, lastQuestion } = req.body;

    const questionBank = {
      c: {
        easy: [
          "What is the difference between int, float, and char in C?",
          "What is a pointer in C?",
          "What is the use of printf and scanf in C?",
          "What is the difference between while loop and for loop in C?",
        ],
        medium: [
          "Explain the difference between call by value and call by reference in C.",
          "What is the difference between malloc and calloc?",
          "Explain arrays and pointers in C.",
          "What is the purpose of header files in C?",
        ],
        hard: [
          "Explain pointer arithmetic in C with examples.",
          "What is a dangling pointer and how can it be avoided?",
          "Explain memory allocation and deallocation in C.",
          "How does a function pointer work in C?",
        ],
      },

      java: {
        easy: [
          "What is Java? Explain its basic features.",
          "What is JVM in Java?",
          "What is the difference between JDK, JRE, and JVM?",
          "What are the main data types in Java?",
        ],
        medium: [
          "Explain OOP concepts in Java with examples.",
          "What is the difference between abstraction and encapsulation?",
          "Explain method overloading and method overriding in Java.",
          "What are constructors in Java and why are they used?",
        ],
        hard: [
          "Explain JVM architecture and memory management in detail.",
          "What is garbage collection in Java and how does it work?",
          "Explain multithreading in Java with synchronization.",
          "What is the difference between HashMap and ConcurrentHashMap?",
        ],
      },

      python: {
        easy: [
          "What are lists and tuples in Python?",
          "What is the difference between print and return in Python?",
          "What are Python dictionaries?",
          "What is indentation in Python?",
        ],
        medium: [
          "What is the difference between list and tuple in Python?",
          "Explain *args and **kwargs in Python.",
          "What are decorators in Python?",
          "Explain exception handling in Python.",
        ],
        hard: [
          "Explain generators and iterators in Python.",
          "What is the difference between deep copy and shallow copy in Python?",
          "Explain Python’s GIL.",
          "How does memory management work in Python?",
        ],
      },

      r: {
        easy: [
          "What is R and where is it commonly used?",
          "What are vectors in R?",
          "What is the difference between a data frame and a matrix in R?",
          "How do you install and load a package in R?",
        ],
        medium: [
          "Explain factors in R.",
          "How do you handle missing values in R?",
          "What is the difference between apply, lapply, and sapply?",
          "How do you import CSV data into R?",
        ],
        hard: [
          "Explain data wrangling in R using dplyr.",
          "How would you build a linear regression model in R?",
          "What is the use of ggplot2 in R?",
          "How do you optimize performance in R scripts?",
        ],
      },

      html: {
        easy: [
          "What is HTML and why is it used?",
          "What is the difference between block and inline elements?",
          "What are semantic tags in HTML?",
          "What is the use of the alt attribute in images?",
        ],
        medium: [
          "What is the difference between id and class in HTML?",
          "Explain forms in HTML.",
          "What are meta tags in HTML?",
          "What is the difference between section, article, and div?",
        ],
        hard: [
          "How do you improve accessibility in HTML?",
          "Explain SEO-friendly HTML structure.",
          "What is the importance of semantic HTML in large applications?",
          "How would you structure a scalable multi-section web page in HTML?",
        ],
      },

      css: {
        easy: [
          "What is CSS and why is it used?",
          "What is the difference between margin and padding?",
          "What is the box model in CSS?",
          "What is the difference between class selector and id selector?",
        ],
        medium: [
          "Explain flexbox in CSS.",
          "What is the difference between relative, absolute, and fixed positioning?",
          "How does z-index work in CSS?",
          "Explain media queries in CSS.",
        ],
        hard: [
          "Explain CSS Grid and when to use it over Flexbox.",
          "How would you build a fully responsive layout?",
          "What causes specificity conflicts in CSS?",
          "How do animations and transitions work in CSS?",
        ],
      },

      javascript: {
        easy: [
          "What is JavaScript and where is it used?",
          "What is the difference between let, const, and var?",
          "What are functions in JavaScript?",
          "What is an array in JavaScript?",
        ],
        medium: [
          "Explain closures in JavaScript.",
          "What is the difference between == and ===?",
          "What are promises in JavaScript?",
          "Explain event bubbling in JavaScript.",
        ],
        hard: [
          "Explain async/await with an example.",
          "What is the event loop in JavaScript?",
          "What is the difference between debounce and throttle?",
          "Explain prototype inheritance in JavaScript.",
        ],
      },

      react: {
        easy: [
          "What is React and why is it used?",
          "What is JSX in React?",
          "What is the difference between props and state?",
          "What is a component in React?",
        ],
        medium: [
          "Explain useState and useEffect in React.",
          "What is conditional rendering in React?",
          "How does React routing work?",
          "What is lifting state up in React?",
        ],
        hard: [
          "How do you optimize performance in React applications?",
          "Explain controlled and uncontrolled components in React.",
          "What is the virtual DOM in React?",
          "How would you structure a scalable React project?",
        ],
      },

      node: {
        easy: [
          "What is Node.js?",
          "What is npm?",
          "Why is Node.js considered asynchronous?",
          "What is the use of package.json?",
        ],
        medium: [
          "Explain middleware in Express.js.",
          "What is the difference between synchronous and asynchronous code in Node.js?",
          "How does require differ from import?",
          "What is event-driven architecture in Node.js?",
        ],
        hard: [
          "How does the event loop work in Node.js?",
          "How would you handle errors in a production Express app?",
          "What is clustering in Node.js?",
          "How do you secure a Node.js backend API?",
        ],
      },

      mern: {
        easy: [
          "What is React?",
          "What is Node.js and why is it used?",
          "What is the purpose of Express.js?",
          "What is MongoDB?",
        ],
        medium: [
          "How does JWT authentication work?",
          "Explain the difference between props and state in React.",
          "How does Express middleware work?",
          "What is the difference between SQL and MongoDB?",
        ],
        hard: [
          "Design a scalable MERN app with authentication and real-time features.",
          "How would you optimize performance in a large React application?",
          "Explain how you would design role-based access control in MERN.",
          "How would you structure a production-ready MERN backend?",
        ],
      },

      dsa: {
        easy: [
          "What is an array?",
          "What is a linked list?",
          "What is the difference between stack and queue?",
          "What is binary search?",
        ],
        medium: [
          "Explain merge sort time complexity.",
          "What is the difference between DFS and BFS?",
          "How does a hash table work?",
          "Explain recursion with one example.",
        ],
        hard: [
          "Design LRU cache with O(1) operations.",
          "Explain dynamic programming with a suitable example.",
          "How would you detect a cycle in a linked list?",
          "Solve the longest substring without repeating characters problem.",
        ],
      },

      hr: {
        easy: [
          "Tell me about yourself.",
          "What are your strengths?",
          "Why do you want this job?",
          "What motivates you?",
        ],
        medium: [
          "Why should we hire you?",
          "Describe a challenge you faced and how you handled it.",
          "Where do you see yourself in 5 years?",
          "How do you handle pressure and deadlines?",
        ],
        hard: [
          "Describe a failure and what you learned from it.",
          "Tell me about a conflict in a team and how you resolved it.",
          "Why should a company choose you over another candidate?",
          "Describe a time when you had to lead without authority.",
        ],
      },
    };

    const roleQuestions = questionBank[role]?.[difficulty];

    if (!roleQuestions || roleQuestions.length === 0) {
      return res.status(400).json({ message: "Invalid role or difficulty" });
    }

    let availableQuestions = roleQuestions;

    if (lastQuestion && roleQuestions.length > 1) {
      availableQuestions = roleQuestions.filter((q) => q !== lastQuestion);
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];

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
