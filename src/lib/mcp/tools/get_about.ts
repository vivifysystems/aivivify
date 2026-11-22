import { defineTool } from "@lovable.dev/mcp-js";
import { about, results } from "../data";

export default defineTool({
  name: "get_about",
  title: "Get about VIVIFY Solutions",
  description:
    "Return the short bio and brand info for VIVIFY Solutions / Viviene Pitogo, plus any owner-verified statistics (currently none are published).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      { type: "text", text: JSON.stringify({ about, results }, null, 2) },
    ],
    structuredContent: { about, results },
  }),
});
