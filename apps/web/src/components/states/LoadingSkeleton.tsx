import React from "react";

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={["animate-pulse rounded-md bg-border", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}

export function LoadingSkeleton({ rows = 4, className = "" }: LoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Memuat data anggaran..."
      className={["space-y-4", className].filter(Boolean).join(" ")}
    >
      {/* Summary cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border p-6 space-y-3">
            <SkeletonBox className="h-4 w-3/4" />
            <SkeletonBox className="h-8 w-full" />
            <SkeletonBox className="h-3 w-1/2" />
          </div>
        ))}
      </div>
      {/* Chart skeleton — fixed height to prevent CLS */}
      <div className="rounded-lg border border-border p-6 space-y-3">
        <SkeletonBox className="h-5 w-1/3" />
        <SkeletonBox className="h-[300px] w-full" />
      </div>
      {Array.from({ length: Math.max(rows - 2, 1) }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border p-6 space-y-3">
          <SkeletonBox className="h-5 w-1/4" />
          <SkeletonBox className="h-[200px] w-full" />
        </div>
      ))}
      <span className="sr-only">Memuat data anggaran...</span>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat..."
      className="rounded-lg border border-border p-6 animate-pulse space-y-3"
    >
      <SkeletonBox className="h-4 w-1/2" />
      <SkeletonBox className="h-8 w-full" />
      <span className="sr-only">Memuat...</span>
    </div>
  );
}
