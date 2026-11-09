import React from "react";
import { Link } from "react-router-dom";
import { Info, TriangleAlert } from "lucide-react";
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
        className="font-semibold text-brand-800 underline decoration-dotted underline-offset-4 hover:text-brand-900"
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
  const isInfo = periodStatus === "approved" || isLegacyYear;

  return (
    <div
      role="note"
      className="flex max-w-prose items-start gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm leading-relaxed text-brand-900"
    >
      <span aria-hidden="true" className="mt-0.5 shrink-0 text-brand-700">
        {isInfo ? <Info className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4" />}
      </span>
      <span>{renderMessage(message)}</span>
    </div>
  );
}
