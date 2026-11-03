import React from "react";
import { getPeriodNoticeCopy } from "../../lib/simple-text.js";

interface PeriodNoticeProps {
  periodStatus: "approved" | "partial" | "final";
  simple?: boolean;
}

export function PeriodNotice({ periodStatus, simple = false }: PeriodNoticeProps) {
  if (periodStatus === "final") return null;

  const message = getPeriodNoticeCopy(simple, periodStatus);

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
