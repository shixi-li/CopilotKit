import { expect, test } from "vitest";
import fs from "fs";
import path from "path";

function readContent(relativePath: string): string {
  return fs.readFileSync(
    path.join(process.cwd(), "src/content", relativePath),
    "utf8",
  );
}

test("lists the existing-app guide in both Intelligence navigation files", () => {
  const rootMeta = JSON.parse(readContent("docs/meta.json")) as {
    pages: unknown[];
  };
  const premiumMeta = JSON.parse(readContent("docs/premium/meta.json")) as {
    pages: unknown[];
  };

  const rootIndex = rootMeta.pages.indexOf(
    "premium/existing-app-hosted-intelligence",
  );
  const premiumIndex = premiumMeta.pages.indexOf(
    "existing-app-hosted-intelligence",
  );

  expect(rootIndex).toBe(
    rootMeta.pages.indexOf("premium/managed-intelligence-platform") + 1,
  );
  expect(premiumIndex).toBe(
    premiumMeta.pages.indexOf("managed-intelligence-platform") + 1,
  );
});

test("documents the managed Runtime, auth, UI, and verification contracts", () => {
  const guide = readContent(
    "docs/premium/existing-app-hosted-intelligence.mdx",
  );

  expect(guide).toContain("doc_type: how-to");
  expect(guide).toContain('surface="docs_existing_app_hosted_intelligence"');
  expect(guide).toContain("CPK_INTELLIGENCE_API_KEY");
  expect(guide).toContain("CPK_TELEMETRY_ID");
  expect(guide).toContain("https://api.intelligence.copilotkit.ai");
  expect(guide).toContain("wss://realtime.intelligence.copilotkit.ai");
  expect(guide).toContain("identifyUser");
  expect(guide).toContain("onRequest");
  expect(guide).toContain("export const GET = handler");
  expect(guide).toContain("export const POST = handler");
  expect(guide).toContain("export const PATCH = handler");
  expect(guide).toContain("export const DELETE = handler");
  expect(guide).toContain("CopilotKitProvider");
  expect(guide).toContain("useSingleEndpoint={false}");
  expect(guide).toContain("<CopilotThreadsDrawer />");
  expect(guide).toContain("two real app accounts");
});

test("links each public entry point back to the canonical guide", () => {
  const entryPoints = [
    "snippets/shared/cli/cli.mdx",
    "docs/premium/managed-intelligence-platform.mdx",
    "docs/integrations/built-in-agent/quickstart.mdx",
    "snippets/shared/basics/copilot-threads-drawer.mdx",
    "snippets/shared/threads/headless-threads.mdx",
  ];

  const contents = entryPoints.map(readContent);

  for (const content of contents) {
    expect(content).toContain("/premium/existing-app-hosted-intelligence");
  }

  expect(contents.join("\n")).not.toMatch(
    /(?:INTELLIGENCE_API_URL|INTELLIGENCE_GATEWAY_WS_URL|(?<!CPK_)INTELLIGENCE_API_KEY)/,
  );
  expect(contents[3]).not.toContain("publicLicenseKey=");
  expect(contents[4]).not.toContain(
    'import { CopilotRuntime } from "@copilotkit/runtime"',
  );
});
