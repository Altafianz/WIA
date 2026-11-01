import React from "react";
import { PageMeta } from "../lib/seo.js";

interface PlaceholderPageProps {
  pageName: string;
}

export function PlaceholderPage({ pageName }: PlaceholderPageProps) {
  return (
    <div className="py-12 min-h-[50vh]">
      <PageMeta title={pageName} description="" />
    </div>
  );
}
