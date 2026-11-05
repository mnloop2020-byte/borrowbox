import { test } from "node:test";
import assert from "node:assert/strict";
import { createItemsStore } from "../src/features/cards/itemsStore.ts";
import type { ApiResult } from "../src/shared/api/client.ts";
import { makeItem } from "./fakes.ts";

// A fake API: each call waits until the test answers it, so the test can
// look at the "loading" state before the answer arrives.
function fakeApi() {
  const pending: ((result: ApiResult) => void)[] = [];
  return {
    calls: () => pending.length,
    fetchItems: (): Promise<ApiResult> =>
      new Promise((resolve) => pending.push(resolve)),
    answer: (result: ApiResult) => pending[pending.length - 1](result),
  };
}
const photoUrl = (): string => "";
const settle = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

const { imageUrl, conditionImages, ...apiDrill } = makeItem({ id: "item-101" });
void imageUrl;
void conditionImages;
const okWith = (items: unknown[]): ApiResult => ({
  ok: true,
  data: { items, total: items.length },
});

test("starts loading on the first subscriber, and asks the API only once", () => {
  const api = fakeApi();
  const store = createItemsStore(api.fetchItems, photoUrl);
  assert.equal(api.calls(), 0, "nothing is fetched before a page needs it");

  const stopA = store.subscribe(() => {});
  const stopB = store.subscribe(() => {}); // a second page
  store.load();

  assert.deepEqual(store.getState(), { status: "loading" });
  assert.equal(api.calls(), 1, "one request for every page");
  stopA();
  stopB();
});

test("a good answer becomes success with the mapped items", async () => {
  const api = fakeApi();
  const store = createItemsStore(api.fetchItems, photoUrl);
  store.load();
  api.answer(okWith([apiDrill]));
  await settle();

  const state = store.getState();
  assert.equal(state.status, "success");
  assert.deepEqual(
    state.status === "success" ? state.items.map((item) => item.id) : [],
    ["item-101"],
  );
});

test("an empty list is success with no items (not an error)", async () => {
  const api = fakeApi();
  const store = createItemsStore(api.fetchItems, photoUrl);
  store.load();
  api.answer(okWith([]));
  await settle();
  assert.deepEqual(store.getState(), { status: "success", items: [] });
});

test("a 500 becomes error with its status code", async () => {
  const api = fakeApi();
  const store = createItemsStore(api.fetchItems, photoUrl);
  store.load();
  api.answer({ ok: false, status: 500 });
  await settle();
  assert.deepEqual(store.getState(), { status: "error", httpStatus: 500 });
});

test("an answer that is not { items } is an error, not a crash", async () => {
  const api = fakeApi();
  const store = createItemsStore(api.fetchItems, photoUrl);
  store.load();
  api.answer({ ok: true, data: "<html>" });
  await settle();
  assert.deepEqual(store.getState(), { status: "error", httpStatus: 0 });
});

test("retry after an error goes back to loading, then to success", async () => {
  const api = fakeApi();
  const store = createItemsStore(api.fetchItems, photoUrl);
  let changes = 0;
  store.subscribe(() => changes++);
  store.load();
  api.answer({ ok: false, status: 503 });
  await settle();

  store.retry();
  assert.deepEqual(store.getState(), { status: "loading" });
  assert.equal(api.calls(), 2, "retry asks the API again");

  api.answer(okWith([apiDrill]));
  await settle();
  assert.equal(store.getState().status, "success");
  assert.equal(changes, 3, "error, loading, success: each one tells the page");
});

test("retry while loading does not send a second request", () => {
  const api = fakeApi();
  const store = createItemsStore(api.fetchItems, photoUrl);
  store.load();
  store.retry();
  assert.equal(api.calls(), 1);
});

test("getState returns the same object until the state changes", async () => {
  // useSyncExternalStore needs this, or React draws again and again
  const api = fakeApi();
  const store = createItemsStore(api.fetchItems, photoUrl);
  store.load();
  assert.equal(store.getState(), store.getState());
  api.answer(okWith([apiDrill]));
  await settle();
  const success = store.getState();
  assert.equal(store.getState(), success);
});
