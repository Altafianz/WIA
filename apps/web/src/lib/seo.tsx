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
  path,
}) => {
  const configuredSiteUrl = import.meta.env.VITE_SITE_URL as string | undefined;
  const siteUrl = (
    configuredSiteUrl ||
    (typeof window !== "undefined" ? window.location.origin : "")
  ).replace(/\/+$/, "");
  const currentPath =
    path ||
    (typeof window !== "undefined" ? window.location.pathname : "/") ||
    "/";
  const cleanPath = currentPath.split(/[?#]/)[0] || "/";
  const canonicalUrl = canonical
    ? canonical.split(/[?#]/)[0]
    : `${siteUrl}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;

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
