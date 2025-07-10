// EditHallDialog.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Hall, SectionState } from "@/interfaces/IHalls";
import { useFetchAllTheatres } from "@/api/theatreApi";
import { useUpdateHall } from "@/api/hallApi";
import HallLayoutDesignerDialog from "./LayoutDesigner";

interface EditHallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hall: Hall;
}

const EditHallDialog = ({ open, onOpenChange, hall }: EditHallDialogProps) => {
  const [formData, setFormData] = useState({
    theatreId: "",
    location: "",
    name: "",
  });

  const [sections, setSections] = useState<SectionState[]>([]);
  const [layoutDesignerOpen, setLayoutDesignerOpen] = useState(false);

  const { data: theatres } = useFetchAllTheatres();
  const updateHallMutation = useUpdateHall();

  // Initialize form data when hall prop changes
  useEffect(() => {
    if (hall) {
      setFormData({
        theatreId: hall.theatreId,
        location: hall.location,
        name: hall.name,
      });

      // Convert hall layout sections to SectionState format
      setSections(
        hall.layout.sections.map((section, index) => ({
          id: index + 1,
          rows: section.rows,
          columns: section.columns,
          startRow: section.startRow,
          startNumber: section.startNumber,
          selectedSeats: new Set(),
        }))
      );
    }
  }, [hall]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalSeats = sections.reduce(
      (total, section) => total + section.rows * section.columns,
      0
    );

    const updatedHall: Hall = {
      ...hall,
      ...formData,
      layout: {
    sections: sections.map(({ ...section }) => section),
      },
      totalSeats,
    };

    await updateHallMutation.mutateAsync(updatedHall);
    onOpenChange(false);
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectedTheatre = theatres?.find((t) => t._id === formData.theatreId);
  const locationOptions = selectedTheatre?.locations || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Hall</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Theatre</Label>
              <Select
                value={formData.theatreId}
                onValueChange={(value) => updateFormData("theatreId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a theatre" />
                </SelectTrigger>
                <SelectContent>
                  {theatres?.map((theatre) => (
                    <SelectItem key={theatre._id} value={theatre._id}>
                      {theatre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Location</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => updateFormData("location", value)}
                disabled={!formData.theatreId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((location) => (
                    <SelectItem key={location.address} value={location.address}>
                      {location.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Hall Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="Enter hall name"
                required
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setLayoutDesignerOpen(true)}
              className="w-full"
            >
              Configure Layout
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={updateHallMutation.isPending}
          >
            {updateHallMutation.isPending ? "Updating..." : "Update Hall"}
          </Button>
        </form>

        <HallLayoutDesignerDialog
          open={layoutDesignerOpen}
          onOpenChange={setLayoutDesignerOpen}
          sections={sections}
          setSections={setSections}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditHallDialog;
