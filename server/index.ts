/**
 * A small JSON API for BorrowBox, built on Node's own http module (no
 * packages). Run it with `npm run api`. The Next.js app calls it from the
 * server, at API_BASE_URL (.env.local).
 *
 * Endpoints:
 *   GET  /api/items         all items: { "items": [...], "total": 14 }
 *   GET  /api/items/:id     one item, e.g. /api/items/item-103
 *   POST /api/requests      a new borrow request (JSON body)
 *
 * Test switches go right after /api and work on every endpoint
 * (server/testSwitches.ts): /api/delay/3000/..., /api/fail/500/...,
 * /api/empty/items.
 */
import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { isValidItemId } from "../src/features/cards/itemId.ts";
import { ITEMS } from "./data.ts";
import { readTestSwitches } from "./testSwitches.ts";

// Next.js uses 3000 during development
const PORT = 4000;

/** Larger bodies are refused, so nobody can fill the server's memory */
const MAX_BODY_LENGTH = 10_000;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** What a client must send to POST /api/requests */
interface RequestBody {
  itemId: string;
  borrowerId: string;
  startDate: string;
  endDate: string;
}

/** Borrow requests received since the server started (memory only) */
const requests: (RequestBody & { id: string })[] = [];

/** Sends a JSON body with a status code */
function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

/**
 * Reads the request body and parses it as JSON. The body arrives in pieces
 * ("chunks"), so this waits for the last one. Resolves to null when the body
 * is too large or is not valid JSON.
 */
function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > MAX_BODY_LENGTH) {
        resolve(null);
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(null);
      }
    });
  });
}

/** Never trust the client: check every field, even if the app checked it */
function isRequestBody(value: unknown): value is RequestBody {
  return (
    typeof value === "object" &&
    value !== null &&
    "itemId" in value &&
    "borrowerId" in value &&
    "startDate" in value &&
    "endDate" in value &&
    isValidItemId(value.itemId) &&
    typeof value.borrowerId === "string" &&
    typeof value.startDate === "string" &&
    typeof value.endDate === "string" &&
    ISO_DATE.test(value.startDate) &&
    ISO_DATE.test(value.endDate)
  );
}

/** Waits, so the app's loading state can be seen */
const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** GET /api/items and GET /api/items/:id */
function handleItems(
  pathname: string,
  empty: boolean,
  res: ServerResponse,
): void {
  if (pathname === "/api/items") {
    const items = empty ? [] : ITEMS;
    sendJson(res, 200, { items, total: items.length });
    return;
  }
  const id = pathname.slice("/api/items/".length);
  // The same rule the app uses for /items/:id
  if (!isValidItemId(id)) {
    sendJson(res, 400, { error: "Invalid item id" });
    return;
  }
  const item = ITEMS.find((candidate) => candidate.id === id);
  if (item) {
    sendJson(res, 200, item);
  } else {
    sendJson(res, 404, { error: "Item not found" });
  }
}

/** POST /api/requests */
async function handleNewRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const body = await readJson(req);
  if (!isRequestBody(body)) {
    sendJson(res, 400, { error: "Invalid request body" });
    return;
  }
  if (!ITEMS.some((item) => item.id === body.itemId)) {
    sendJson(res, 404, { error: "Item not found" });
    return;
  }
  const saved = { ...body, id: `req-${Date.now()}` };
  requests.push(saved);
  // 201 Created: something new was stored
  sendJson(res, 201, saved);
}

/** Picks the handler for a request */
async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  console.log(req.method, url.pathname);

  const { delayMs, empty, failStatus, pathname } = readTestSwitches(
    url.pathname,
  );
  if (delayMs > 0) await wait(delayMs);
  if (failStatus !== null) {
    sendJson(res, failStatus, { error: "Simulated failure" });
    return;
  }

  if (pathname === "/api/items" || pathname.startsWith("/api/items/")) {
    if (req.method !== "GET") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }
    handleItems(pathname, empty, res);
    return;
  }

  if (pathname === "/api/requests") {
    if (req.method !== "POST") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }
    await handleNewRequest(req, res);
    return;
  }

  sendJson(res, 404, { error: "Not found" });
}

createServer((req, res) => {
  // A bug in a handler answers 500 instead of crashing the server
  handleRequest(req, res).catch((error: unknown) => {
    console.error(error);
    sendJson(res, 500, { error: "Server error" });
  });
}).listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
