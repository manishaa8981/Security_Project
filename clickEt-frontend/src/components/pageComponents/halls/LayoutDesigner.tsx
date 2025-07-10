import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { Armchair, Plus, X } from "lucide-react";
import { Card, CardContent } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { SectionState } from "@/interfaces/IHalls";

interface HallLayoutDesignerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: SectionState[];
  setSections: React.Dispatch<React.SetStateAction<SectionState[]>>;
}

const HallLayoutDesignerDialog = ({
  open,
  onOpenChange,
  sections,
  setSections,
}: HallLayoutDesignerDialogProps) => {
  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: Date.now(),
        rows: 6,
        columns: 6,
        startRow: "A",
        startNumber:
          prev[prev.length - 1]?.startNumber + prev[prev.length - 1]?.columns ||
          1,
        selectedSeats: new Set<string>(),
      },
    ]);
  };

  const removeSection = (id: number) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
  };

  const updateSection = (
    id: number,
    field: keyof Omit<SectionState, "id" | "selectedSeats">,
    value: number | string
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const toggleSeatSelection = (sectionId: number, seatId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          const newSelectedSeats = new Set(section.selectedSeats);
          if (newSelectedSeats.has(seatId)) {
            newSelectedSeats.delete(seatId);
          } else {
            newSelectedSeats.add(seatId);
          }
          return { ...section, selectedSeats: newSelectedSeats };
        }
        return section;
      })
    );
  };

  // Find the global row range across all sections
  const getGlobalRowRange = () => {
    const minRowChar = Math.min(...sections.map((s) => s.startRow.charCodeAt(0)));
    const maxRowChar = Math.max(
      ...sections.map((s) => s.startRow.charCodeAt(0) + s.rows - 1)
    );
    return {
      startChar: String.fromCharCode(minRowChar),
      endChar: String.fromCharCode(maxRowChar),
    };
  };

  const renderRowAcrossSections = (rowChar: string) => {
    return sections.map((section, index) => {
      const rowIndex = rowChar.charCodeAt(0) - section.startRow.charCodeAt(0);
      if (rowIndex < 0 || rowIndex >= section.rows) {
        return null;
      }

      const seats = [];
      for (let c = 0; c < section.columns; c++) {
        const seatNumber = section.startNumber + c;
        const seatId = `${rowChar}${seatNumber}`;
        const isSelected = section.selectedSeats.has(seatId);

        seats.push(
          <div
            key={seatId}
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => toggleSeatSelection(section.id, seatId)}
          >
            <Armchair
              className={`w-6 h-6 transition-colors ${
                isSelected ? "text-blue-600" : "text-gray-400"
              }`}
            />
            {isSelected && <span className="text-xs font-medium">{seatId}</span>}
          </div>
        );
      }

      return (
        <div key={`sect-${section.id}`} className="flex items-center">
          {index > 0 && <div className="mx-5" />}
          {seats}
        </div>
      );
    });
  };

  const renderAllRows = () => {
    const { startChar, endChar } = getGlobalRowRange();
    const rows = [];

    for (
      let rowCode = startChar.charCodeAt(0);
      rowCode <= endChar.charCodeAt(0);
      rowCode++
    ) {
      const rowChar = String.fromCharCode(rowCode);
      const rowSegments = renderRowAcrossSections(rowChar);

      // skip row if all segments are null
      if (rowSegments.every((seg) => seg === null)) {
        continue;
      }

      rows.push(
        <div key={`row-${rowChar}`} className="flex items-center gap-8">
          <div className="w-8 flex items-center justify-center font-medium">
            {rowChar}
          </div>
          <div className="flex">{rowSegments}</div>
        </div>
      );
    }

    return rows;
  };

  const renderBottomNumbers = () => {
    return (
      <div className="flex items-center mt-5">
        <div className="w-[4em]" />
        <div className="flex items-center">
          {sections.map((section, i) => {
            const nums = [];
            for (let c = 0; c < section.columns; c++) {
              const seatNumber = section.startNumber + c;
              nums.push(
                <div
                  key={`num-${section.id}-${seatNumber}`}
                  className="w-[25px] text-center text-sm font-medium"
                >
                  {seatNumber}
                </div>
              );
            }
            return (
              <div key={`nums-${section.id}`} className="flex items-center">
                {i > 0 && <div className="mx-[1rem]" />}
                {nums}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[80vw] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Theater Layout Designer</DialogTitle>
          <DialogDescription>
            Configure seats, rows, and columns for each section.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <Button onClick={addSection} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        {/* Sections Controls */}
        <div className="flex flex-wrap justify-center  gap-3 mb-8">
          {sections.map((section, index) => (
            <Card key={section.id} className="p-4 w-fit">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Section {index + 1}</h3>
                {sections.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(section.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Rows</Label>
                  <Input
                    type="number"
                    value={section.rows}
                    onChange={(e) =>
                      updateSection(section.id, "rows", Number(e.target.value))
                    }
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Columns</Label>
                  <Input
                    type="number"
                    value={section.columns}
                    onChange={(e) =>
                      updateSection(
                        section.id,
                        "columns",
                        Number(e.target.value)
                      )
                    }
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Row</Label>
                  <Input
                    type="text"
                    value={section.startRow}
                    onChange={(e) =>
                      updateSection(
                        section.id,
                        "startRow",
                        e.target.value.toUpperCase()
                      )
                    }
                    maxLength={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Number</Label>
                  <Input
                    type="number"
                    value={section.startNumber}
                    onChange={(e) =>
                      updateSection(
                        section.id,
                        "startNumber",
                        Number(e.target.value)
                      )
                    }
                    min="1"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Layout Preview */}
        <div className="mt-4 flex flex-col items-center gap-8">
          {/* Screen */}
          <div className="w-full max-w-3xl h-8 bg-primary rounded-sm flex items-center justify-center text-white">
            Screen
          </div>

          {/* Seats */}
          <div className="flex flex-col gap-2.5 items-center p-4 rounded-sm">
            {renderAllRows()}
            {renderBottomNumbers()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HallLayoutDesignerDialog;
