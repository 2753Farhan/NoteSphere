import Note from "../models/Note.js"; // Default export
import { ChatGroq } from "@langchain/groq";

export async function chatWithNotes(req, res) {
  try {
    const { notesId, query } = req.body;
    const note = await Note.findById(notesId); // Use Note model directly
    if (!note) return res.status(404).json({ message: "Note not found" });

    const model = new ChatGroq({
      model: "mixtral-8x7b-32768",
      groqApiKey: process.env.GROQ_API_KEY,
    });

    const response = await model.invoke([
      { role: "user", content: `Using the following notes:\n${note.extractedText}\nAnswer this question: ${query}` },
    ]);

    res.json({ success: true, response: response.content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
