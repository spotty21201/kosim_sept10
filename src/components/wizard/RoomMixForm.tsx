"use client";

import { useState, useEffect } from "react";
import { useWizardStore } from "@/lib/store/wizard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/CurrencyInput";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import type { RoomModule } from "@/lib/store/wizard";

export function RoomMixForm() {
  const { roomModules, totalRoomsTarget, setTotalRoomsTarget, updateRoomModules } = useWizardStore();
  const [localRooms, setLocalRooms] = useState<RoomModule[]>(roomModules || []);

  useEffect(() => {
    updateRoomModules(localRooms);
  }, [localRooms, updateRoomModules]);

  const addRoom = () => {
    setLocalRooms([
      ...localRooms,
      {
        type: "standard",
        size: 12,
        rent: 2000000,
        fitout: 15000000,
        count: 0,
        mix: 0,
      },
    ]);
  };

  const removeRoom = (index: number) => {
    setLocalRooms(localRooms.filter((_, i) => i !== index));
  };

  const updateRoom = (index: number, field: keyof RoomModule, value: any) => {
    const updatedRooms = localRooms.map((room, i) => {
      if (i === index) {
        return { ...room, [field]: value };
      }
      return room;
    });
    setLocalRooms(updatedRooms);
  };

  const calculateTotalArea = () => {
    return localRooms.reduce((total, room) => total + room.size, 0);
  };

  const calculateMonthlyRevenue = () => {
    return localRooms.reduce((total, room) => total + room.rent * (room.count || 0), 0);
  };

  const calculateTotalFitout = () => {
    return localRooms.reduce((total, room) => total + room.fitout * (room.count || 0), 0);
  };

  const totalRooms = () => localRooms.reduce((sum, r) => sum + (r.count || 0), 0);

  const handleMixChange = (index: number, mix: number) => {
    // Update mix and recompute count based on totalRoomsTarget
    const nextRooms = localRooms.map((room, i) => {
      if (i === index) {
        const newCount = Math.round((totalRoomsTarget || 0) * (mix / 100));
        return { ...room, mix, count: newCount };
      }
      return room;
    });
    setLocalRooms(nextRooms);
  };

  const handleCountChange = (index: number, countVal: number) => {
    const nextRooms = localRooms.map((room, i) => {
      if (i === index) {
        const count = Math.max(0, Math.floor(countVal) || 0);
        const mix = totalRoomsTarget > 0 ? Math.min(100, (count / totalRoomsTarget) * 100) : 0;
        return { ...room, count, mix };
      }
      return room;
    });
    setLocalRooms(nextRooms);
  };

  return (
    <div className="space-y-6">
      {/* Room List */}
      <Card>
        <CardHeader>
          <CardTitle>Total Rooms Target</CardTitle>
          <CardDescription>Use mix sliders to distribute counts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 max-w-sm">
            <Label htmlFor="totalRoomsTarget">Total Rooms</Label>
            <Input
              id="totalRoomsTarget"
              type="number"
              min={0}
              value={totalRoomsTarget}
              onChange={(e) => setTotalRoomsTarget(parseInt(e.target.value || '0'))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {localRooms.map((room, index) => (
          <Card key={index}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Room {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRoom(index)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`type-${index}`}>Room Type</Label>
                <Select
                  value={room.type}
                  onValueChange={(value: "standard" | "ensuite" | "premium") =>
                    updateRoom(index, "type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="standard">Standard Room</SelectItem>
                      <SelectItem value="ensuite">En-suite Room</SelectItem>
                      <SelectItem value="premium">Premium Room</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`size-${index}`}>Room Size (m²)</Label>
                <Input
                  id={`size-${index}`}
                  type="number"
                  value={room.size}
                  onChange={(e) =>
                    updateRoom(index, "size", parseFloat(e.target.value))
                  }
                  min={9}
                  max={24}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`rent-${index}`}>Monthly Rent (Rp)</Label>
                <CurrencyInput
                  id={`rent-${index}`}
                  value={room.rent}
                  onValueChange={(v) => updateRoom(index, "rent", v)}
                  helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`fitout-${index}`}>Fitout Cost (Rp)</Label>
                <CurrencyInput
                  id={`fitout-${index}`}
                  value={room.fitout}
                  onValueChange={(v) => updateRoom(index, "fitout", v)}
                  helperText="Gunakan angka penuh atau singkatan: 2.4jt, 2M, 1.2B"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`count-${index}`}>Count</Label>
                <Input
                  id={`count-${index}`}
                  type="number"
                  min={0}
                  value={room.count || 0}
                  onChange={(e) => handleCountChange(index, parseInt(e.target.value || '0'))}
                />
              </div>

              <div className="grid gap-2">
                <Label>Mix (%)</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={room.mix || 0}
                    onChange={(e) => handleMixChange(index, parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{Math.round(room.mix || 0)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Room Button */}
      <Button onClick={addRoom} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Room Type
      </Button>

      {/* Summary */}
      {localRooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Room Mix Summary</CardTitle>
            <CardDescription>Overview of your room configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <dt className="text-sm text-muted-foreground">Total Room Area</dt>
                <dd className="text-2xl font-bold">{calculateTotalArea()} m²</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-muted-foreground">Monthly Revenue (before occupancy)</dt>
                <dd className="text-2xl font-bold">
                  Rp {calculateMonthlyRevenue().toLocaleString()}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-muted-foreground">Total Fitout Cost</dt>
                <dd className="text-2xl font-bold">
                  Rp {calculateTotalFitout().toLocaleString()}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-muted-foreground">Total Rooms (sum)</dt>
                <dd className="text-2xl font-bold">{totalRooms()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
