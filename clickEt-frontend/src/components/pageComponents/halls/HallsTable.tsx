import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import { Dialog, DialogContent } from "@/components/shadcn/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Button } from "@/components/shadcn/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/shadcn/switch";

import AlertDialog from "@/components/common/AlertDialog";
import ViewHall from "./ViewHall";

import {
  useDeleteHall,
  useGetAllHalls,
  useGetHallLayout,
  useToggleHallStatus,
} from "@/api/hallApi";
import { useFetchAllTheatres } from "@/api/theatreApi";
import EditHallDialog from "./UpdateLayoutDialog";
import { Card } from "@/components/shadcn/card";

interface Hall {
  _id: string;
  name: string;
  theatreId: string;
  location: string;
  isActive: boolean;

  totalSeats: number;
  layout: {
    sections: {
      rows: number;
      columns: number;
      startRow: string;
      startNumber: number;
    }[];
  };
}

interface HallsTableProps {
  formState: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const HallsTable: React.FC<HallsTableProps> = ({ formState, setShowForm }) => {
  const [selectedTheatre, setSelectedTheatre] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedHallId, setSelectedHallId] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showLayoutDialog, setShowLayoutDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);

  const { data: theatres } = useFetchAllTheatres();
  const { data: halls, isLoading, isError } = useGetAllHalls();
  const { data: hallLayout } = useGetHallLayout(selectedHallId);

  const deleteHallMutation = useDeleteHall();

  const toggleStatusMutation = useToggleHallStatus();

  const handleToggleStatus = async (hallId: string) => {
    await toggleStatusMutation.mutateAsync(hallId);
  };

  const handleEditClick = (hall: Hall) => {
    setSelectedHall(hall);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (distributorId: string) => {
    setSelectedHallId(distributorId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedHallId) {
      await deleteHallMutation.mutateAsync(selectedHallId);
      setDeleteDialogOpen(false);
      setSelectedHallId("");
    }
  };

  const selectedTheatreData = theatres?.find((t) => t._id === selectedTheatre);
  const locationOptions = selectedTheatreData?.locations || [];

  const filteredHalls: Hall[] =
    halls?.filter((hall: Hall) => {
      if (selectedTheatre && hall.theatreId !== selectedTheatre) return false;
      if (selectedLocation && hall.location !== selectedLocation) return false;
      return true;
    }) || [];

  const handleViewHall = (hallId: string) => {
    setSelectedHallId(hallId);
    setShowLayoutDialog(true);
  };

  if (isLoading) {
    return <div>Loading Halls...</div>;
  }
  if (isError) {
    return <div>Failed to load halls. Please try again.</div>;
  }

  return (
    <Card className="space-y-4 p-4">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <h2 className="text-2xl font-bold">Halls</h2>
          <Button
            onClick={() => {
              setShowForm(!formState);
            }}
          >
            <Plus />
            <span>Add Hall</span>
          </Button>
        </div>
        <div className="flex items-center gap-4">
          {/* Theatre Filter */}
          <div className="w-[200px]">
            <Select value={selectedTheatre} onValueChange={setSelectedTheatre}>
              <SelectTrigger>
                <SelectValue placeholder="Select Theatre" />
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

          {/* Location Filter */}
          <div className="w-[200px]">
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
              disabled={!selectedTheatre}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Location" />
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
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Halls</TableHead>
            <TableHead>Theatre</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>IsActive</TableHead>
            <TableHead>Layout</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredHalls.map((hall, index) => {
            const theatre = theatres?.find((t) => t._id === hall.theatreId);

            return (
              <TableRow key={hall._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{hall.name}</TableCell>
                <TableCell>{theatre?.name}</TableCell>
                <TableCell>{hall.location}</TableCell>
                <TableCell>
                  <Switch
                    checked={hall.isActive}
                    onCheckedChange={() => handleToggleStatus(hall._id)}
                    disabled={toggleStatusMutation.isPending}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewHall(hall._id)}
                  >
                    View Layout
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(hall)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(hall._id)}
                      disabled={deleteHallMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Layout Dialog */}
      <Dialog open={showLayoutDialog} onOpenChange={setShowLayoutDialog}>
        <DialogContent className="max-w-[80vw]">
          {hallLayout && <ViewHall layout={hallLayout.layout} />}
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        description="This action cannot be undone. This will permanently remove this hall and their data from our servers."
        isProcessing={deleteHallMutation.isPending}
        actionText="Delete Hall"
        processingText="Deleting"
      />
      {selectedHall && (
        <EditHallDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          hall={selectedHall}
        />
      )}
    </Card>
  );
};

export default HallsTable;
