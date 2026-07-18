import { defineTool } from "@lovable.dev/mcp-js";
import { contact } from "../data";

export default defineTool({
  name: "get_contact_info",
  title: "Get contact info",
  description:
    "Return the public contact channels for VIVIFY Automation (email, website, LinkedIn, OnlineJobs.ph).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(contact, null, 2) }],
    structuredContent: { contact },
  }),
});
