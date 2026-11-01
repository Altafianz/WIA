import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div
      id="main-content"
      className={["mx-auto max-w-container px-4 py-8", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
