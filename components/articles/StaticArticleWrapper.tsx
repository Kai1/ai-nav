interface StaticArticleWrapperProps {
  html: string;
}

/**
 * Renders the body content of a legacy static HTML article.
 * The html prop should already be the extracted <body> inner content.
 */
export default function StaticArticleWrapper({ html }: StaticArticleWrapperProps) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ width: "100%", minHeight: "60vh" }}
    />
  );
}
