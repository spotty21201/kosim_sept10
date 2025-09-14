"use client";

import { useState, useEffect } from "react";
import { useWizardStore } from "@/lib/store/wizard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CurrencyInput } from "@/components/CurrencyInput";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function CostsOperationsForm() {
  const { capex, opex, updateCosts } = useWizardStore();
  const [localCapex, setLocalCapex] = useState(capex);
  const [localOpex, setLocalOpex] = useState(opex);

  const debouncedCapex = useDebounce(localCapex, 500);
  const debouncedOpex = useDebounce(localOpex, 500);

  useEffect(() => {
    updateCosts({ capex: debouncedCapex, opex: debouncedOpex });
  }, [debouncedCapex, debouncedOpex, updateCosts]);

  const handleCapexChange = (field: keyof typeof capex, value: string) => {
    setLocalCapex((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handleOpexChange = (field: keyof typeof opex, value: string) => {
    setLocalOpex((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const calculateTotalCapex = () => {
    return Object.values(localCapex).reduce((sum, value) => sum + value, 0);
  };

  const calculateMonthlyOpex = () => {
    return Object.values(localOpex).reduce((sum, value) => sum + value, 0);
  };

  const calculateAnnualOpex = () => {
    return calculateMonthlyOpex() * 12;
  };

  return (
    <div className="space-y-8">
      {/* CAPEX Section */}
      <Card>
        <CardHeader>
          <CardTitle>Capital Expenditure (CAPEX)</CardTitle>
          <CardDescription>One-time costs to start your business</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="landCost">Land Cost</Label>
              <CurrencyInput
                id="landCost"
                value={localCapex.landCost}
                onValueChange={(v) => handleCapexChange("landCost", String(v))}
                helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="structureCost">Structure Cost</Label>
              <CurrencyInput
                id="structureCost"
                value={localCapex.structureCost}
                onValueChange={(v) => handleCapexChange("structureCost", String(v))}
                helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fitoutCost">Fitout Cost</Label>
              <CurrencyInput
                id="fitoutCost"
                value={localCapex.fitoutCost}
                onValueChange={(v) => handleCapexChange("fitoutCost", String(v))}
                helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sharedAreaCost">Shared Area Cost</Label>
              <CurrencyInput
                id="sharedAreaCost"
                value={localCapex.sharedAreaCost}
                onValueChange={(v) => handleCapexChange("sharedAreaCost", String(v))}
                helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brandingCost">Branding Cost</Label>
              <CurrencyInput
                id="brandingCost"
                value={localCapex.brandingCost}
                onValueChange={(v) => handleCapexChange("brandingCost", String(v))}
                helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workingCapital">Working Capital</Label>
              <CurrencyInput
                id="workingCapital"
                value={localCapex.workingCapital}
                onValueChange={(v) => handleCapexChange("workingCapital", String(v))}
                helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total CAPEX</span>
            <span className="text-2xl font-bold">
              Rp {calculateTotalCapex().toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* OPEX Section */}
      <Card>
        <CardHeader>
          <CardTitle>Operating Expenditure (OPEX)</CardTitle>
          <CardDescription>Monthly recurring costs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="caretakerSalary">Caretaker Salary</Label>
              <CurrencyInput
                id="caretakerSalary"
                value={localOpex.caretakerSalary}
                onValueChange={(v) => handleOpexChange("caretakerSalary", String(v))}
                helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cleaningSalary">Cleaning Staff Salary</Label>
              <CurrencyInput
                id="cleaningSalary"
                value={localOpex.cleaningSalary}
                onValueChange={(v) => handleOpexChange("cleaningSalary", String(v))}
                helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="utilities">Utilities</Label>
              <CurrencyInput
                id="utilities"
                value={localOpex.utilities}
                onValueChange={(v) => handleOpexChange("utilities", String(v))}
                helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="internet">Internet</Label>
              <CurrencyInput
                id="internet"
                value={localOpex.internet}
                onValueChange={(v) => handleOpexChange("internet", String(v))}
                helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maintenance">Maintenance</Label>
              <CurrencyInput
                id="maintenance"
                value={localOpex.maintenance}
                onValueChange={(v) => handleOpexChange("maintenance", String(v))}
                helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="marketing">Marketing</Label>
              <CurrencyInput
                id="marketing"
                value={localOpex.marketing}
                onValueChange={(v) => handleOpexChange("marketing", String(v))}
                helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tax">Tax</Label>
              <CurrencyInput
                id="tax"
                value={localOpex.tax}
                onValueChange={(v) => handleOpexChange("tax", String(v))}
                helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Monthly OPEX</span>
              <span className="text-2xl font-bold">
                Rp {calculateMonthlyOpex().toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Annual OPEX</span>
              <span className="text-2xl font-bold">
                Rp {calculateAnnualOpex().toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
