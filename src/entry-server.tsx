// Static prerender entry (used only by `npm run build:prerender`).
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppRoutes } from "./routes";
import { headTags, metaForPath } from "./lib/route-meta";
import { sitemapPaths } from "./lib/sitemap";

export { sitemapPaths };

export function render(url: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  );
  return { html, head: headTags(metaForPath(url)) };
}
