
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAllTestData, clearAllTestData } from "@/utils/testDataGenerator";

const TestDataManager = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const handleGenerateData = async () => {
    setIsGenerating(true);
    try {
      const result = await generateAllTestData();
      if (result.success) {
        toast({
          title: "Success",
          description: "Test data generated successfully! Check the dashboard for sample bookings, messages, and vouchers.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to generate test data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate test data.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      const result = await clearAllTestData();
      if (result.success) {
        toast({
          title: "Success",
          description: "Test data cleared successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to clear test data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear test data.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gold/20 mb-6">
      <CardHeader>
        <CardTitle className="text-gold flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Test Data Management
        </CardTitle>
        <p className="text-gray-300 text-sm">
          Generate or clear test data to test the admin dashboard functionality.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <Button
            onClick={handleGenerateData}
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Database className="h-4 w-4 mr-2" />
            )}
            Generate Test Data
          </Button>
          
          <Button
            onClick={handleClearData}
            disabled={isClearing}
            variant="destructive"
          >
            {isClearing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Clear Test Data
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-gray-700 rounded text-sm text-gray-300">
          <p><strong>Test data includes:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>5 sample bookings with different statuses (John Doe, Jane Smith, etc.)</li>
            <li>4 contact messages with various inquiries</li>
            <li>3 gift vouchers with different amounts and statuses</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestDataManager;
