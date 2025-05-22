
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Download } from "lucide-react";

interface ReportActionsProps {
  onCopy: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}

const ReportActions = ({ onCopy, onDownload, isDownloading }: ReportActionsProps) => {
  return (
    <div className="flex gap-2 mt-4 justify-end">
      <Button 
        variant="outline" 
        onClick={onCopy}
        className="flex items-center gap-2"
      >
        <Copy className="h-4 w-4" />
        Copy Report
      </Button>
      <Button 
        onClick={onDownload} 
        disabled={isDownloading}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {isDownloading ? "Downloading..." : "Download PDF"}
      </Button>
    </div>
  );
};

export default ReportActions;
