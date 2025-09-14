import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { useWizardStore } from "@/lib/store/wizard";
import { exportToExcel } from "@/lib/exports/excel-export";

interface ExportButtonProps {
  className?: string;
}

export function ExportButton({ className }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const store = useWizardStore();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await exportToExcel(store);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `KoSim-Project-${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      // You can add toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      Export Excel
    </Button>
  );
}
