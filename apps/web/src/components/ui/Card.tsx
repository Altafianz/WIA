import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  shadow?: "sm" | "md";
  padding?: "sm" | "md" | "lg";
  /** Hover affordance — only for cards that are clickable. */
  interactive?: boolean;
}

const shadowClass = {
  sm: "shadow-sm",
  md: "shadow-md",
};

const paddingClass = {
  sm: "p-5",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className = "",
  shadow = "sm",
  padding = "md",
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={[
        "rounded-2xl border border-border bg-card",
        shadowClass[shadow],
        paddingClass[padding],
        interactive
          ? "transition duration-150 hover:-translate-y-0.5 hover:shadow-md"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
