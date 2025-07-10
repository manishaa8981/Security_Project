import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Button } from "@/components/shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { CreateHallRequest, SectionState } from "@/interfaces/IHalls";
import { useCreateHall } from "@/api/hallApi";
import { useFetchAllTheatres } from "@/api/theatreApi";

// Import the dialog-based Layout Designer
import HallLayoutDesignerDialog from "@/components/pageComponents/halls/LayoutDesigner";

const CreateHallForm = () => {
  const [formData, setFormData] = useState({
    theatreId: "",
    location: "",
    name: "",
  });
  const [sections, setSections] = useState<SectionState[]>([
    {
      id: 1,
      rows: 6,
      columns: 6,
      startRow: "A",
      startNumber: 1,
      selectedSeats: new Set(),
    },
  ]);

  // State to control the layout designer dialog
  const [openDesignerDialog, setOpenDesignerDialog] = useState(false);

  const { data: theatres } = useFetchAllTheatres();
  const createHallMutation = useCreateHall();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalSeats = sections.reduce(
      (total, section) => total + section.rows * section.columns,
      0
    );

    const payload: CreateHallRequest = {
      ...formData,
      layout: {
        sections: sections.map(({ ...section }) => section),
      },
      totalSeats,
    };

    createHallMutation.mutate(payload);
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectedTheatre = theatres?.find((t) => t._id === formData.theatreId);
  const locationOptions = selectedTheatre?.locations || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="w-full min-w-[50vw] p-5">
        <CardHeader>
          <CardTitle>Create a Hall</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
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

          <div className="space-y-2">
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

          <div className="flex justify-between gap-32 items-end">
            <div className="w-full">
              <Label>Hall Name</Label>
              <Input
                className="min-"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="Enter hall name"
                required
              />
            </div>
            {/* Button to open the Layout Designer dialog */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenDesignerDialog(true)}
            >
              Configure Layout
            </Button>
          </div>
        </CardContent>

        <Button
          type="submit"
          className="w-full"
          disabled={createHallMutation.isPending}
        >
          {createHallMutation.isPending ? "Creating..." : "Create Hall"}
        </Button>
      </Card>

      {/* The Theater Layout Designer is in a dialog now */}
      <HallLayoutDesignerDialog
        open={openDesignerDialog}
        onOpenChange={setOpenDesignerDialog}
        sections={sections}
        setSections={setSections}
      />
    </form>
  );
};

export default CreateHallForm;
