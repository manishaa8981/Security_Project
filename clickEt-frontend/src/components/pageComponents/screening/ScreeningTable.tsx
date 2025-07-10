import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import { Button } from "@/components/shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { X, Loader2, Plus } from "lucide-react";
import { Card } from "@/components/shadcn/card";
import { useFetchAllScreenings, useDeleteScreening } from "@/api/screeningApi";
import AlertDialog from "@/components/common/AlertDialog";

interface ScreeningsTableProps {
  formState: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScreeningsTable: React.FC<ScreeningsTableProps> = ({
  formState,
  setShowForm,
}) => {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedScreeningId, setSelectedScreeningId] = useState<string | null>(
    null
  );
  const { data: screenings, isLoading } = useFetchAllScreenings();
  const deleteScreeningMutation = useDeleteScreening();

  const handleDeleteClick = (screeningId: string) => {
    setSelectedScreeningId(screeningId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedScreeningId) {
      await deleteScreeningMutation.mutateAsync(selectedScreeningId);
      setDeleteDialogOpen(false);
      setSelectedScreeningId(null);
    }
  };
  const filteredData =
    filterStatus && screenings
      ? screenings.filter((screening) => screening.status === filterStatus)
      : screenings || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Card className="max-w-[90vw] p-1">
        <div className="flex justify-between items-center p-4">
        <div className="flex gap-3">
          <h2 className="text-2xl font-bold">Screenings</h2>
          <Button
            onClick={() => {
              setShowForm(!formState);
            }}
          >
            <Plus />
            <span>Add Screenings</span>
          </Button>
        </div>
          <Select onValueChange={(value) => setFilterStatus(value as string)}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.N</TableHead>
              <TableHead>Movie</TableHead>
              <TableHead>Distributor</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>View Seats Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((screening, index) => (
              <TableRow key={screening._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <img
                      src={screening.movieId.posterURL.sm}
                      alt={screening.movieId.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="ml-2">{screening.movieId.name}</span>
                  </div>
                </TableCell>
                <TableCell>{screening.distributorId.name}</TableCell>
                <TableCell>
                  {screening.theatreId.name} - {screening.hallId.name}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>Base Price: Rs. {screening.basePrice}</div>
                    <div>Final Price: Rs. {screening.finalPrice}</div>
                  </div>
                </TableCell>
                <TableCell>{/* Placeholder for view seats status */}</TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Select
                      value={screening.status}
                      onValueChange={() => console.log("Status changed")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>{screening.status}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDeleteClick(screening._id)}
                      disabled={deleteScreeningMutation.isPending}
                    >
                      {deleteScreeningMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        description="This action cannot be undone. This will permanently remove this screening and their data from our servers."
        isProcessing={deleteScreeningMutation.isPending}
        actionText="Delete Screening"
        processingText="Deleting"
      />
    </div>
  );
};

export default ScreeningsTable;
