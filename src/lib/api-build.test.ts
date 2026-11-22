/// <reference types="node" />
// Vercel compiles each file under api/ (and what it imports) to JavaScript and runs the
// output, so emitted relative imports must point at .js files. A ".ts" specifier left in
// the output fails at runtime with ERR_MODULE_NOT_FOUND (reproduced with `vercel build`).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const root = new URL("../../", import.meta.url);
const files = ["api/contact.ts", "src/lib/contact-handler.ts", "src/lib/contact.ts"];

test("API function sources compile to .js import specifiers", () => {
  const { config } = ts.readConfigFile(new URL("tsconfig.json", root).pathname, ts.sys.readFile);
  const { options } = ts.convertCompilerOptionsFromJson(config.compilerOptions, root.pathname);
  for (const file of files) {
    const source = readFileSync(new URL(file, root), "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { ...options, noEmit: false },
      fileName: file,
    });
    const specifiers = [...outputText.matchAll(/from\s+["'](\.{1,2}\/[^"']+)["']/g)].map(
      (m) => m[1],
    );
    assert.ok(specifiers.length || file === "src/lib/contact.ts", `${file}: no imports found`);
    for (const s of specifiers) assert.match(s, /\.js$/, `${file} emits import "${s}"`);
  }
});
