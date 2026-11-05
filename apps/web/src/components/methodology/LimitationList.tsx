import React from "react";

interface LimitationListProps {
  items: readonly string[];
}

export function LimitationList({ items }: LimitationListProps) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-text-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
