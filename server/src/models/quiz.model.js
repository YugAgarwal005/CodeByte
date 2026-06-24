import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
});

const lessonSchema = new mongoose.Schema({
  lessonNumber: {
    type: Number,
    required: true,
  },
  questions: {
    type: [questionSchema],
    required: true,
  },
});

const unitSchema = new mongoose.Schema({
  unitNumber: {
    type: Number,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  guideBook: {
    type: String,
  },
  lessons: {
    type: [lessonSchema],
    required: true,
  },
});

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  units: {
    type: [unitSchema],
    required: true,
  },
});

const Quiz = mongoose.model("Quiz", topicSchema);

export default Quiz;
