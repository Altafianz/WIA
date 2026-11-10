import React from "react";
import { Link } from "react-router-dom";
import { Info, TriangleAlert } from "lucide-react";
import { copy } from "../../content/copy.id.js";
import {
  getLegacyDataNoticeCopy,
  getPeriodNoticeCopy,
} from "../../lib/simple-text.js";
import { useDismissibleNotice } from "../../hooks/useDismissibleNotice.js";
import { NoticePopup } from "../common/NoticePopup.js";

interface PeriodNoticeProps {
  periodStatus?: "approved" | "partial" | "final";
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
  const notice =
    periodStatus === undefined || (periodStatus === "final" && !isLegacyYear)
      ? null
      : isLegacyYear
        ? getLegacyDataNoticeCopy(simple)
        : getPeriodNoticeCopy(simple, periodStatus);
  const triggerKey = notice
    ? `period:${fiscalYear ?? periodStatus}`
    : null;
  const { isOpen, dismiss, popupRef } = useDismissibleNotice(triggerKey);

  if (!notice) return null;

  const isInfo = periodStatus === "approved" || isLegacyYear;

  return (
    <NoticePopup
      open={isOpen}
      onDismiss={dismiss}
      popupRef={popupRef}
      testId="period-notice"
      icon={
        isInfo ? <Info className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4" />
      }
    >
      {renderMessage(notice)}
    </NoticePopup>
  );
}
