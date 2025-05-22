import { marked } from "marked";

export function extractMarkdownSection(markdown: string, heading: string): string {
  const headingLine = `## ${heading}`;
  const headingRegex = new RegExp(`^##\\s${heading}`, "m");

  const startMatch = markdown.match(headingRegex);
  if (!startMatch) {
    return `<p>No ${heading} section found in the report.</p>`;
  }

  const startIndex = startMatch.index!;
  const rest = markdown.slice(startIndex + headingLine.length);
  const nextSectionIdx = rest.search(/^##\s/m); // look for next level-2 heading

  const section = nextSectionIdx !== -1
    ? rest.slice(0, nextSectionIdx)
    : rest;

  const htmlContent = marked.parse(section.trim());

  return `<h2>${heading}</h2>` + htmlContent;
}
