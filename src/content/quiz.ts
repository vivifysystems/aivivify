import type { QuizQuestion } from "./schema.ts";

/**
 * Business Automation Readiness check. Indicative only: answers stay in the
 * visitor's browser and nothing is sent or stored. Scoring lives in src/lib/quiz.ts.
 */
export const quizQuestions: readonly QuizQuestion[] = [
  {
    id: "missed-inquiries",
    question: "How often do calls or messages go unanswered for hours?",
    options: [
      { label: "Rarely", score: 0 },
      { label: "Sometimes, on busy days", score: 1 },
      { label: "Often", score: 2 },
    ],
    systems: [
      ["missed-call-text-back", 2],
      ["ai-chatbot", 1.5],
      ["inbox-crm", 1],
    ],
  },
  {
    id: "repeat-questions",
    question: "How much of your day goes to answering the same questions?",
    options: [
      { label: "Hardly any", score: 0 },
      { label: "Some", score: 1 },
      { label: "A lot", score: 2 },
    ],
    systems: [
      ["ai-chatbot", 2],
      ["business-websites", 0.5],
    ],
  },
  {
    id: "follow-up",
    question: "Someone inquires but doesn't book. What happens next?",
    options: [
      { label: "We follow up on a set schedule", score: 0 },
      { label: "We follow up when we remember", score: 1 },
      { label: "Usually nothing", score: 2 },
    ],
    systems: [
      ["lead-follow-up", 2],
      ["marketing-campaigns", 0.75],
    ],
  },
  {
    id: "booking",
    question: "How do customers book appointments?",
    options: [
      { label: "Online booking already works well", score: 0 },
      { label: "Calls and messages back and forth", score: 2 },
      { label: "We don't take appointments", score: 0 },
    ],
    systems: [
      ["appointment-booking", 2],
      ["ai-receptionist", 0.5],
    ],
  },
  {
    id: "records",
    question: "Where does customer information live?",
    options: [
      { label: "In one CRM everyone uses", score: 0 },
      { label: "Spread across a few apps and spreadsheets", score: 1 },
      { label: "Inboxes, notebooks and memory", score: 2 },
    ],
    systems: [
      ["inbox-crm", 2],
      ["workflow-automation", 1],
    ],
  },
  {
    id: "admin",
    question: "How much repetitive admin does your team do each week?",
    options: [
      { label: "Very little", score: 0 },
      { label: "A noticeable amount", score: 1 },
      { label: "Far too much", score: 2 },
    ],
    systems: [
      ["workflow-automation", 2],
      ["review-feedback", 0.5],
    ],
  },
];
