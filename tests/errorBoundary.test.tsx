import assert from "node:assert/strict";
import { test } from "node:test";
import { JSDOM } from "jsdom";
import { act, createElement, Suspense, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { ErrorBoundary } from "../src/shared/ui/ErrorBoundary.tsx";
import { useRetryableLazy } from "../src/app/useRetryableLazy.ts";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});
Object.defineProperties(globalThis, {
  window: { configurable: true, value: dom.window },
  document: { configurable: true, value: dom.window.document },
  navigator: { configurable: true, value: dom.window.navigator },
  HTMLElement: { configurable: true, value: dom.window.HTMLElement },
  Node: { configurable: true, value: dom.window.Node },
  IS_REACT_ACT_ENVIRONMENT: { configurable: true, value: true, writable: true },
});

const { createRoot } = await import("react-dom/client");

interface MountedTree {
  container: HTMLDivElement;
  unmount: () => Promise<void>;
}

async function mount(node: ReactNode): Promise<MountedTree> {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  await act(async () => root.render(node));
  return {
    container,
    unmount: async () => {
      await act(async () => root.unmount());
      container.remove();
    },
  };
}

async function withExpectedReactError<T>(run: () => Promise<T>): Promise<T> {
  const originalError = console.error;
  console.error = () => {};
  try {
    return await run();
  } finally {
    console.error = originalError;
  }
}

function ThrowingFeatured(): ReactNode {
  throw new Error("featured render failed");
}

function RecoveredPage(): ReactNode {
  return createElement("p", null, "The item page rendered after retry.");
}

test("a render error shows the fallback and retry remounts the child", async () => {
  let shouldThrow = true;
  function FlakySection(): ReactNode {
    if (shouldThrow) throw new Error("temporary section error");
    return createElement("p", null, "Section rendered again.");
  }

  const tree = await withExpectedReactError(() =>
    mount(
      createElement(ErrorBoundary, {
        title: "We couldn't display this part of BorrowBox",
        text: "Something went wrong while showing this content. Try again.",
        children: createElement(FlakySection),
      }),
    ),
  );

  assert.match(tree.container.textContent ?? "", /We couldn't display/);
  assert.match(tree.container.textContent ?? "", /Try again/);

  shouldThrow = false;
  await act(async () => {
    tree.container.querySelector("button")?.click();
  });
  assert.match(tree.container.textContent ?? "", /Section rendered again/);
  await tree.unmount();
});

test("a failed Featured section leaves independent homepage content visible", async () => {
  const tree = await withExpectedReactError(() =>
    mount(
      createElement(
        "div",
        null,
        createElement("header", null, "BorrowBox navigation"),
        createElement(
          "main",
          null,
          createElement("section", null, "Hero and categories"),
          createElement(ErrorBoundary, {
            title: "We couldn't display this part of BorrowBox",
            text: "Something went wrong while showing this content. Try again.",
            children: createElement(ThrowingFeatured),
          }),
          createElement("section", null, "How borrowing works"),
        ),
        createElement("footer", null, "BorrowBox footer"),
      ),
    ),
  );

  assert.match(tree.container.textContent ?? "", /BorrowBox navigation/);
  assert.match(tree.container.textContent ?? "", /Hero and categories/);
  assert.match(tree.container.textContent ?? "", /We couldn't display/);
  assert.match(tree.container.textContent ?? "", /How borrowing works/);
  assert.match(tree.container.textContent ?? "", /BorrowBox footer/);
  await tree.unmount();
});

test("a rejected lazy loader is called again only after explicit retry", async () => {
  let attempts = 0;
  let rejectFirstLoad: ((error: Error) => void) | undefined;
  const loader = (): Promise<{ default: ComponentType }> => {
    attempts += 1;
    if (attempts === 1) {
      return new Promise((_, reject) => {
        rejectFirstLoad = reject;
      });
    }
    return Promise.resolve({ default: RecoveredPage });
  };

  function RetryHarness(): ReactNode {
    const [retryToken, setRetryToken] = useState(0);
    const [parentRenders, setParentRenders] = useState(0);
    const LazyPage = useRetryableLazy(loader, retryToken);
    return createElement(
      "div",
      null,
      createElement(
        "button",
        {
          type: "button",
          onClick: () => setParentRenders((count) => count + 1),
        },
        `Normal parent render ${parentRenders}`,
      ),
      createElement(ErrorBoundary, {
        title: "We couldn't display this part of BorrowBox",
        text: "Something went wrong while showing this content. Try again.",
        onRetry: () => setRetryToken((token) => token + 1),
        children: createElement(
          Suspense,
          { fallback: createElement("p", null, "Loading item page…") },
          createElement(LazyPage),
        ),
      }),
    );
  }

  const tree = await mount(createElement(RetryHarness));
  assert.equal(attempts, 1);
  await act(async () => {
    tree.container.querySelector("button")?.click();
  });
  assert.equal(attempts, 1, "a normal parent render keeps the same lazy type");

  const reject = rejectFirstLoad;
  assert.ok(reject);
  await withExpectedReactError(async () => {
    await act(async () => {
      reject(new Error("simulated chunk load failure"));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });
  assert.match(tree.container.textContent ?? "", /We couldn't display/);
  assert.equal(attempts, 1);

  await act(async () => {
    tree.container
      .querySelector<HTMLButtonElement>(".state-error button")
      ?.click();
  });
  await act(async () => new Promise((resolve) => setTimeout(resolve, 0)));
  assert.equal(
    attempts,
    2,
    "retry creates a new lazy type and calls the loader again",
  );
  assert.match(
    tree.container.textContent ?? "",
    /item page rendered after retry/,
  );
  await tree.unmount();
});
