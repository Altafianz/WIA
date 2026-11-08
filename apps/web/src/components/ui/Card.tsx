import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: "sm" | "md";
  padding?: "sm" | "md" | "lg";
}

const shadowClass = {
  sm: "shadow-sm",
  md: "shadow-md",
};

const paddingClass = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className = "",
  shadow = "sm",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={[
        "bg-surface rounded-lg border border-border",
        shadowClass[shadow],
        paddingClass[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
