import { AlertCircle, AlertTriangle } from "lucide-react";

interface ValidationMessageProps {
  error?: string;
  warning?: string;
}

export function ValidationMessage({ error, warning }: ValidationMessageProps) {
  if (!error && !warning) return null;

  return (
    <div className="mt-2">
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      {warning && (
        <div className="flex items-center gap-2 text-warning text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>{warning}</span>
        </div>
      )}
    </div>
  );
}
