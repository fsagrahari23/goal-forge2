// lib/generative-ai.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const date = new Date();
const startDate = date.toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

const generationConfig = {
  temperature: 0,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const modelPhases = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  systemInstruction:
    'You are an intelligent task planner. Your job is to break down a given goal into multiple smaller phases and daily tasks.\n\nInput:\nA main goal description\n\nOutput Format:\nGenerate your output as a valid JSON array where each element represents a phase. The JSON structure must follow this schema\n```json\n{\n  "Start Date": "YYYY-MM-DD" ,\n  "Number of Days": X,\n  "Phases": [\n    {\n      "Phase": "Phase Name",\n "objective": "Description of the task for this phase",\n  "Duration (Days)": X,\n      "Start Date": "YYYY-MM-DD",\n      "End Date": "YYYY-MM-DD",\n      "Task": "Description of the task for this phase"\n ,"tasks": [\n        {\n          "Day No": X,\n          "Date of Day No": "YYYY" ,\n          "task_description": "Detailed description of what to do on this day"\n ,\n          "is_review_assignment": false\n    \n   "estimated_hours" : 2\n,\n "resources_needed":[\n        "Resource 1",\n        "Resource 2",\n        "Resource 3"\n      ]         }\n      ]\n    }\n  ]\n}\n```\nGenerate the response in valid JSON format only.' +
    `\nStart Date: ${startDate}`,
});

async function getTasksPhasesWithDailyTasksShedule(taskInput) {
  console.log(taskInput);
  try {
    const chatSession = modelPhases.startChat({
      generationConfig,
      // history: [
      //   {
      //     role: "user",
      //     parts: [
      //       {
      //         text: taskInput,
      //       },
      //     ],
      //   },
      // ],
    });

    // "Generate the task breakdown" can be replaced with any additional context if needed
    const result = await chatSession.sendMessage(taskInput);
    let rawResponse = result.response.text();
    // Remove code block markers if any
    rawResponse = rawResponse.trim();
    rawResponse = rawResponse
      .replace(/^```json\s*/, "")
      .replace(/```$/, "");
    // console.log(rawResponse);
    const json = JSON.parse(rawResponse);
    json.status = "success";
    return json;
  } catch (error) {
    console.error("Error generating phases:", error);
    throw new Error("Failed to generate phases");
  }
}

export { getTasksPhasesWithDailyTasksShedule };
