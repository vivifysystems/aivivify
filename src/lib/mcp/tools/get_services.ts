import { defineTool } from "@lovable.dev/mcp-js";
import { services, systems, solutionPackages, pricing, platforms } from "../data";

export default defineTool({
  name: "get_services",
  title: "Get services",
  description:
    "Return the service groups, the individual systems and the packages VIVIFY Solutions offers (pilot and provider-dependent services are labelled), plus the platforms used in its projects.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      { type: "text", text: JSON.stringify({ services, systems, packages: solutionPackages, pricing, platforms }, null, 2) },
    ],
    structuredContent: { services, systems, packages: solutionPackages, pricing, platforms },
  }),
});
