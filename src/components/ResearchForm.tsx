
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface FormValues {
  companyName: string;
  companyUrl: string;
  companyHq: string;
  companyIndustry: string;
}

const ResearchForm = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    companyName: "",
    companyUrl: "",
    companyHq: "",
    companyIndustry: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValues.companyName.trim()) {
      toast({
        title: "Error",
        description: "Company name is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://kyc-api.up.railway.app/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        	company: formValues.companyName,
        	company_url: formValues.companyUrl,
        	hq_location: formValues.companyHq,
        	industry: formValues.companyIndustry,
		}),
      });
      
	if (!response.ok) throw new Error("API request failed");

    const data = await response.json();
    const jobId = data.job_id;
      
 
    const ws = new WebSocket(`wss://https://kyc-api.up.railway.app/research/ws/${jobId}`);
    
    ws.onopen = () => {
      console.log("✅ WebSocket connection opened.");
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
      toast({
        title: "WebSocket Error",
        description: "Could not retrieve report.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    };

    ws.onmessage = (event) => {
      console.log("📩 WebSocket message received:", event.data);
      try {
        const message = JSON.parse(event.data);
        console.log("📦 Parsed message:", message);

        if (
          message.type === "status_update" &&
          message.data?.status === "completed" &&
          message.data?.result?.report
        ) {
          console.log("✅ Report complete. Navigating...");

          localStorage.setItem("reportHtml", message.data.result.report);
          localStorage.setItem("companyName", formValues.companyName);

          setIsSubmitting(false);

          toast({
            title: "Success",
            description: "Report ready. Redirecting...",
          });

          ws.close();
          setTimeout(() => {
            navigate("/report");
          }, 100);
        } else {
          console.log("🕓 Status not completed yet. Message:", message);
        }
      } catch (err) {
        console.error("❌ Error parsing WebSocket message:", err);
      }
    };
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      toast({
        title: "WebSocket Error",
        description: "Could not retrieve report.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    };
  } catch (error) {
    console.error(error);
    toast({
      title: "Error",
      description: "Failed to submit research request. Please try again.",
      variant: "destructive",
    });
    setIsSubmitting(false);
  }
};

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Company Research</CardTitle>
        <CardDescription className="text-center">
          Enter company details to start research
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
            <Input
              id="companyName"
              name="companyName"
              placeholder="Enter company name"
              value={formValues.companyName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyUrl">Company URL (optional)</Label>
            <Input
              id="companyUrl"
              name="companyUrl"
              placeholder="https://example.com"
              value={formValues.companyUrl}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyHq">Company HQ (optional)</Label>
            <Input
              id="companyHq"
              name="companyHq"
              placeholder="City, Country"
              value={formValues.companyHq}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyIndustry">Company Industry (optional)</Label>
            <Input
              id="companyIndustry"
              name="companyIndustry"
              placeholder="e.g., Technology, Healthcare"
              value={formValues.companyIndustry}
              onChange={handleInputChange}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full text-lg py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Start Research"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        We'll analyze the company and provide detailed insights.
      </CardFooter>
    </Card>
  );
};

export default ResearchForm;
