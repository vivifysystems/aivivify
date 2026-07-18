import { defineMcp } from "@lovable.dev/mcp-js";
import listProjects from "./tools/list_projects";
import getProject from "./tools/get_project";
import getServices from "./tools/get_services";
import getContactInfo from "./tools/get_contact_info";
import getAbout from "./tools/get_about";

export default defineMcp({
  name: "vivify-automation-mcp",
  title: "VIVIFY Automation",
  version: "0.1.0",
  instructions:
    "Public MCP server for VIVIFY Automation — the portfolio of Viviene Pitogo, an AI Automation Specialist. Use `list_projects` to browse case studies and `get_project` for a full problem / solution / result. `get_services` returns the categories of systems Viviene builds. `get_about` returns bio + headline impact metrics. `get_contact_info` returns how to reach her (email, LinkedIn, OnlineJobs.ph, website). All data is public — no authentication required.",
  tools: [listProjects, getProject, getServices, getContactInfo, getAbout],
});