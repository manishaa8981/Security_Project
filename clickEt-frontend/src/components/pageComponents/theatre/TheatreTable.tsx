import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";

import { Card, CardContent } from "@/components/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Button } from "@/components/shadcn/button";
import { Edit, Trash2, Phone, Mail, MapPin, Plus } from "lucide-react";

import AlertDialog from "../../common/AlertDialog";

import { useDeleteTheatre, useFetchAllTheatres } from "@/api/theatreApi";

type FilterStatus = "all" | "active" | "inactive";

interface TheatreTableProps {
  formState: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const TheatresTable: React.FC<TheatreTableProps> = ({
  formState,
  setShowForm,
}) => {
  const [filter, setFilter] = useState<FilterStatus>("active");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTheatreId, setSelectedTheatreId] = useState<string | null>(
    null
  );

  // API hooks
  const { data, isLoading, error } = useFetchAllTheatres();
  const deleteTheatreMutation = useDeleteTheatre();

  // Get theatres array from the response
  const theatres = data || [];

  const filteredDistributors = theatres.filter((theatre) => {
    if (filter === "all") return true;
    if (filter === "active") return theatre.isActive;
    if (filter === "inactive") return !theatre.isActive;
    return false;
  });

  const handleDeleteClick = (theatreId: string) => {
    setSelectedTheatreId(theatreId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTheatreId) {
      await deleteTheatreMutation.mutateAsync(selectedTheatreId);
      setDeleteDialogOpen(false);
      setSelectedTheatreId(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading theatres...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Error loading theatres: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full mx-auto p-4">
      {/* Header with Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-3">
          <h2 className="text-2xl font-bold">Theatres</h2>
          <Button
            onClick={() => {
              setShowForm(!formState);
            }}
          >
            <Plus />
            <span>Add Theatre</span>
          </Button>
        </div>
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as FilterStatus)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Card Container */}
      <Card className="shadow-lg">
        <CardContent className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">S.N.</TableHead>
                <TableHead>Theatre</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredDistributors.length > 0 ? (
                filteredDistributors.map((theatre, index) => (
                  <TableRow key={theatre._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{theatre.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {theatre.locations.map((loc, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            <MapPin />
                            <span>{loc.address}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-5">
                        {theatre.contacts.map((contact, i) => (
                          <div key={i} className="text-sm">
                            <div className="font-medium text-primary/80">
                              {contact.location}
                            </div>
                            {contact.phoneNumbers.length > 0 && (
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-1 text-gray-600" />
                                <span>{contact.phoneNumbers[0].number}</span>
                              </div>
                            )}
                            {contact.emails.length > 0 && (
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-1 text-gray-600" />
                                <span>{contact.emails[0].email}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{/* {theatre.commissionRate}% */}5 %</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: implement edit functionality
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(theatre._id)}
                        disabled={deleteTheatreMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No theatres found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        description="This action cannot be undone. This will permanently remove this distributor and their data from our servers."
        isProcessing={deleteTheatreMutation.isPending}
        actionText="Delete Distributor"
        processingText="Deleting"
      />
    </div>
  );
};

export default TheatresTable;
