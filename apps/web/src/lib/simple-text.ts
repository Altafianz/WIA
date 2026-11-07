import { copy } from "../content/copy.id.js";

export function getSimpleText<T extends string>(isSimple: boolean, normal: T, simple: T): T {
  return isSimple ? simple : normal;
}

export function getSectorChartCopy(isSimple: boolean) {
  return {
    title: isSimple ? copy.dashboard.sectorChartTitleSimple : copy.dashboard.sectorChartTitle,
    description: isSimple
      ? copy.dashboard.sectorChartDescriptionSimple
      : copy.dashboard.sectorChartDescription,
  };
}

export function getTrendChartCopy(isSimple: boolean) {
  return {
    title: isSimple ? copy.dashboard.trendChartTitleSimple : copy.dashboard.trendChartTitle,
    description: isSimple
      ? copy.dashboard.trendChartDescriptionSimple
      : copy.dashboard.trendChartDescription,
  };
}

export function getDataTableCopy(isSimple: boolean) {
  return {
    sectorHeader: isSimple ? copy.table.sectorHeaderSimple : copy.table.sectorHeader,
    paguHeader: isSimple ? copy.table.paguHeaderSimple : copy.table.paguHeader,
    realisasiHeader: isSimple ? copy.table.realisasiHeaderSimple : copy.table.realisasiHeader,
    rateHeader: isSimple ? copy.table.rateHeaderSimple : copy.table.rateHeader,
    shareHeader: isSimple ? copy.table.shareHeaderSimple : copy.table.shareHeader,
    yearHeader: isSimple ? copy.table.yearHeaderSimple : copy.table.yearHeader,
  };
}

export function getInsightPanelCopy(isSimple: boolean) {
  return {
    title: isSimple ? copy.dashboard.insightPanelTitleSimple : copy.dashboard.insightPanelTitle,
  };
}

export function getPeriodNoticeCopy(
  isSimple: boolean,
  periodStatus: "approved" | "partial" | "final"
): string {
  if (periodStatus === "approved") {
    return isSimple
      ? copy.dashboard.realizationNotReleasedSimple
      : copy.dashboard.realizationNotReleased;
  }
  return isSimple
    ? copy.dashboard.partialRealizationNoticeSimple
    : copy.dashboard.partialRealizationNotice;
}

export function getLegacyDataNoticeCopy(isSimple: boolean): string {
  return isSimple
    ? copy.dashboard.legacyDataNoticeSimple
    : copy.dashboard.legacyDataNotice;
}

export function getCompareCopy(isSimple: boolean) {
  return {
    title: isSimple ? copy.compare.titleSimple : copy.compare.title,
    description: isSimple ? copy.compare.descriptionSimple : copy.compare.description,
    deltaTitle: isSimple ? copy.compare.deltaTitleSimple : copy.compare.deltaTitle,
    sectorDeltaTitle: isSimple
      ? copy.compare.sectorDeltaTitleSimple
      : copy.compare.sectorDeltaTitle,
    columnPaguA: isSimple ? copy.compare.columnPaguASimple : copy.compare.columnPaguA,
    columnPaguB: isSimple ? copy.compare.columnPaguBSimple : copy.compare.columnPaguB,
  };
}

