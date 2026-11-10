import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

export type DismissedNoticeKeys = ReadonlySet<string>;

export function isNoticeOpen(
  triggerKey: string | null,
  dismissedKeys: DismissedNoticeKeys
): boolean {
  return triggerKey !== null && !dismissedKeys.has(triggerKey);
}

export function dismissNoticeKey(
  dismissedKeys: DismissedNoticeKeys,
  triggerKey: string | null
): DismissedNoticeKeys {
  if (triggerKey === null || dismissedKeys.has(triggerKey)) return dismissedKeys;
  const next = new Set(dismissedKeys);
  next.add(triggerKey);
  return next;
}

type NoticeEventTarget = {
  addEventListener: (type: string, listener: (event: Event) => void) => void;
  removeEventListener: (type: string, listener: (event: Event) => void) => void;
};

interface BindNoticeDismissalOptions {
  dismiss: () => void;
  isInside: (event: Event) => boolean;
  target?: NoticeEventTarget;
}

/** Binds outside-click and Escape dismissal; returns the cleanup function. */
export function bindNoticeDismissal({
  dismiss,
  isInside,
  target = document,
}: BindNoticeDismissalOptions): () => void {
  const handlePointerDown = (event: Event) => {
    if (!isInside(event)) dismiss();
  };
  const handleKeyDown = (event: Event) => {
    if ((event as KeyboardEvent).key === "Escape") dismiss();
  };

  target.addEventListener("pointerdown", handlePointerDown);
  target.addEventListener("keydown", handleKeyDown);

  return () => {
    target.removeEventListener("pointerdown", handlePointerDown);
    target.removeEventListener("keydown", handleKeyDown);
  };
}

interface DismissibleNotice {
  isOpen: boolean;
  dismiss: () => void;
  popupRef: RefObject<HTMLDivElement>;
}

/**
 * Keeps a notice dismissed per trigger key (year or region pair).
 * A new trigger opens a fresh notice; returning to a dismissed trigger
 * does not reopen it. There is intentionally no auto-dismiss timer.
 */
export function useDismissibleNotice(
  triggerKey: string | null
): DismissibleNotice {
  const [dismissedKeys, setDismissedKeys] = useState<DismissedNoticeKeys>(
    () => new Set()
  );
  const popupRef = useRef<HTMLDivElement>(null);
  const isOpen = isNoticeOpen(triggerKey, dismissedKeys);

  const dismiss = useCallback(() => {
    setDismissedKeys((current) => dismissNoticeKey(current, triggerKey));
  }, [triggerKey]);

  useEffect(() => {
    if (!isOpen) return;

    return bindNoticeDismissal({
      dismiss,
      isInside: (event) => {
        const target = event.target;
        return Boolean(
          popupRef.current &&
            target instanceof Node &&
            popupRef.current.contains(target)
        );
      },
    });
  }, [isOpen, dismiss]);

  return { isOpen, dismiss, popupRef };
}
