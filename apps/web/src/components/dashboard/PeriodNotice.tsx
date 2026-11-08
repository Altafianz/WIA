import React from "react";
import { Link } from "react-router-dom";
import { copy } from "../../content/copy.id.js";
import {
  getLegacyDataNoticeCopy,
  getPeriodNoticeCopy,
} from "../../lib/simple-text.js";

interface PeriodNoticeProps {
  periodStatus: "approved" | "partial" | "final";
  fiscalYear?: number;
  simple?: boolean;
}

function renderMessage(message: string) {
  const label = copy.nav.methodology;
  const index = message.lastIndexOf(label);
  if (index === -1) return message;

  return (
    <>
      {message.slice(0, index)}
      <Link
        to="/metodologi"
        className="text-brand-600 underline hover:text-brand-700"
      >
        {label}
      </Link>
      {message.slice(index + label.length)}
    </>
  );
}

export function PeriodNotice({
  periodStatus,
  fiscalYear,
  simple = false,
}: PeriodNoticeProps) {
  const isLegacyYear = fiscalYear !== undefined && fiscalYear < 2023;
  if (periodStatus === "final" && !isLegacyYear) return null;

  const message = isLegacyYear
    ? getLegacyDataNoticeCopy(simple)
    : getPeriodNoticeCopy(simple, periodStatus);

  return (
    <div
      role="note"
      className={[
        "rounded-md border px-4 py-3 text-sm flex items-start gap-2",
        periodStatus === "approved" || isLegacyYear
          ? "border-info bg-brand-50 text-info"
          : "border-warning bg-surface text-warning",
      ].join(" ")}
    >
      <span aria-hidden="true">
        {periodStatus === "approved" || isLegacyYear ? "i" : "!"}
      </span>
      <span>{renderMessage(message)}</span>
    </div>
  );
}
