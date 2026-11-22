/**
 * Copy for the home page proof section (the project is `proofProjectId` in work.ts).
 *
 * Everything here describes what the documented workflow does. It is an illustration,
 * labelled as one on the page. It contains no testimonial, statistic or business outcome:
 * the project has none on file. The wording of the call is written for this page.
 */
export const homeProof = {
  kicker: "A built example · AI voice receptionist",
  headline: "A phone call that ends with an appointment in the calendar.",
  device: { initial: "B", name: "Local business", channel: "Phone call" },
  figureLabel: "Illustration of a phone call and the booking it produces",
  caption: "Illustrated example, not a real call. The wording is written for this page.",
  lines: [
    {
      from: "caller",
      speaker: "Caller",
      text: "Hi, do you have anything free on Thursday afternoon?",
    },
    {
      from: "assistant",
      speaker: "Assistant",
      text: "Yes, I can do 2:30 or 4:00. Which would you like?",
    },
    { from: "caller", speaker: "Caller", text: "2:30, please." },
  ],
  steps: [
    {
      title: "A caller asks",
      detail: "To book, change or cancel an appointment, or to ask a question.",
      pending: "Waiting",
      done: "Received",
    },
    {
      title: "The assistant checks the calendar",
      detail: "It looks up open times in Google Calendar and offers them to the caller.",
      pending: "Waiting",
      done: "Checked",
    },
    {
      title: "The booking is made",
      detail: "The appointment is written to Google Calendar and logged in Airtable.",
      pending: "Waiting",
      done: "Booked",
    },
  ],
  role: "designed and built the assistant on n8n and VAPI, connected to Google Calendar and Airtable.",
  workflowCaption: "The n8n workflow as built (screenshot).",
} as const;
