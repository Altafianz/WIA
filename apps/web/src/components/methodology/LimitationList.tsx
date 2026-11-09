import React from "react";

interface LimitationListProps {
  items: readonly string[];
}

export function LimitationList({ items }: LimitationListProps) {
  return (
    <ul className="max-w-content list-disc space-y-2 pl-5 text-base text-text-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
