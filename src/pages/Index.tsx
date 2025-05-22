
import ResearchForm from "@/components/ResearchForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Company Intelligence</h1>
        <p className="text-center text-gray-600">Research any company with AI-powered insights</p>
      </div>
      <ResearchForm />
    </div>
  );
};

export default Index;
