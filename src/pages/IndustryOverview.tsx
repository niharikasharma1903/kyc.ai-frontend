import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { extractMarkdownSection } from "@/utils/reportUtils";
import ReportNavBar from "@/components/ReportNavBar";


const IndustryOverview = () => {
  const [sectionHtml, setSectionHtml] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const reportHtml = localStorage.getItem("reportHtml");

    if (!reportHtml) {
      navigate("/");
      return;
    }

    // 🔥 Use the new function to get just the Company Overview section
    const section = extractMarkdownSection(reportHtml, "Industry Overview");
    setSectionHtml(section);
  }, [navigate]);

  return (
<>
  <ReportNavBar />
    {    
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">
        {localStorage.getItem("companyName")} - Company Overview
      </h1>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div dangerouslySetInnerHTML={{ __html: sectionHtml }} />
      </div>

    </div>
    }
  <div className="max-w-4xl mx-auto px-4 py-8">
    <div dangerouslySetInnerHTML={{ __html: sectionHtml }} />
  </div>
</>    
  );
};


export default IndustryOverview;
