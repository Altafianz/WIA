import React, { useEffect } from "react";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  durationMs?: number;
}

export function Toast({ message, onDismiss, durationMs = 4000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [message, durationMs, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="toast"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-md border border-border bg-text px-4 py-2 text-sm text-text-inverse shadow-md"
    >
      {message}
    </div>
  );
}
