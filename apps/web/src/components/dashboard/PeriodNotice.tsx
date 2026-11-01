import React from "react";
import { copy } from "../../content/copy.id.js";

interface PeriodNoticeProps {
  periodStatus: "approved" | "partial" | "final";
}

export function PeriodNotice({ periodStatus }: PeriodNoticeProps) {
  if (periodStatus === "final") return null;

  const message =
    periodStatus === "approved"
      ? copy.dashboard.realizationNotReleased
      : copy.dashboard.partialRealizationNotice;

  return (
    <div
      role="note"
      className={[
        "rounded-md border px-4 py-3 text-sm flex items-start gap-2",
        periodStatus === "approved"
          ? "border-info bg-brand-50 text-info"
          : "border-warning bg-surface text-warning",
      ].join(" ")}
    >
      <span aria-hidden="true">{periodStatus === "approved" ? "ℹ️" : "⏳"}</span>
      <span>{message}</span>
    </div>
  );
}
