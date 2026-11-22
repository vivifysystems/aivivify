import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { projects } from "../data";

export default defineTool({
  name: "get_project",
  title: "Get project case study",
  description:
    "Return the full case study (problem, solution, result, stack) for one VIVIFY project by id. Use list_projects first to discover ids.",
  inputSchema: {
    id: z.string().min(1).describe("Project id from list_projects, e.g. 'ai-voice-receptionist'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const p = projects.find((x) => x.id === id);
    if (!p) {
      return {
        content: [{ type: "text", text: `No project with id "${id}". Call list_projects to see valid ids.` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(p, null, 2) }],
      structuredContent: { project: p },
    };
  },
});
