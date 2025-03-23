import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  dayNo: {
    type: Number,
    default: 1,
  },
  dateOfDayNo: {
    type: Date,
    default: () => new Date().toISOString().split("T")[0],
  },
  task_description: String,
  is_review_assignment: Boolean,
  estimated_hours: Number,
  resources_needed: [String],
});

// Pre-save hook on PhaseSchema to auto-increment Day for tasks
const PhaseSchema = new mongoose.Schema({
  phase: String,
  objective: String,
  durationInDays: Number,
  startDate: Date,
  endDate: Date,
  task: String,
  tasks: [TaskSchema],
});

// Before saving a Phase, update each task's dayNo field in order
PhaseSchema.pre("save", function (next) {
  if (this.tasks && this.tasks.length > 0) {
    this.tasks.forEach((task, index) => {
      task.dayNo = index + 1; // Updating field correctly
    });
  }
  next();
});

const RoadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  startDate: {
    type: Date,
    required: true,
  },
  numberOfDays: {
    type: Number,
    required: true,
  },
  phases: [PhaseSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Roadmap ||
  mongoose.model("Roadmap", RoadmapSchema);
