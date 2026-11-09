import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  shadow?: "sm" | "md";
  padding?: "sm" | "md" | "lg";
  interactive?: boolean;
}

const shadowClass = {
  sm: "shadow-sm",
  md: "shadow-md",
};

const paddingClass = {
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
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
      className={[
        "rounded-2xl border border-border bg-card",
        interactive
          ? "transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md motion-reduce:hover:translate-y-0"
          : "",
        shadowClass[shadow],
        paddingClass[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
