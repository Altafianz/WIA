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
      className="scroll-mt-24 border-b border-border pb-8 last:border-0"
    >
      <h2
        id={headingId}
        className="type-h2 mb-4 scroll-mt-24"
      >
        {title}
      </h2>
      <div className="space-y-4 text-base leading-relaxed text-text">{children}</div>
    </section>
  );
}
