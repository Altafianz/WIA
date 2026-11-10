import { afterEach, describe, expect, it, vi } from "vitest";
import { isDifferentRegionLevel } from "../lib/compare-params.js";
import {
  bindNoticeDismissal,
  dismissNoticeKey,
  isNoticeOpen,
} from "../hooks/useDismissibleNotice.js";

type Listener = (event: Event) => void;

function createEventTarget() {
  const listeners = new Map<string, Set<Listener>>();

  return {
    addEventListener(type: string, listener: Listener) {
      const bucket = listeners.get(type) ?? new Set<Listener>();
      bucket.add(listener);
      listeners.set(type, bucket);
    },
    removeEventListener(type: string, listener: Listener) {
      listeners.get(type)?.delete(listener);
    },
    dispatch(type: string, event: Event) {
      for (const listener of listeners.get(type) ?? []) listener(event);
    },
  };
}

describe("dismissible notice state", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("stays dismissed for the same trigger and reopens for a new trigger", () => {
    const original = new Set<string>();
    const next = dismissNoticeKey(original, "period:2021");

    expect(original.size).toBe(0);
    expect(isNoticeOpen("period:2021", next)).toBe(false);
    expect(isNoticeOpen("period:2022", next)).toBe(true);
    expect(isNoticeOpen("compare:a:b", next)).toBe(true);
    expect(isNoticeOpen(null, next)).toBe(false);
  });

  it("does not dismiss itself after 60 seconds", () => {
    vi.useFakeTimers();
    const dismissed = dismissNoticeKey(new Set<string>(), "period:2021");

    vi.advanceTimersByTime(60_000);

    expect(isNoticeOpen("period:2022", dismissed)).toBe(true);
  });

  it("closes on outside pointerdown but stays open on inside clicks", () => {
    const onDismiss = vi.fn();
    const target = createEventTarget();
    const inside = { id: "inside" };
    const outside = { id: "outside" };

    const cleanup = bindNoticeDismissal({
      dismiss: onDismiss,
      isInside: (event) => event.target === (inside as unknown as EventTarget),
      target,
    });

    target.dispatch("pointerdown", { target: inside } as unknown as Event);
    expect(onDismiss).not.toHaveBeenCalled();

    target.dispatch("pointerdown", { target: outside } as unknown as Event);
    expect(onDismiss).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it("closes on Escape but ignores other keys", () => {
    const onDismiss = vi.fn();
    const target = createEventTarget();

    const cleanup = bindNoticeDismissal({
      dismiss: onDismiss,
      isInside: () => false,
      target,
    });

    target.dispatch("keydown", { key: "Enter" } as unknown as Event);
    expect(onDismiss).not.toHaveBeenCalled();

    target.dispatch("keydown", { key: "Escape" } as unknown as Event);
    expect(onDismiss).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it("detects only province versus non-province pairs", () => {
    expect(
      isDifferentRegionLevel(
        "region",
        { level: "province" },
        { level: "city" }
      )
    ).toBe(true);
    expect(
      isDifferentRegionLevel(
        "region",
        { level: "city" },
        { level: "province" }
      )
    ).toBe(true);
    expect(
      isDifferentRegionLevel(
        "region",
        { level: "province" },
        { level: "province" }
      )
    ).toBe(false);
    expect(
      isDifferentRegionLevel(
        "region",
        { level: "city" },
        { level: "regency" }
      )
    ).toBe(false);
    expect(
      isDifferentRegionLevel(
        "year",
        { level: "province" },
        { level: "city" }
      )
    ).toBe(false);
  });
});
