import { test } from "node:test";
import assert from "node:assert/strict";
import {
  EXIT_MS,
  VISIBLE_MS,
  showToast,
  toastStore,
} from "../src/shared/ui/toastStore.ts";

const getToasts = () => toastStore.getState().toasts;

// mock.timers: setTimeout waits for tick(), so the test controls the clock.
// A timer created during a tick() waits for the next tick(), so the exit
// timer (created when the toast starts leaving) always gets its own tick().

test("a toast is shown, starts leaving, then is removed", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  showToast("Saved");
  assert.deepEqual(
    getToasts().map((toast) => [toast.message, toast.type, toast.leaving]),
    [["Saved", "success", false]],
  );

  t.mock.timers.tick(VISIBLE_MS.success);
  assert.equal(getToasts()[0].leaving, true);

  t.mock.timers.tick(EXIT_MS);
  assert.equal(getToasts().length, 0);
});

test("an error toast stays longer than a success toast", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  showToast("Failed", "error");
  t.mock.timers.tick(VISIBLE_MS.success);
  assert.equal(getToasts()[0].leaving, false, "still showing after 4s");
  t.mock.timers.tick(VISIBLE_MS.error - VISIBLE_MS.success);
  assert.equal(getToasts()[0].leaving, true);
  t.mock.timers.tick(EXIT_MS);
  assert.equal(getToasts().length, 0);
});

test("toasts stack oldest first, and each change is a new list", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const before = getToasts();
  showToast("First");
  const afterOne = getToasts();
  showToast("Second");
  assert.notEqual(before, afterOne, "React needs a new array to see a change");
  assert.deepEqual(
    getToasts().map((toast) => toast.message),
    ["First", "Second"],
  );
  t.mock.timers.tick(VISIBLE_MS.success);
  t.mock.timers.tick(EXIT_MS);
  assert.equal(getToasts().length, 0);
});

test("listeners hear every change until they unsubscribe", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let calls = 0;
  const stop = toastStore.subscribe(() => calls++);
  showToast("Hi");
  assert.equal(calls, 1);
  stop();
  t.mock.timers.tick(VISIBLE_MS.success);
  t.mock.timers.tick(EXIT_MS);
  assert.equal(calls, 1, "no calls after unsubscribing");
  assert.equal(getToasts().length, 0);
});
