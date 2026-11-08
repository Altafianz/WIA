import React from "react";

type PageContainerVariant = "default" | "sidebar";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * "sidebar" reserves a column for in-page navigation (used by pages that
   * render a table of contents). Both variants keep the full-width gutter.
   */
  variant?: PageContainerVariant;
}

const variantClass: Record<PageContainerVariant, string> = {
  default: "w-full",
  sidebar:
    "w-full lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-10",
};

export function PageContainer({
  children,
  className = "",
  variant = "default",
}: PageContainerProps) {
  return (
    <div
      id="main-content"
      className={["page-gutter py-8", variantClass[variant], className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
