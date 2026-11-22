// Starts the server + browser once per test file and exposes them.
import { launch, startStatic, distDir } from "./helpers.mjs";

export async function setup(api) {
  const external = process.env.BASE_URL;
  const server = external ? null : await startStatic(distDir, api);
  const browser = await launch();
  return {
    base: external ?? server.url,
    browser,
    async teardown() {
      await browser.close();
      await server?.close();
    },
  };
}
