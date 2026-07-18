import { defineTool } from "@lovable.dev/mcp-js";
import { services, platforms } from "../data";

export default defineTool({
  name: "get_services",
  title: "Get services",
  description:
    "Return the automation services VIVIFY offers and the platforms Viviene works across.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      { type: "text", text: JSON.stringify({ services, platforms }, null, 2) },
    ],
    structuredContent: { services, platforms },
  }),
});
