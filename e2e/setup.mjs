// Starts the server + browser once per test file and exposes them.
import { launch, startStatic, distDir, activeDistDir } from "./helpers.mjs";

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

/** Like setup(), but always serves the contact-form-ACTIVE build locally (BASE_URL is ignored). */
export async function setupActive(api) {
  const server = await startStatic(activeDistDir, api);
  const browser = await launch();
  return {
    base: server.url,
    browser,
    async teardown() {
      await browser.close();
      await server.close();
    },
  };
}
