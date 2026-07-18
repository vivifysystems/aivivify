import { defineTool } from "@lovable.dev/mcp-js";
import { about, results } from "../data";

export default defineTool({
  name: "get_about",
  title: "Get about VIVIFY",
  description:
    "Return the short bio, brand info, and headline impact metrics for VIVIFY Automation / Viviene Pitogo.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      { type: "text", text: JSON.stringify({ about, results }, null, 2) },
    ],
    structuredContent: { about, results },
  }),
});
