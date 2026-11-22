import { defineMcp } from "@lovable.dev/mcp-js";
import listProjects from "./tools/list_projects";
import getProject from "./tools/get_project";
import getServices from "./tools/get_services";
import getContactInfo from "./tools/get_contact_info";
import getAbout from "./tools/get_about";

export default defineMcp({
  name: "vivify-automation-mcp",
  title: "VIVIFY Solutions",
  version: "0.2.0",
  instructions:
    "Public MCP server for VIVIFY Solutions, a founder-led AI automation and business systems consultancy run by Viviene Pitogo. Use `list_projects` to browse case studies and `get_project` for the problem / solution / result of one. `get_services` returns the systems and packages offered, with pilot and provider-dependent services labelled. `get_about` returns the founder bio and any owner-verified statistics (none are published yet). `get_contact_info` returns the website, email, LinkedIn and the booking link. All data is public — no authentication required.",
  tools: [listProjects, getProject, getServices, getContactInfo, getAbout],
});