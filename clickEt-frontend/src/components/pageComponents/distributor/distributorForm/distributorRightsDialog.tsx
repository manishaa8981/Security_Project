import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Plus } from "lucide-react";
import { LocationItem } from "@/lib/formSchemas/distributorFormSchema/locationSchemas";
import {
  DistributionRightFormData,
  DistributionRightFormSchema,
} from "@/lib/formSchemas/distributorFormSchema/rightsSchema";
import { useFetchAllMovies } from "@/api/movieApi";

interface DistributionRightsDialogProps {
  onSave: (data: DistributionRightFormData) => void;
  addresses: LocationItem[];
  initialData?: DistributionRightFormData;
  triggerText?: string;
  dialogTitle?: string;
  children?: React.ReactNode;
}

const DistributionRightsDialog = ({
  onSave,
  addresses,
  initialData,
  triggerText = initialData
    ? "Edit Distribution Right"
    : "Add Distribution Rights",
  dialogTitle = initialData
    ? "Edit Distribution Right"
    : "Add Distribution Rights",
  children,
}: DistributionRightsDialogProps) => {
  const { data: movies = [] } = useFetchAllMovies();
  const defaultValues: DistributionRightFormData = initialData || {
    movieId: "",
    commissionRate: 0,
    territories: [],
    validFrom: "",
    validUntil: "",
  };

  const form = useForm<DistributionRightFormData>({
    resolver: zodResolver(DistributionRightFormSchema),
    defaultValues,
  });
  const { reset } = form;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>(
    defaultValues.territories
  );

  useEffect(() => {
    if (initialData) {
      setSelectedTerritories(initialData.territories);
    }
  }, [initialData]);

  const onDistributorSubmit = (data: DistributionRightFormData) => {
    onSave({ ...data, territories: selectedTerritories });
    setIsOpen(false);
    reset(defaultValues);
    setSelectedTerritories(defaultValues.territories);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const data = form.getValues();
    onDistributorSubmit(data);
  };

  const availableLocations = addresses.filter(
    (loc) => loc.location.trim() !== ""
  );

  const today = new Date().toISOString().split("T")[0];
  const maxValidUntilDate = new Date();
  maxValidUntilDate.setDate(new Date().getDate() + 183);
  const maxDate = maxValidUntilDate.toISOString().split("T")[0];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {triggerText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Please fill out the details for the distribution rights.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="movieId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movie</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select movie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {movies.map((movie) => (
                          <SelectItem key={movie._id} value={movie._id}>
                            {movie.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commissionRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          let value = Number(e.target.value);
                          if (value < 0) value = 0;
                          if (value > 100) value = 100;
                          field.onChange(value);
                        }}
                        min="0"
                        max="100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel className="mb-2">Territories</FormLabel>
              <div className="flex flex-wrap gap-2 my-4">
                {availableLocations.length > 0 ? (
                  availableLocations.map((loc) => (
                    <div
                      key={loc.id}
                      className={`text-sm cursor-pointer rounded-full px-3 pt-1.5 pb-2 ${
                        selectedTerritories.includes(loc.location)
                          ? "bg-primary/40"
                          : "bg-secondary"
                      }`}
                      onClick={() =>
                        setSelectedTerritories((prev) =>
                          prev.includes(loc.location)
                            ? prev.filter((t) => t !== loc.location)
                            : [...prev, loc.location]
                        )
                      }
                    >
                      {loc.location}
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-muted">
                    No locations available. Please add locations first.
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="validFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid From</FormLabel>
                    <FormControl>
                      <Input type="date" min={today} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="validUntil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid Until</FormLabel>
                    <FormControl>
                      <Input type="date" min={today} max={maxDate} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={availableLocations.length === 0}
              >
                Save Distribution Rights
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DistributionRightsDialog;
