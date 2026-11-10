import { test } from "node:test";
import type { TestContext } from "node:test";
import assert from "node:assert/strict";
import { getJson, postJson } from "../src/shared/api/client.ts";

// The address comes from API_BASE_URL (.env.local in the app)
const API = "http://api.test/api";
process.env.API_BASE_URL = API;

// A fake fetch: the test chooses the answer, and no real server is needed.
// console.error is replaced too, so the test can read what was logged.

function fakeFetch(t: TestContext, answer: () => Promise<Response>) {
  return t.mock.method(globalThis, "fetch", answer);
}

function watchErrors(t: TestContext) {
  return t.mock.method(console, "error", () => {});
}

const loggedLines = (errors: ReturnType<typeof watchErrors>): string[] =>
  errors.mock.calls.map((call) => call.arguments.map(String).join(" "));

test("a successful request returns the data and logs nothing", async (t) => {
  fakeFetch(t, async () => Response.json({ id: "req-1" }, { status: 201 }));
  const errors = watchErrors(t);

  const result = await postJson("/requests", { itemId: "item-101" });

  assert.deepEqual(result, { ok: true, data: { id: "req-1" } });
  assert.equal(errors.mock.callCount(), 0);
});

test("the body is sent as JSON with POST", async (t) => {
  const calls = fakeFetch(t, async () => Response.json({}));
  watchErrors(t);

  await postJson("/requests", { itemId: "item-101" });

  const [url, init] = calls.mock.calls[0].arguments;
  assert.equal(url, `${API}/requests`);
  assert.equal(init?.method, "POST");
  assert.deepEqual(init?.headers, { "Content-Type": "application/json" });
  assert.equal(init?.body, JSON.stringify({ itemId: "item-101" }));
});

test("an error answer (500) is returned and logged with method, URL and status", async (t) => {
  fakeFetch(t, async () => new Response("boom", { status: 500 }));
  const errors = watchErrors(t);

  const result = await postJson("/requests", {});

  assert.deepEqual(result, { ok: false, status: 500 });
  assert.deepEqual(loggedLines(errors), [
    `[api] POST ${API}/requests failed: 500`,
  ]);
});

test("no connection is returned as status 0 and logged", async (t) => {
  fakeFetch(t, async () => {
    throw new TypeError("Failed to fetch");
  });
  const errors = watchErrors(t);

  const result = await postJson("/requests", {});

  assert.deepEqual(result, { ok: false, status: 0 });
  assert.deepEqual(loggedLines(errors), [
    `[api] POST ${API}/requests failed: no connection`,
  ]);
});

test("an answer that is not JSON is returned as status 0 and logged", async (t) => {
  fakeFetch(t, async () => new Response("<html>oops</html>", { status: 200 }));
  const errors = watchErrors(t);

  const result = await postJson("/requests", {});

  assert.deepEqual(result, { ok: false, status: 0 });
  assert.deepEqual(loggedLines(errors), [
    `[api] POST ${API}/requests failed: the answer is not JSON`,
  ]);
});

test("the log never contains the request body (it can hold personal data)", async (t) => {
  fakeFetch(t, async () => new Response("", { status: 400 }));
  const errors = watchErrors(t);

  await postJson("/requests", { borrowerId: "user-3", secret: "s3cr3t" });

  const text = loggedLines(errors).join("\n");
  assert.ok(!text.includes("s3cr3t"), text);
  assert.ok(!text.includes("user-3"), text);
});

// ---- One place for the address: API_BASE_URL

test("paths are joined to API_BASE_URL, so the address is written once", async (t) => {
  const calls = fakeFetch(t, async () => Response.json({}));
  watchErrors(t);

  process.env.API_BASE_URL = `${API}/delay/3000/`; // a test switch, with a slash
  await postJson("/requests", {});
  process.env.API_BASE_URL = API;

  assert.equal(calls.mock.calls[0].arguments[0], `${API}/delay/3000/requests`);
});

test("a missing API_BASE_URL is a clear error, not a request to nowhere", async () => {
  delete process.env.API_BASE_URL;
  await assert.rejects(getJson("/items"), /API_BASE_URL is not set/);
  process.env.API_BASE_URL = API;
});

// ---- GET

test("getJson sends a GET and returns the data", async (t) => {
  const calls = fakeFetch(t, async () =>
    Response.json({ items: [], total: 0 }),
  );
  const errors = watchErrors(t);

  const result = await getJson("/items");

  assert.deepEqual(result, { ok: true, data: { items: [], total: 0 } });
  const [url, init] = calls.mock.calls[0].arguments;
  assert.equal(url, `${API}/items`);
  assert.equal(init?.method, "GET");
  assert.equal(init?.body, undefined, "a GET has no body");
  assert.equal(errors.mock.callCount(), 0);
});

test("a failed GET is returned and logged like a POST", async (t) => {
  fakeFetch(t, async () => new Response("", { status: 503 }));
  const errors = watchErrors(t);

  const result = await getJson("/items");

  assert.deepEqual(result, { ok: false, status: 503 });
  assert.deepEqual(loggedLines(errors), [`[api] GET ${API}/items failed: 503`]);
});

test("404 is an answer, not a failure: returned but not logged", async (t) => {
  fakeFetch(t, async () => new Response("", { status: 404 }));
  const errors = watchErrors(t);

  const result = await getJson("/items/item-999");

  assert.deepEqual(result, { ok: false, status: 404 });
  assert.equal(errors.mock.callCount(), 0);
});
