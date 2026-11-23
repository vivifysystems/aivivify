import type { Demo } from "./schema.ts";

/**
 * Scripted service demonstrations. Every demo is a SIMULATION built around a
 * fictional sample business ("Harbor Plumbing"). No real customers, conversations,
 * search results, rankings or connected systems are shown, and no live integration
 * runs on this site. Phone numbers use the reserved 555-01xx fictional range.
 *
 * Each step has two sides:
 * - items: what the customer sees on their device
 * - ops:   what the system does behind the scenes (rules, records, notifications)
 */
export const SAMPLE_BUSINESS = "Harbor Plumbing";

const SIM = "Sample scenario.";

export const demos: readonly Demo[] = [
  {
    id: "chatbot",
    systemId: "ai-chatbot",
    title: "AI Website Chatbot",
    summary:
      "Customer inquiry → knowledge lookup → response → data collection → CRM record → staff notification.",
    device: "phone",
    screenTitle: "Website chat",
    simulationNote: SIM,
    preface: [
      {
        kind: "message",
        from: "assistant",
        text: "Hi! I'm Harbor's automated assistant. Ask about services, service areas or booking.",
      },
    ],
    steps: [
      {
        stage: "Customer inquiry",
        icon: "MessageCircleQuestionMark",
        caption:
          "A visitor asks a question on the website at 9:40 pm, after the office has closed.",
        items: [
          {
            kind: "message",
            from: "customer",
            text: "Hi, do you fix water heaters? Could someone come this week?",
          },
        ],
        ops: [
          { kind: "event", icon: "Globe", text: "New chat · website · after hours", tone: "cyan" },
        ],
      },
      {
        stage: "Knowledge lookup",
        icon: "BookOpenCheck",
        caption: "The assistant searches only the information the business approved.",
        items: [{ kind: "typing", from: "assistant" }],
        ops: [
          {
            kind: "card",
            title: "Approved knowledge · 3 matches",
            rows: [
              ["Services", "Water heater repair ✓"],
              ["Service area", "Eastside ✓"],
              ["Scheduling", "Team confirms times"],
            ],
            tone: "cyan",
          },
        ],
      },
      {
        stage: "Response",
        icon: "MessageSquareReply",
        caption:
          "It answers what it can, and is upfront that it's automated and can't promise a time.",
        items: [
          {
            kind: "message",
            from: "assistant",
            text: "Yes, we repair water heaters across Eastside. I can't confirm a time myself, but I can pass your request to the team.",
          },
        ],
        ops: [
          {
            kind: "event",
            icon: "ShieldCheck",
            text: "Reply uses approved info only · no time promised",
          },
        ],
      },
      {
        stage: "Data collection",
        icon: "ClipboardList",
        caption: "It collects just enough detail for the team to act.",
        items: [
          { kind: "message", from: "assistant", text: "What's your name, phone and suburb?" },
          { kind: "message", from: "customer", text: "Alex, 555-0142, Eastside" },
        ],
        ops: [
          {
            kind: "card",
            title: "Details captured",
            rows: [
              ["Name", "Alex"],
              ["Phone", "555-0142"],
              ["Area", "Eastside"],
            ],
            tone: "purple",
          },
        ],
      },
      {
        stage: "CRM record",
        icon: "Database",
        caption: "A lead is created in the CRM with the conversation attached.",
        items: [
          {
            kind: "message",
            from: "assistant",
            text: "Thanks Alex. I've passed this to the team; a person will contact you during business hours.",
          },
        ],
        ops: [
          {
            kind: "card",
            title: "CRM · New lead",
            rows: [
              ["Need", "Water heater repair"],
              ["Source", "Website chat"],
              ["Stage", "New inquiry"],
            ],
            tone: "cyan",
          },
        ],
      },
      {
        stage: "Staff notification",
        icon: "BellRing",
        caption: "The team gets a tidy task. A person takes it from here.",
        items: [],
        ops: [
          { kind: "event", icon: "BellRing", text: "Front desk notified", tone: "purple" },
          {
            kind: "card",
            title: "Task · Call Alex back",
            rows: [
              ["Due", "Next business morning"],
              ["Owner", "Front desk"],
            ],
          },
        ],
      },
    ],
  },
  {
    id: "receptionist",
    systemId: "ai-receptionist",
    title: "AI Receptionist (pilot)",
    summary:
      "Incoming call → AI conversation → request classification → callback request → human handoff.",
    device: "call",
    screenTitle: "Incoming call",
    simulationNote: "Sample call scenario. The AI Receptionist is a pilot service.",
    steps: [
      {
        stage: "Incoming call",
        icon: "PhoneIncoming",
        caption: "A call comes in while the whole team is out on jobs.",
        items: [{ kind: "event", icon: "PhoneIncoming", text: "Ringing · 555-0117", tone: "cyan" }],
        ops: [{ kind: "event", icon: "Users", text: "Team unavailable · AI receptionist answers" }],
      },
      {
        stage: "AI conversation",
        icon: "AudioLines",
        caption: "The assistant answers, says it's automated, and listens.",
        items: [
          {
            kind: "message",
            from: "assistant",
            text: "Thanks for calling Harbor Plumbing. I'm the automated assistant; the team is on jobs. How can I help?",
          },
          {
            kind: "message",
            from: "customer",
            text: "Water's leaking under my kitchen sink. Can someone call me back today?",
          },
        ],
        ops: [{ kind: "event", icon: "FileText", text: "Live transcript started", tone: "cyan" }],
      },
      {
        stage: "Request classification",
        icon: "Tags",
        caption: "It asks one clarifying question and classifies the request.",
        items: [
          {
            kind: "message",
            from: "assistant",
            text: "Is it leaking all the time, or only when the tap runs?",
          },
          { kind: "message", from: "customer", text: "Only when it's running." },
        ],
        ops: [
          {
            kind: "card",
            title: "Request classified",
            rows: [
              ["Type", "Repair · leak"],
              ["Urgency", "Same day"],
              ["Wants", "Callback"],
            ],
            tone: "purple",
          },
        ],
      },
      {
        stage: "Callback request",
        icon: "CalendarClock",
        caption: "A callback request is logged. Nothing is promised that the team can't keep.",
        items: [
          {
            kind: "message",
            from: "assistant",
            text: "I've requested a callback for this afternoon. A team member will confirm the time.",
          },
        ],
        ops: [
          {
            kind: "card",
            title: "Callback request",
            rows: [
              ["Caller", "555-0117"],
              ["Window", "This afternoon"],
              ["Status", "Awaiting team"],
            ],
            tone: "cyan",
          },
        ],
      },
      {
        stage: "Human handoff",
        icon: "UserRoundCheck",
        caption: "The call summary goes to a person, who makes the callback.",
        items: [{ kind: "event", icon: "PhoneOff", text: "Call ended · 1:12" }],
        ops: [
          { kind: "event", icon: "BellRing", text: "Summary sent to the team", tone: "purple" },
          {
            kind: "card",
            title: "Handoff · Front desk",
            rows: [
              ["Action", "Call back, confirm visit"],
              ["Notes", "Leak only when tap runs"],
            ],
          },
        ],
      },
    ],
  },
  {
    id: "missed-call",
    systemId: "missed-call-text-back",
    title: "Missed-Call Text Back",
    summary:
      "Missed call → messaging eligibility check → follow-up message → customer reply → staff notification.",
    device: "phone",
    screenTitle: "Business messages",
    simulationNote: SIM,
    steps: [
      {
        stage: "Missed call",
        icon: "PhoneMissed",
        caption: "The team can't pick up. Normally, that caller would simply try someone else.",
        items: [
          {
            kind: "event",
            icon: "PhoneMissed",
            text: "Missed call · 555-0163 · 2:14 pm",
            tone: "warn",
          },
        ],
        ops: [{ kind: "event", icon: "PhoneMissed", text: "Call unanswered · team on a job" }],
      },
      {
        stage: "Eligibility check",
        icon: "ShieldCheck",
        caption: "Messaging rules run first, so only eligible callers get a text.",
        items: [],
        ops: [
          {
            kind: "card",
            title: "Messaging rules",
            rows: [
              ["Mobile number", "Yes ✓"],
              ["Opted out", "No ✓"],
              ["Texted in 24 h", "No ✓"],
            ],
            tone: "cyan",
          },
        ],
      },
      {
        stage: "Follow-up message",
        icon: "Send",
        caption: "A short, friendly text goes out from the business number.",
        items: [
          {
            kind: "message",
            from: "assistant",
            channel: "SMS",
            text: "Hi, this is Harbor Plumbing. Sorry we missed your call! Reply with what you need and we'll get back to you shortly. Reply STOP to opt out.",
          },
        ],
        ops: [{ kind: "event", icon: "Send", text: "Text sent from the business number" }],
      },
      {
        stage: "Customer reply",
        icon: "MessageSquareReply",
        caption: "The caller replies instead of moving on.",
        items: [
          {
            kind: "message",
            from: "customer",
            channel: "SMS",
            text: "Blocked drain at our back unit. Anytime tomorrow is fine.",
          },
        ],
        ops: [
          { kind: "event", icon: "Inbox", text: "Reply routed to the shared inbox", tone: "cyan" },
        ],
      },
      {
        stage: "Staff notification",
        icon: "BellRing",
        caption: "The team gets a follow-up task with everything they need.",
        items: [],
        ops: [
          {
            kind: "card",
            title: "Follow-up task",
            rows: [
              ["From", "555-0163 (missed call)"],
              ["Need", "Blocked drain, back unit"],
              ["Timing", "Tomorrow, flexible"],
            ],
            tone: "purple",
          },
          { kind: "event", icon: "BellRing", text: "Next available technician notified" },
        ],
      },
    ],
  },
  {
    id: "review",
    systemId: "review-feedback",
    title: "Smart Review & Feedback",
    summary:
      "Service completed → unbiased invitation → customer feedback → genuine review or support conversation.",
    device: "phone",
    screenTitle: "Messages",
    simulationNote: `${SIM} Everyone invited receives the same invitation.`,
    preface: [
      {
        kind: "message",
        from: "assistant",
        channel: "SMS",
        text: "Reminder: your Harbor Plumbing visit is today at 10:00 am.",
      },
      { kind: "message", from: "customer", channel: "SMS", text: "Thanks, see you then." },
    ],
    steps: [
      {
        stage: "Service completed",
        icon: "CircleCheck",
        caption: "The technician marks the job complete.",
        items: [],
        ops: [
          {
            kind: "card",
            title: "Job complete",
            rows: [
              ["Service", "Water heater service"],
              ["Completed", "Today"],
            ],
            tone: "cyan",
          },
        ],
      },
      {
        stage: "Unbiased invitation",
        icon: "Send",
        caption: "Everyone invited gets the same neutral invitation. Nobody is screened out.",
        items: [
          {
            kind: "message",
            from: "assistant",
            channel: "SMS",
            text: "Thanks for choosing Harbor Plumbing. We'd value your honest feedback: leave a public review or send us a private message, whichever you prefer. Reply STOP to opt out.",
          },
        ],
        ops: [
          {
            kind: "event",
            icon: "ShieldCheck",
            text: "Same invitation for everyone invited · no screening",
          },
        ],
      },
      {
        stage: "Customer feedback",
        icon: "MessageSquareText",
        caption: "Both options carry equal weight. The customer decides.",
        items: [
          {
            kind: "choice",
            prompt: "How would you like to share feedback?",
            options: ["Leave a public review", "Send a private message"],
          },
        ],
        ops: [{ kind: "event", icon: "Scale", text: "Both options shown equally" }],
      },
      {
        stage: "Review or support",
        icon: "LifeBuoy",
        caption:
          "A public review goes to the review profile. A private message opens a support conversation.",
        items: [],
        ops: [
          {
            kind: "card",
            title: "What happens next",
            rows: [
              ["Public review", "Posted to the review profile"],
              ["Private message", "Owner follows up personally"],
            ],
            tone: "cyan",
          },
        ],
      },
      {
        stage: "Owner responds",
        icon: "Reply",
        caption: "The owner is alerted to respond to every review, positive or negative.",
        items: [],
        ops: [{ kind: "event", icon: "BellRing", text: "Owner alerted to reply", tone: "purple" }],
      },
    ],
  },
  {
    id: "website",
    systemId: "business-websites",
    title: "Functional Business Website",
    summary: "Website visitor → inquiry form → CRM record → staff notification.",
    device: "browser",
    screenTitle: "harborplumbing.example/blocked-drains",
    simulationNote: SIM,
    preface: [
      {
        kind: "card",
        title: "Blocked drains, cleared same week",
        rows: [
          ["Serving", "Eastside & North"],
          ["Next step", "Request a visit"],
        ],
      },
    ],
    steps: [
      {
        stage: "Visit",
        icon: "MousePointerClick",
        caption: "A visitor lands on a clear service page with one obvious next step.",
        items: [
          { kind: "event", icon: "MousePointerClick", text: "Visitor taps “Request a visit”" },
        ],
        ops: [{ kind: "event", icon: "Globe", text: "Page view · Blocked drains", tone: "cyan" }],
      },
      {
        stage: "Inquiry form",
        icon: "FileInput",
        caption: "A short form asks only what the team needs.",
        items: [
          {
            kind: "form",
            fields: [
              ["Name", "Sam"],
              ["Phone", "555-0188"],
              ["Problem", "Kitchen drain blocked"],
            ],
            submit: "Request a visit",
          },
        ],
        ops: [{ kind: "event", icon: "ShieldCheck", text: "Form validated · spam check passed" }],
      },
      {
        stage: "CRM record",
        icon: "Database",
        caption: "The inquiry becomes a CRM contact with its source and stage.",
        items: [
          {
            kind: "message",
            from: "system",
            text: "Thanks Sam, we've got your request and will call you back during business hours.",
          },
        ],
        ops: [
          {
            kind: "card",
            title: "CRM · New lead",
            rows: [
              ["Contact", "Sam · 555-0188"],
              ["Source", "Website · Blocked drains"],
              ["Stage", "New inquiry"],
            ],
            tone: "cyan",
          },
        ],
      },
      {
        stage: "Staff alert",
        icon: "BellRing",
        caption: "The right person is notified immediately.",
        items: [],
        ops: [
          { kind: "event", icon: "BellRing", text: "On-call team member notified", tone: "purple" },
        ],
      },
    ],
  },
  {
    id: "campaign",
    systemId: "marketing-campaigns",
    title: "Customer Marketing Campaign",
    summary: "Approved contacts → scheduling → delivery → customer interaction → opt-out handling.",
    device: "phone",
    screenTitle: "Messages",
    simulationNote: SIM,
    preface: [
      {
        kind: "message",
        from: "assistant",
        channel: "SMS",
        text: "Thanks for choosing Harbor Plumbing! Reply STOP anytime to opt out of updates.",
      },
    ],
    steps: [
      {
        stage: "Approved contacts",
        icon: "Users",
        caption: "Only past customers who agreed to hear from the business are included.",
        items: [],
        ops: [
          {
            kind: "card",
            title: "Audience · seasonal reminder",
            rows: [
              ["Included", "Past customers who opted in"],
              ["Excluded", "Opted out, recently contacted"],
            ],
            tone: "cyan",
          },
        ],
      },
      {
        stage: "Scheduling",
        icon: "CalendarClock",
        caption: "Sends are scheduled for a sensible hour, never late at night.",
        items: [],
        ops: [
          { kind: "event", icon: "CalendarClock", text: "Tuesday 10:00 · quiet hours respected" },
        ],
      },
      {
        stage: "Delivery",
        icon: "Send",
        caption: "A short, useful message with a clear way to opt out.",
        items: [
          {
            kind: "message",
            from: "assistant",
            channel: "SMS",
            text: "Hi from Harbor Plumbing! Winter's coming, a good time for a water heater check. Book online anytime. Reply STOP to opt out.",
          },
        ],
        ops: [{ kind: "event", icon: "Send", text: "Delivered to opted-in contacts" }],
      },
      {
        stage: "Interaction",
        icon: "MessageSquareReply",
        caption: "Interested customers reply, and the reply goes to the team.",
        items: [
          {
            kind: "message",
            from: "customer",
            channel: "SMS",
            text: "Yes please, next week works.",
          },
        ],
        ops: [
          { kind: "event", icon: "Inbox", text: "Reply routed to the shared inbox", tone: "cyan" },
        ],
      },
      {
        stage: "Opt-out handling",
        icon: "Ban",
        caption: "STOP works instantly and permanently.",
        items: [{ kind: "message", from: "customer", channel: "SMS", text: "STOP" }],
        ops: [
          {
            kind: "event",
            icon: "Ban",
            text: "Contact suppressed from future campaigns",
            tone: "warn",
          },
        ],
      },
    ],
  },
  {
    id: "local-seo",
    systemId: "local-seo",
    title: "Local SEO",
    summary: "Local search → relevant business result → website visit → customer inquiry.",
    device: "browser",
    screenTitle: "search.example",
    simulationNote: "Sample scenario, not real search results.",
    steps: [
      {
        stage: "Local search",
        icon: "Search",
        caption: "Someone nearby searches for what the business does.",
        items: [
          {
            kind: "search",
            query: "blocked drain plumber eastside",
            results: [
              { name: "Harbor Plumbing", line: "Plumber · Eastside · Open now", highlight: true },
              { name: "Another local plumber", line: "Plumber · nearby" },
            ],
          },
        ],
        ops: [],
      },
      {
        stage: "Business profile",
        icon: "MapPin",
        caption: "A complete profile shows hours, services and a link to the right page.",
        items: [],
        ops: [
          {
            kind: "card",
            title: "Profile fundamentals",
            rows: [
              ["Services", "Listed ✓"],
              ["Hours", "Up to date ✓"],
              ["Website link", "Service page ✓"],
            ],
            tone: "cyan",
          },
        ],
      },
      {
        stage: "Website visit",
        icon: "MousePointerClick",
        caption: "The visitor lands on a local service page, not a generic homepage.",
        items: [
          {
            kind: "event",
            icon: "MousePointerClick",
            text: "Opened “Blocked drains in Eastside”",
          },
        ],
        ops: [],
      },
      {
        stage: "Inquiry",
        icon: "Database",
        caption: "They send an inquiry, which flows into the CRM.",
        items: [],
        ops: [
          {
            kind: "card",
            title: "CRM · New lead",
            rows: [
              ["Need", "Blocked drain"],
              ["Source", "Local page"],
            ],
            tone: "purple",
          },
        ],
      },
    ],
  },
  {
    id: "inbox",
    systemId: "inbox-crm",
    title: "All-in-One Inbox & CRM",
    summary:
      "Website inquiry + supported messages → central inbox → lead qualification → booking status.",
    device: "desktop",
    screenTitle: "Shared inbox",
    simulationNote: SIM,
    steps: [
      {
        stage: "Three channels",
        icon: "Inbox",
        caption: "Messages arrive from the website, SMS and social at the same time.",
        items: [
          {
            kind: "message",
            from: "customer",
            channel: "Website form",
            text: "Need a quote for a new hot water system.",
          },
          {
            kind: "message",
            from: "customer",
            channel: "SMS",
            text: "Is anyone free today? Toilet won't stop running.",
          },
          {
            kind: "message",
            from: "customer",
            channel: "Social",
            text: "Do you service the north side?",
          },
        ],
        ops: [{ kind: "event", icon: "Inbox", text: "3 conversations · one inbox", tone: "cyan" }],
      },
      {
        stage: "Qualify",
        icon: "Tags",
        caption: "Each lead gets a stage and tags the team can scan quickly.",
        items: [],
        ops: [
          {
            kind: "card",
            title: "Lead stages",
            rows: [
              ["Hot water quote", "Qualified · quote"],
              ["Running toilet", "Urgent · today"],
              ["North side", "Answered"],
            ],
            tone: "purple",
          },
        ],
      },
      {
        stage: "Reply",
        icon: "MessageSquareReply",
        caption: "The team replies from one place, with full history.",
        items: [
          {
            kind: "message",
            from: "staff",
            channel: "SMS",
            text: "We can be there at 3 pm today. Does that work?",
          },
        ],
        ops: [],
      },
      {
        stage: "Booking status",
        icon: "CalendarCheck",
        caption: "Bookings update the lead automatically.",
        items: [],
        ops: [
          {
            kind: "card",
            title: "Booking status",
            rows: [
              ["Running toilet", "Booked · 3:00 pm"],
              ["Hot water quote", "Site visit · Thursday"],
            ],
            tone: "cyan",
          },
        ],
      },
    ],
  },
  {
    id: "lead-follow-up",
    systemId: "lead-follow-up",
    title: "Automated Lead Follow-Up",
    summary:
      "Inquiry → automated acknowledgement → scheduled follow-up → stop on reply → staff alert.",
    device: "phone",
    screenTitle: "Messages",
    simulationNote: SIM,
    preface: [
      {
        kind: "message",
        from: "system",
        text: "You sent a quote request on harborplumbing.example",
      },
    ],
    steps: [
      {
        stage: "New inquiry",
        icon: "FileInput",
        caption: "An inquiry arrives from the website form.",
        items: [],
        ops: [
          {
            kind: "event",
            icon: "FileInput",
            text: "Quote request · bathroom renovation",
            tone: "cyan",
          },
        ],
      },
      {
        stage: "Acknowledge",
        icon: "Send",
        caption: "The customer receives an automatic acknowledgement, so they know it arrived.",
        items: [
          {
            kind: "message",
            from: "assistant",
            channel: "SMS",
            text: "Thanks for reaching out to Harbor Plumbing! We've got your quote request and will be in touch within business hours.",
          },
        ],
        ops: [{ kind: "event", icon: "Repeat", text: "Follow-up sequence started" }],
      },
      {
        stage: "Follow-up",
        icon: "CalendarClock",
        caption: "No reply yet, so a gentle follow-up goes out on the approved schedule.",
        items: [
          {
            kind: "message",
            from: "assistant",
            channel: "SMS",
            text: "Hi again! Would a quick site visit help with your quote? Reply with a day that suits you, or STOP to opt out.",
          },
        ],
        ops: [
          { kind: "event", icon: "CalendarClock", text: "Day 2 follow-up · approved schedule" },
        ],
      },
      {
        stage: "Reply → stop",
        icon: "OctagonX",
        caption: "The customer replies, so the sequence stops automatically.",
        items: [
          { kind: "message", from: "customer", channel: "SMS", text: "Friday morning works." },
        ],
        ops: [
          {
            kind: "event",
            icon: "OctagonX",
            text: "Sequence stopped: customer replied",
            tone: "warn",
          },
        ],
      },
      {
        stage: "Team alert",
        icon: "BellRing",
        caption: "A person picks up the conversation from here.",
        items: [],
        ops: [
          {
            kind: "card",
            title: "Hot lead · ready to book",
            rows: [
              ["Request", "Bathroom renovation quote"],
              ["Availability", "Friday morning"],
            ],
            tone: "purple",
          },
        ],
      },
    ],
  },
  {
    id: "booking",
    systemId: "appointment-booking",
    title: "Smart Appointment Booking",
    summary: "Request → availability check → confirmation → reminder.",
    device: "phone",
    screenTitle: "Booking chat",
    simulationNote: SIM,
    steps: [
      {
        stage: "Request",
        icon: "MessageCircleQuestionMark",
        caption: "A customer asks to book a service.",
        items: [
          {
            kind: "message",
            from: "customer",
            text: "Can I book a water heater service next week?",
          },
        ],
        ops: [],
      },
      {
        stage: "Availability",
        icon: "CalendarSearch",
        caption: "Only times the business made available are offered.",
        items: [
          {
            kind: "card",
            title: "Available times",
            rows: [
              ["Tue", "9:00 am"],
              ["Wed", "1:00 pm"],
              ["Thu", "3:30 pm"],
            ],
            tone: "cyan",
          },
          { kind: "message", from: "customer", text: "Wednesday at 1 please." },
        ],
        ops: [
          { kind: "event", icon: "CalendarSearch", text: "Checked team calendar · 3 open slots" },
        ],
      },
      {
        stage: "Confirmation",
        icon: "CalendarCheck",
        caption: "The booking lands in the calendar and the customer gets a confirmation.",
        items: [
          {
            kind: "message",
            from: "assistant",
            text: "You're booked for Wednesday at 1:00 pm. You'll get a reminder the day before.",
          },
        ],
        ops: [
          {
            kind: "event",
            icon: "CalendarCheck",
            text: "Added to the team calendar",
            tone: "cyan",
          },
        ],
      },
      {
        stage: "Reminder",
        icon: "AlarmClock",
        caption: "A reminder with a reschedule link helps avoid no-shows and phone tag.",
        items: [
          {
            kind: "message",
            from: "assistant",
            channel: "SMS",
            text: "Reminder: Harbor Plumbing visit tomorrow at 1:00 pm. Need to change it? Use your reschedule link.",
          },
        ],
        ops: [{ kind: "event", icon: "AlarmClock", text: "Reminder sent the day before" }],
      },
    ],
  },
  {
    id: "workflow",
    systemId: "workflow-automation",
    title: "Workflow Automation & Reporting",
    summary: "Trigger → extract → file and log → report → error alert.",
    device: "desktop",
    screenTitle: "Automation log",
    simulationNote: "Sample scenario with sample data.",
    steps: [
      {
        stage: "Trigger",
        icon: "Mail",
        caption: "A supplier invoice arrives by email.",
        items: [
          {
            kind: "event",
            icon: "Mail",
            text: "New email with attachment · supplier invoice",
            tone: "cyan",
          },
        ],
        ops: [],
      },
      {
        stage: "Extract",
        icon: "ScanText",
        caption: "The key details are read from the document.",
        items: [],
        ops: [
          {
            kind: "card",
            title: "Invoice details",
            rows: [
              ["Supplier", "Sample Pipe Supplies"],
              ["Type", "Invoice"],
              ["Due", "End of month"],
            ],
            tone: "purple",
          },
        ],
      },
      {
        stage: "File & log",
        icon: "FolderCheck",
        caption: "It's renamed, filed in the right folder and logged in a spreadsheet.",
        items: [
          { kind: "event", icon: "FolderCheck", text: "Saved to Invoices / Sample Pipe Supplies" },
          { kind: "event", icon: "Sheet", text: "Row added to the accounts log" },
        ],
        ops: [],
      },
      {
        stage: "Report",
        icon: "ChartNoAxesColumn",
        caption: "A plain-English summary arrives at the end of the week.",
        items: [],
        ops: [
          {
            kind: "card",
            title: "Weekly summary",
            rows: [
              ["Invoices filed", "All logged"],
              ["Awaiting approval", "Listed for the owner"],
            ],
            tone: "cyan",
          },
        ],
      },
      {
        stage: "Error alert",
        icon: "TriangleAlert",
        caption: "If a step fails, a person is told immediately instead of it failing silently.",
        items: [],
        ops: [
          {
            kind: "event",
            icon: "TriangleAlert",
            text: "One file unreadable → owner alerted",
            tone: "warn",
          },
        ],
      },
    ],
  },
];

export function demoById(id: string): Demo | undefined {
  return demos.find((d) => d.id === id);
}
