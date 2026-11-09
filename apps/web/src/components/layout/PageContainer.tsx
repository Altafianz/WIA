import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Full-bleed page wrapper. Horizontal rhythm comes from `.page-gutter`; the
 * content itself is never capped, so wide screens are filled by adding
 * columns rather than stretching the existing ones.
 */
export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div
      className={["page-gutter w-full py-8 lg:py-10", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
