// lib/generative-ai.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

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
    'You are an intelligent task planner. Your job is to break down a given goal into multiple smaller phases and daily tasks based on a provided start date which would be now date and a time constraint (number of days available to complete the task).\n\nInput:\nA main goal description\nStart date (YYYY-MM-DD)\nA total duration (number of days) for the entire roadmap\nOutput Format:\nGenerate your output as a valid JSON array where each element represents a phase. The JSON structure must follow this schema\n```json\n{\n  "Start Date": "YYYY-MM-DD" ,\n  "Number of Days": X,\n  "Phases": [\n    {\n      "Phase": "Phase Name",\n "objective": "Description of the task for this phase",\n  "Duration (Days)": X,\n      "Start Date": "YYYY-MM-DD",\n      "End Date": "YYYY-MM-DD",\n      "Task": "Description of the task for this phase"\n ,"tasks": [\n        {\n          "Day No": X,\n          "Date of Day No": "YYYY" ,\n          "task_description": "Detailed description of what to do on this day"\n ,\n          "is_review_assignment": false\n    \n   "estimated_hours" : 2\n,\n "resources_needed":[\n        "Resource 1",\n        "Resource 2",\n        "Resource 3"\n      ]         }\n      ]\n    }\n  ]\n}\n```\nGenerate the response in valid JSON format only.',
});

async function getTasksPhasesWithDailyTasksShedule(taskInput) {
  console.log(taskInput);
  try {
    const chatSession = modelPhases.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: taskInput,
            },
          ],
        },
      ],
    });

    // "Generate the task breakdown" can be replaced with any additional context if needed
    const result = await chatSession.sendMessage("Generate the task breakdown");
    let rawResponse = result.response.text();
    // Remove code block markers if any
    rawResponse = rawResponse.trim();
    rawResponse = rawResponse.replace(/^```json\s*/, "").replace(/```$/, "");
    console.log(rawResponse);
    const json = JSON.parse(rawResponse);
    json.status = "success";
    return json;
  } catch (error) {
    console.error("Error generating phases:", error);
    throw new Error("Failed to generate phases");
  }
}

/**
 * getTasksDaysForPhase:
 * This function takes a phase (or a phase description) as input and asks the generative AI
 * to create a day-by-day breakdown for that phase. The expected JSON output format is:
 *
 * {
 *   "Start Date": "YYYY-MM-DD",
 *   "Number of Days": X,
 *   "Tasks": [
 *     {
 *       "Day": X,
 *       "Date": "YYYY-MM-DD",
 *       "Task": "Description of the subtask for that day"
 *     }
 *   ]
 * }
 */
// const modelDays = genAI.getGenerativeModel({
//   model: "gemini-2.0-flash-lite",
//   systemInstruction:
//     'You are an intelligent task planner. Your job is now to take a specific phase of a project and break it down into daily tasks. \n\nInput:\nA phase description including the phase name, start date, duration (in days), and a brief description of the task to be accomplished during that phase.\nOutput Format:\nProvide a structured breakdown in JSON format with the following keys:\n```json\n{\n  "Start Date": "YYYY-MM-DD",\n  "Number of Days": X,\n  "Tasks": [\n    {\n      "Day": X,\n      "Date": "YYYY-MM-DD",\n      "Task": "Description of the subtask to be completed on this day"\n    }\n  ]\n}\n```\nGenerate the response in valid JSON format only.',
// });

// async function getTasksDaysForPhase(phaseInput) {
//   try {
//     const chatSession = modelDays.startChat({
//       generationConfig,
//       history: [
//         {
//           role: "user",
//           parts: [
//             {
//               // phaseInput should be a text that describes the phase.
//               // For example:
//               // "Phase: HTML Structure, Duration: 2 days, Start Date: 2025-03-19. Task: Develop the HTML structure for the to-do application, including input fields, task list, and buttons."
//               text: phaseInput,
//             },
//           ],
//         },
//       ],
//     });

//     const result = await chatSession.sendMessage(
//       "Generate the daily breakdown for this phase"
//     );
//     let rawResponse = result.response.text();
//     rawResponse = rawResponse.replace(/```json\n|```/g, "");
//     const json = JSON.parse(rawResponse);
//     json.status = "success";
//     return json;
//   } catch (error) {
//     console.error("Error generating daily tasks for phase:", error);
//     throw new Error("Failed to generate daily tasks for the phase");
//   }
// }

export { getTasksPhasesWithDailyTasksShedule };
