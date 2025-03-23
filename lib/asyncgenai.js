import { getTasksPhases, getTasksDaysForPhase } from "@/lib/generative-ai";

// This function takes a prompt, generates phases, then for each phase generates day-by-day tasks,
// flattens all day arrays into one array, and returns the final array.
export async function generateDailyTasksForPhases(prompt) {
  try {
    // 1. Generate phases breakdown
    const generationResultPhase = await getTasksPhases(prompt);
    if (generationResultPhase.status !== "success") {
      throw new Error(generationResultPhase.error);
    }
    const generatedDataPhase = generationResultPhase.data;
    console.log("Generated Phases:", generatedDataPhase);

    // 2. For each phase, generate the daily breakdown
    let allDailyTasksArrays = [];
    if (
      generatedDataPhase &&
      generatedDataPhase.Phases &&
      Array.isArray(generatedDataPhase.Phases)
    ) {
      for (const phase of generatedDataPhase.Phases) {
        // Build a prompt for this phase
        const phasePrompt = `Phase: ${phase.Phase}, Duration: ${phase["Duration (Days)"]} days, Start Date: ${phase["Start Date"]}, Task: ${phase.Task}`;
        const generationResultDay = await getTasksDaysForPhase(phasePrompt);
        if (generationResultDay.status === "success") {
          console.log(
            `Daily tasks for phase "${phase.Phase}":`,
            generationResultDay.data
          );
          // Push the tasks array from this phase
          allDailyTasksArrays.push(generationResultDay.data.Tasks);
        } else {
          console.error(
            `Error generating daily tasks for phase "${phase.Phase}":`,
            generationResultDay.error
          );
        }
      }
    }

    // 3. Flatten the array of arrays into one final array
    const flattenedDailyTasks = allDailyTasksArrays.flat();
    console.log("Final flattened daily tasks array:", flattenedDailyTasks);
    return flattenedDailyTasks;
  } catch (error) {
    console.error("Error in generateDailyTasksForPhases:", error);
    throw error;
  }
}

// Example usage:
// Wrap in an async IIFE or call from another async function
// (async () => {
//   try {
//     const prompt = `Task: Make a simple to do application using HTML, CSS, JS
// Start Date: "2025-03-17"
// Time Constraint: 14 days`;
//     const finalDailyTasks = await generateDailyTasksForPhases(prompt);
//     console.log("Final daily tasks generated:", finalDailyTasks);
//   } catch (error) {
//     console.error("Error generating daily tasks:", error);
//   }
// })();
