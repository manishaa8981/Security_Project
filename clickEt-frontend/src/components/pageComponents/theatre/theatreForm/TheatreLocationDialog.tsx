import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Label } from "@/components/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { X, Plus } from "lucide-react";

const locationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  coordinates: z.object({
    latitude: z.string().min(1, "Latitude is required"),
    longitude: z.string().min(1, "Longitude is required"),
  }),
  commissionRate: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Commission rate must be at least 0").max(100, "Commission rate must be at most 100")
  ),
  phones: z.array(
    z.object({
      type: z.enum(["INQUIRY", "SUPPORT"]),
      number: z.string().min(1, "Phone number is required"),
    })
  ).min(1, "At least one phone number is required"),
  emails: z.array(
    z.object({
      type: z.enum(["INQUIRY", "SUPPORT"]),
      email: z.string().email("Invalid email address"),
    })
  ).min(1, "At least one email address is required"),
});

type Location = z.infer<typeof locationSchema>;

interface TheatreLocationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (location: Location) => void;
  initialData?: Location;
}

const TheatreLocationDialog: React.FC<TheatreLocationDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Location>({
    resolver: zodResolver(locationSchema),
    defaultValues: initialData || {
      address: "",
      coordinates: { latitude: "", longitude: "" },
      commissionRate: 0,
      phones: [{ type: "INQUIRY", number: "" }],
      emails: [{ type: "INQUIRY", email: "" }],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        address: "",
        coordinates: { latitude: "", longitude: "" },
        commissionRate: 0,
        phones: [{ type: "INQUIRY", number: "" }],
        emails: [{ type: "INQUIRY", email: "" }],
      });
    }
  }, [initialData, open, reset]);

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    name: "phones",
  });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    control,
    name: "emails",
  });

  const onSubmit = (data: Location) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Location" : "Add Location"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Addresses Section */}
          <div className="border px-4 pb-6 rounded-lg">
            <h3 className="text-2xl mt-2 mb-4 text-primary font-semibold">
              Addresses
            </h3>

            <div className="space-y-4">
              <div>
                <Label>Address</Label>
                <Input {...register("address")} />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Latitude</Label>
                  <Input {...register("coordinates.latitude")} />
                  {errors.coordinates?.latitude && (
                    <p className="text-red-500 text-sm">
                      {errors.coordinates.latitude.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input {...register("coordinates.longitude")} />
                  {errors.coordinates?.longitude && (
                    <p className="text-red-500 text-sm">
                      {errors.coordinates.longitude.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Commission Rate (%)</Label>
                  <Input
                    type="number"
                    {...register("commissionRate", { valueAsNumber: true })}
                  />
                  {errors.commissionRate && (
                    <p className="text-red-500 text-sm">
                      {errors.commissionRate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="border px-4 pb-6 rounded-lg">
            <h3 className="text-2xl mt-2 mb-4 text-primary font-semibold">
              Contacts
            </h3>
            <div className="space-y-3">
              <div className="flex gap-2 items-center">
                <Label>Phone Numbers:</Label>
                <button
                  type="button"
                  onClick={() => appendPhone({ type: "INQUIRY", number: "" })}
                  className="flex items-center gap-2 bg-primary p-1 rounded-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {phoneFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <Controller
                    control={control}
                    name={`phones.${index}.type`}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INQUIRY">Inquiry</SelectItem>
                          <SelectItem value="SUPPORT">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input
                    {...register(`phones.${index}.number` as const)}
                    placeholder="Phone number"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePhone(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  {errors.phones?.[index]?.number && (
                    <p className="text-red-500 text-sm">
                      {errors.phones[index]?.number?.message}
                    </p>
                  )}
                </div>
              ))}
              {errors.phones && typeof errors.phones.message === "string" && (
                <p className="text-red-500 text-sm">{errors.phones.message}</p>
              )}
            </div>

            <div className="space-y-4 mt-8">
              <div className="flex gap-3 items-center">
                <Label>Emails:</Label>
                <button
                  type="button"
                  onClick={() => appendEmail({ type: "INQUIRY", email: "" })}
                  className="flex items-center gap-2 bg-primary p-1 rounded-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {emailFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <Controller
                    control={control}
                    name={`emails.${index}.type`}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INQUIRY">Inquiry</SelectItem>
                          <SelectItem value="SUPPORT">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input
                    {...register(`emails.${index}.email` as const)}
                    placeholder="Email address"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEmail(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  {errors.emails?.[index]?.email && (
                    <p className="text-red-500 text-sm">
                      {errors.emails[index]?.email?.message}
                    </p>
                  )}
                </div>
              ))}
              {errors.emails && typeof errors.emails.message === "string" && (
                <p className="text-red-500 text-sm">{errors.emails.message}</p>
              )}
            </div>
          </div>

          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            type="submit"
          >
            {initialData ? "Update Location" : "Save Location"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TheatreLocationDialog;
