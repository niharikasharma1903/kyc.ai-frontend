export function splitSections(html: string): Record<string,string> {
  const sections: Record<string,string> = {};
  const parts = html.split(/<h2>(.*?)<\/h2>/g).filter(Boolean);
  for (let i = 1; i < parts.length; i += 2) {
    const key = parts[i].trim().toLowerCase().replace(/\s+/g, "-");
    sections[key] = `<h2>${parts[i]}</h2>${parts[i+1]}`;
  }
  return sections;
}