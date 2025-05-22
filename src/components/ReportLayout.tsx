

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ReportLayoutProps {
  title: string;
  children?: React.ReactNode;
}

export const ReportLayout = ({ title, children }: ReportLayoutProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const companyName = localStorage.getItem("companyName") || "Unknown Company";
  const reportHtml = localStorage.getItem("reportHtml");

  if (!companyName || !reportHtml) {
    navigate("/");
    return null;
  }

  const handleCopyReport = () => {
    if (reportHtml) {
      navigator.clipboard.writeText(reportHtml);
      toast.success("Report copied to clipboard");
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      
      const response = await fetch("http://192.168.1.51:8000/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: companyName,
          report_content: reportHtml
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${companyName.replace(/\s+/g, "_")}_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {companyName} - {title}
          </h1>
          <Button onClick={() => navigate("/")}>New Research</Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {children}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportLayout;
