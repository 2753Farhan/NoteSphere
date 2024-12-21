import { ChatGroq } from "@langchain/groq";
import Student from "../models/Student.js"; // Correct import

export async function addStudent(req, res) {
  try {
    const { name, email, interests, challenges } = req.body;

    const student = await Student.create({
      name,
      email,
      interests,
      challenges,
    });

    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function matchStudyGroups(req, res) {
    try {
      // Fetch all students
      const students = await Student.find();
  
      if (students.length < 2) {
        return res.status(400).json({ message: "Not enough students to form groups." });
      }
  
      // Prepare data for the AI API
      const studentData = students.map((student) => ({
        id: student._id,
        name: student.name,
        interests: student.interests,
        challenges: student.challenges,
      }));
  
      // Initialize ChatGroq API
      const model = new ChatGroq({
        model: "mixtral-8x7b-32768", // Example model name
        groqApiKey: process.env.GROQ_API_KEY, // Your API key
      });
  
      // Construct the prompt
      const prompt = `
        You are an AI responsible for grouping participants based on their similar interests and challenges.
        Here is the data:
  
        ${studentData.map(
          (student) =>
            `- ${student.name}: Interests (${student.interests.join(", ")}), Challenges (${student.challenges.join(", ")})`
        ).join("\n")}
  
        Group them into study groups and return the response strictly as valid JSON in the following format:
        [
          { "group": 1, "members": ["Name1", "Name2"] },
          { "group": 2, "members": ["Name3"] }
        ]
        Do not include any explanation, description, or additional text—only the JSON. If you include anything other than JSON, it will break the application.
      `;
  
      // Send the prompt to the AI model
      try {
        const response = await model.invoke([{ role: "user", content: prompt }]);
  
        // Log response for debugging
        console.log("AI Response:", response.content);
  
        // Extract the JSON portion from the response
        const jsonMatch = response.content.match(/\[.*\]/s);
        if (!jsonMatch) {
          throw new Error(`No valid JSON found in the AI response: ${response.content}`);
        }
  
        const groups = JSON.parse(jsonMatch[0]); // Parse the extracted JSON
        res.json({ success: true, groups });
      } catch (error) {
        throw new Error(`Failed to process AI response: ${error.message}`);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }