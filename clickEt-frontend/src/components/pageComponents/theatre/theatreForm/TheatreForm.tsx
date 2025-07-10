import { useState } from "react";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Label } from "@/components/shadcn/label";
import { X, Plus, Edit } from "lucide-react";
import TheatreLocationDialog from "./TheatreLocationDialog";
import { useAddTheatre } from "@/api/theatreApi";
import { useNavigate } from "react-router-dom";

const locationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  coordinates: z.object({
    latitude: z.string().min(1, "Latitude is required"),
    longitude: z.string().min(1, "Longitude is required"),
  }),
  commissionRate: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .min(0, "Commission rate must be at least 0")
      .max(100, "Commission rate must be at most 100")
  ),
  phones: z.array(
    z.object({
      type: z.enum(["INQUIRY", "SUPPORT"]),
      number: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^(?:\+977[- ]?)?\d{10}$/, "Invalid Nepali phone number format"),
    })
  ),
  emails: z.array(
    z.object({
      type: z.enum(["INQUIRY", "SUPPORT"]),
      email: z.string().email("Invalid email address"),
    })
  ),
});

type Location = z.infer<typeof locationSchema>;

const theatreFormSchema = z.object({
  name: z.string().min(1, "Theater name is required"),
  locations: z
    .array(locationSchema)
    .min(1, "At least one location is required"),
  contacts: z.array(
    z.object({
      location: z.string(),
      phoneNumbers: z.array(
        z.object({
          type: z.string(),
          number: z.string(),
        })
      ),
      emails: z.array(
        z.object({
          type: z.string(),
          email: z.string(),
        })
      ),
    })
  ),
  hallIds: z.array(z.string()),
  commissionRate: z.array(
    z.object({
      address: z.string(),
      rate: z.number(),
    })
  ),
  isActive: z.boolean(),
});

type TheatreFormData = z.infer<typeof theatreFormSchema>;

export type FinalTheatreData = {
  name: string;
  locations: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }[];
  contacts: {
    location: string;
    phoneNumbers: {
      type: string;
      number: string;
    }[];
    emails: {
      type: string;
      email: string;
    }[];
  }[];
  commissionRate: {
    address: string;
    rate: number;
  }[];
  isActive: boolean;
};

const TheatreForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TheatreFormData>({
    resolver: zodResolver(theatreFormSchema),
    defaultValues: {
      name: "",
      locations: [],
      contacts: [],
      hallIds: [],
      commissionRate: [],
      isActive: true,
    },
  });

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "locations",
  });

  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<{
    index: number;
    location: Location;
  } | null>(null);
  const navigate = useNavigate();

  const handleOpenLocationDialog = (index?: number) => {
    if (index !== undefined) {
      setEditingLocation({ index, location: fields[index] });
    } else {
      setEditingLocation(null);
    }
    setIsLocationDialogOpen(true);
  };

  const handleCloseLocationDialog = () => {
    setIsLocationDialogOpen(false);
    setEditingLocation(null);
  };

  const onLocationSave = (location: Location) => {
    if (editingLocation !== null) {
      update(editingLocation.index, location);
    } else {
      append(location);
    }
    handleCloseLocationDialog();
  };

  // ----------------------------------------------------------------
  // 4. Error handling for invalid form
  // ----------------------------------------------------------------
  const onInvalid = (formErrors: FieldErrors<TheatreFormData>) => {
    if (formErrors.locations) {
      toast.error(
        formErrors.locations.message || "Please add at least one valid location"
      );
    } else {
      toast.error("Please check the form for errors.");
    }
  };

  const { mutate: addTheatre } = useAddTheatre();

  const handleFinalSubmit = (data: TheatreFormData) => {
    const finalData: FinalTheatreData = {
      name: data.name,
      locations: data.locations.map((loc) => ({
        address: loc.address,
        coordinates: {
          latitude: parseFloat(loc.coordinates.latitude),
          longitude: parseFloat(loc.coordinates.longitude),
        },
      })),
      contacts: data.locations.map((loc) => ({
        location: loc.address,
        phoneNumbers: loc.phones.map((phone) => ({
          type: phone.type, // replicate your example's spacing
          number: phone.number,
        })),
        emails: loc.emails.map((email) => ({
          type: email.type,
          email: email.email,
        })),
      })),
      commissionRate: data.locations.map((loc) => ({
        address: loc.address,
        rate: loc.commissionRate,
      })),
      isActive: data.isActive,
    };

    // Pass final structure to parent or API
    addTheatre(finalData);
  };

  return (
    <div className="w-full p-6 space-y-6  rounded-lg border">
      {/* Name Field */}
      <div className="space-y-4">
        <Label htmlFor="theatreName">Theater Name</Label>
        <Input id="theatreName" {...register("name")} className="w-full" />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Locations & Contacts */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Location and Contacts</h2>
          <Button
            variant="outline"
            onClick={() => handleOpenLocationDialog()}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Location
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {fields.map((location, index) => (
            <div
              key={location.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full group cursor-pointer"
            >
              <span
                onClick={() => handleOpenLocationDialog(index)}
                className="flex items-center gap-2"
              >
                {location.address}
                <Edit className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <button
                onClick={() => remove(index)}
                className="text-muted-foreground hover:text-foreground ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        {errors.locations && (
          <p className="text-red-500 text-sm">{errors.locations.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        className="w-full bg-primary hover:bg-primary/80 text-white"
        onClick={handleSubmit(handleFinalSubmit, onInvalid)}
      >
        Add Theater
      </Button>

      <p className="text-sm text-muted-foreground">
        NOTE: To associate halls with this theatre,{" "}
        <button
          onClick={() => {
            navigate("/admin/halls");
          }}
          className="text-red-500 hover:underline"
        >
          Click here
        </button>
      </p>

      {/* Location Dialog */}
      <TheatreLocationDialog
        open={isLocationDialogOpen}
        onClose={handleCloseLocationDialog}
        onSave={onLocationSave}
        initialData={editingLocation?.location}
      />
    </div>
  );
};

export default TheatreForm;
