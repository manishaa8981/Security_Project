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
import { Card } from "@/components/shadcn/card";
import { Loader, Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Movie } from "@/interfaces/IMovie";
import AlertDialog from "@/components/common/AlertDialog";
import {
  useDeleteMovie,
  useFetchAllMovies,
  useToggleMovieStatus,
} from "@/api/movieApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";

interface MoviesTableProps {
  formState: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MoviesTable({
  formState,
  setShowForm,
}: MoviesTableProps) {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const toggleMutation = useToggleMovieStatus();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string>("");
  const deleteMovieMutation = useDeleteMovie();

  const handleDeleteClick = (movieId: string) => {
    setSelectedMovieId(movieId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedMovieId) {
      await deleteMovieMutation.mutateAsync(selectedMovieId);
      setDeleteDialogOpen(false);
      setSelectedMovieId("");
    }
  };

  const {
    data: movies = [] as Movie[],
    isLoading,
    error,
  } = useFetchAllMovies();

  // Filter movies based on selected status
  const filteredMovies = statusFilter
    ? movies.filter((movie: Movie) => movie.status === statusFilter)
    : movies;

  const handleToggleStatus = (id: string) => {
    toggleMutation.mutateAsync(id);
  };

  const handleEditClick = (id: string) => {
    navigate(`/movie/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading movies. Please try again.</p>
      </div>
    );
  }

  return (
    <Card className="w-[90%] mx-auto space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Movies</h1>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-40 justify-between">
                {statusFilter || "showing/upcoming"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("showing")}>
                Showing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("upcoming")}>
                Upcoming
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <Button
            onClick={() => {
              setShowForm(!formState);
            }}
          >
            <Plus />
            <span>Add Movie</span>
          </Button>
        </div>
        <Select
          value={statusFilter || "all"}
          onValueChange={(value) =>
            setStatusFilter(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="showing">Showing</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Movies Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center font-bold">SN</TableHead>
            <TableHead className="font-bold">Movie</TableHead>
            <TableHead className="font-bold">Category</TableHead>
            <TableHead className="font-bold">Duration</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="font-bold text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMovies.map((movie: Movie, index: number) => (
            <TableRow key={movie._id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{movie.name}</TableCell>
              <TableCell>{movie.category}</TableCell>
              <TableCell>{movie.duration_min} min</TableCell>
              <TableCell>
                <Button
                  variant={movie.status === "showing" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleStatus(movie._id)}
                  className={`${
                    movie.status === "showing"
                      ? "bg-green-600 hover:bg-green-700"
                      : "text-amber-600 border-amber-600 hover:bg-amber-50"
                  }`}
                >
                  {movie.status}
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex justify-center tems-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      handleEditClick(movie._id);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteClick(movie._id)}
                    disabled={deleteMovieMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        description="This action cannot be undone. This will permanently remove this movie and its data from our servers."
        isProcessing={deleteMovieMutation.isPending}
        actionText="Delete Movie"
        processingText="Deleting"
      />
    </Card>
  );
}
