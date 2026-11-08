import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Info } from "lucide-react";
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
        className="font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
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
  const Icon = isInfo ? Info : AlertTriangle;

  return (
    <div
      role="note"
      className={[
        "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-relaxed",
        isInfo
          ? "border-info-200 bg-info-50 text-info"
          : "border-warning-200 bg-warning-50 text-warning",
      ].join(" ")}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{renderMessage(message)}</span>
    </div>
  );
}
