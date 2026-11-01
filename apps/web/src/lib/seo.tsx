import React from "react";
import { Helmet } from "react-helmet-async";

export interface PageMetaProps {
  title: string;
  description: string;
  canonical?: string;
  path?: string;
}

export const PageMeta: React.FC<PageMetaProps> = ({
  title,
  description,
  canonical,
  path = "",
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const canonicalUrl = canonical || `${siteUrl}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};
