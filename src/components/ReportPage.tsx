// src/components/ReportPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReportLayout from "./ReportLayout";
import ReportNavBar  from "./ReportNavBar";
import ReportActions from "./ReportActions";
import { markdownToHtml } from "@/utils/markdownToHtml";
import { splitSections  } from "@/utils/splitSections";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import React from "react";

const ALL_TABS = [
  { key: "company-overview",   label: "Company Overview"   },
  { key: "industry-overview",  label: "Industry Overview"  },
  { key: "financial-overview", label: "Financial Overview" },
  { key: "news",               label: "News"               },
  { key: "references",         label: "References"         },
];

export default function ReportPage() {
  const [sections, setSections] = useState<Record<string,string>>({});
  const [activeTab, setActiveTab] = useState(ALL_TABS[0].key);
  const navigate = useNavigate();

  useEffect(() => {
    const md   = localStorage.getItem("reportHtml") || "";
    const html = markdownToHtml(md);
    setSections(splitSections(html));
  }, []);

  const companyName = localStorage.getItem("companyName") || "Report";
  const activeLabel = ALL_TABS.find((t) => t.key === activeTab)!.label;
  const contentHtml = sections[activeTab] || `<p>No ${activeLabel} found.</p>`;
  const subsections = React.useMemo(() => {
  // Split on each <h3>…</h3>, keeping the tag in the result
      const parts = contentHtml.split(/(?=<h3>)/g).filter(Boolean);

    return parts.map((html) => {
      const headingMatch = html.match(/<h3>(.*?)<\/h3>/);
      const heading = headingMatch ? headingMatch[1] : "";
      const bodyHtml = html.replace(/^<h3>.*?<\/h3>/, "");
      return { heading, bodyHtml };
    });
  }, [contentHtml]);

  

  // reuse layout's download handler or implement your own here
  const handleCopy = () => {
    const report = localStorage.getItem("reportHtml");
    if (report) navigator.clipboard.writeText(report);
  };

  const handleDownload = () => {
    // you can call the same PDF endpoint here, or lift layout's handler up
  };

  return (
    <ReportLayout title={activeLabel}>
      <ReportNavBar
        tabs={ALL_TABS}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      <div className="flex justify-end space-x-2 mb-4 px-4">
        <ReportActions onCopy={handleCopy} onDownload={handleDownload} isDownloading={false}/>
      </div>

      {/* 2) render each subsection as its own Card */}
      <div className="space-y-6 px-4">
        {subsections.map(({ heading, bodyHtml }, idx) => (
          <Card key={idx} className="bg-white">
            <CardHeader>
              <CardTitle>{heading}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </ReportLayout>
  );
};