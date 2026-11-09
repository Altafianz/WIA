import React from "react";

interface MethodologySectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function MethodologySection({
  id,
  title,
  children,
}: MethodologySectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={headingId}
      className="scroll-mt-24 border-b border-border pb-10 last:border-0 last:pb-0"
    >
      <h2
        id={headingId}
        className="mb-4 text-2xl font-bold tracking-tight text-text scroll-mt-24"
      >
        {title}
      </h2>
      <div className="space-y-4 text-base leading-relaxed text-text [&>p]:max-w-content">
        {children}
      </div>
    </section>
  );
}
