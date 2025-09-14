"use client";

interface ParkingSummaryProps {
  baseSpots: number;
  reducedSpots: number;
  finalSpots: number;
  reductions: { source: string; amount: number }[];
  adjustments: { source: string; amount: number }[];
}

export function ParkingSummary({
  baseSpots,
  reducedSpots,
  finalSpots,
  reductions,
  adjustments,
}: ParkingSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground">Base Required</div>
          <div className="text-2xl font-bold">{baseSpots}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">After Reductions</div>
          <div className="text-2xl font-bold">{reducedSpots}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Final Required</div>
          <div className="text-2xl font-bold">{finalSpots}</div>
        </div>
      </div>

      {reductions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Transport Reductions:</h4>
          <ul className="text-sm space-y-1">
            {reductions.map((reduction, index) => (
              <li key={index} className="flex justify-between">
                <span>{reduction.source}</span>
                <span>-{(reduction.amount * 100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {adjustments.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Area Adjustments:</h4>
          <ul className="text-sm space-y-1">
            {adjustments.map((adjustment, index) => (
              <li key={index} className="flex justify-between">
                <span>{adjustment.source}</span>
                <span>
                  {adjustment.amount > 0 ? "+" : ""}
                  {(adjustment.amount * 100).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
