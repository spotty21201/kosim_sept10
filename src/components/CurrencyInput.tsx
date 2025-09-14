"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { parseIDRCurrency } from "@/lib/utils/currencyParser";
import { formatIDR } from "@/lib/utils/currencyFormat";

type CurrencyInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  value: number;
  onValueChange: (value: number) => void;
  helperText?: string;
};

export function CurrencyInput({ value, onValueChange, onBlur, onFocus, helperText, className, ...rest }: CurrencyInputProps) {
  const [display, setDisplay] = useState<string>(value ? formatIDR(value) : "");
  const [focused, setFocused] = useState(false);
  const prevValueRef = useRef<number>(value);

  useEffect(() => {
    if (!focused && prevValueRef.current !== value) {
      setDisplay(value ? formatIDR(value) : "");
      prevValueRef.current = value;
    }
  }, [value, focused]);

  return (
    <div className="space-y-1">
      <Input
        inputMode="decimal"
        {...rest}
        className={className}
        value={display}
        onFocus={(e) => {
          setFocused(true);
          setDisplay(String(value || ""));
          onFocus?.(e);
        }}
        onChange={(e) => {
          const text = e.target.value;
          setDisplay(text);
          const parsed = parseIDRCurrency(text);
          if (!Number.isNaN(parsed)) onValueChange(parsed);
        }}
        onBlur={(e) => {
          setFocused(false);
          setDisplay(value ? formatIDR(value) : "");
          onBlur?.(e);
        }}
      />
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

