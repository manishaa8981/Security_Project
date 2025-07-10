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
import { Edit, Trash2, MapPin, Phone, Mail, Plus } from "lucide-react";

import AlertDialog from "@/components/common/AlertDialog";

import {
  useDeleteDistributor,
  useFetchAllDistributors,
} from "@/api/distributorApi";

type FilterStatus = "all" | "active" | "inactive";

interface DistributorsTableProps {
  formState: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  onEdit: (distributorData: any) => void; // Add onEdit callback
  onAdd: () => void;
}

const DistributorsTable: React.FC<DistributorsTableProps> = ({
  formState,
  setShowForm,
  onEdit,
  onAdd,
}) => {
  const [filter, setFilter] = useState<FilterStatus>("active");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDistributorId, setSelectedDistributorId] = useState<
    string | null
  >(null);

  // API hooks
  const { data, isLoading, error } = useFetchAllDistributors();
  const deleteDistributorMutation = useDeleteDistributor();

  // Get distributors array from the response
  const distributors = data || [];

  const filteredDistributors = distributors.filter((dist) => {
    if (filter === "all") return true;
    if (filter === "active") return dist.isActive;
    if (filter === "inactive") return !dist.isActive;
    return false;
  });

  const handleEditClick = (distributorData: any) => {
    onEdit(distributorData); // Call the onEdit callback
    setShowForm(true); // Show the form
  };

  const handleDeleteClick = (distributorId: string) => {
    setSelectedDistributorId(distributorId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedDistributorId) {
      await deleteDistributorMutation.mutateAsync(selectedDistributorId);
      setDeleteDialogOpen(false);
      setSelectedDistributorId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">Loading distributors...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Error loading distributors: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4 min-w-[70vw]">
      {/* Header with Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex justify-center items-center gap-6">
          <h2 className="text-2xl font-bold">Distributors</h2>
          <Button
            onClick={() => {
              onAdd();
              setShowForm(!formState);
            }}
          >
            <Plus />
            <span>Add Distributor</span>
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
                <TableHead>Distributor</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredDistributors.length > 0 ? (
                filteredDistributors.map((dist, index) => (
                  <TableRow key={dist._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {dist.logo_URL && (
                          <img
                            src={dist.logo_URL}
                            alt={`${dist.name} logo`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <span className="font-medium">{dist.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {dist.locations.map((loc, i) => (
                          <div key={i} className="flex items-center text-sm">
                            <MapPin
                              className={`h-4 w-4 mr-1 ${
                                loc.type === "HQ"
                                  ? "text-primary"
                                  : "text-gray-600"
                              }`}
                            />
                            <span>
                              {loc.type}: {loc.location}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-5">
                        {dist.contacts.map((contact, i) => (
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
                    <TableCell>{dist.commissionRate}%</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(dist)}
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(dist._id)}
                        disabled={deleteDistributorMutation.isPending}
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
                    No distributors found.
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
        isProcessing={deleteDistributorMutation.isPending}
        actionText="Delete Distributor"
        processingText="Deleting"
      />
    </div>
  );
};

export default DistributorsTable;
