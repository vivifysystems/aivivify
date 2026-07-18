import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { projects } from "../data";

export default defineTool({
  name: "list_projects",
  title: "List projects",
  description:
    "List every automation case study VIVIFY has shipped. Returns id, title, tag, one-line summary, and tech stack for each.",
  inputSchema: {
    stack: z
      .string()
      .optional()
      .describe("Optional tech to filter by, e.g. 'n8n', 'Gemini', 'VAPI'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ stack }) => {
    const filtered = stack
      ? projects.filter((p) =>
          p.stack.some((s) => s.toLowerCase().includes(stack.toLowerCase())),
        )
      : projects;
    const rows = filtered.map((p) => ({
      id: p.id,
      title: p.title,
      tag: p.tag,
      summary: p.summary,
      stack: p.stack,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, projects: rows },
    };
  },
});