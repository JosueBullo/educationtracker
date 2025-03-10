// // routes/learningBackground.js
// const express = require("express");
// const LearningBackground = require("../models/LearningBackground");
// const router = express.Router();

// // Create a new learning background
// router.post("/", async (req, res) => {
//   try {
//     const { userId, gradeLevel, strand, course } = req.body;

//     // Validate required fields
//     if (!userId || !gradeLevel) {
//       return res.status(400).json({ message: "userId and gradeLevel are required" });
//     }

//     // Validate strand or course based on gradeLevel
//     if (gradeLevel === "Senior High School" && !strand) {
//       return res.status(400).json({ message: "Strand is required for Senior High School" });
//     }
//     if (gradeLevel === "College" && !course) {
//       return res.status(400).json({ message: "Course is required for College" });
//     }

//     // Create and save the learning background
//     const learningBackground = new LearningBackground({ userId, gradeLevel, strand, course });
//     await learningBackground.save();

//     res.status(201).json(learningBackground);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// module.exports = router;