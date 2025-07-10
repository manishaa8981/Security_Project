import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
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
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Plus, X } from "lucide-react";
import {
  LocationFormData,
  LocationFormSchema,
} from "@/lib/formSchemas/distributorFormSchema/locationSchemas";

interface LocationDialogProps {
  onSave: (data: LocationFormData) => void;
  initialData?: LocationFormData;
  triggerText?: string;
  dialogTitle?: string;
  children?: React.ReactNode;
}

const LocationDialog = ({
  onSave,
  initialData,
  triggerText = initialData ? "Edit Locations" : "Add Locations",
  dialogTitle = initialData ? "Edit Locations" : "Add Locations",
  children,
}: LocationDialogProps) => {
  const idCounter = useRef(0);
  const [isOpen, setIsOpen] = useState(false);

  const generateLocationId = useCallback(() => {
    return `loc-${Date.now()}-${idCounter.current++}`;
  }, []);

  const defaultValues = useMemo((): LocationFormData => {
    if (initialData) {
      return {
        ...initialData,
        locations: initialData.locations.map((loc) => ({
          ...loc,
          type: loc.type === "HQ" ? "HQ" : "Branch",
        })),
      };
    }
    return {
      locations: [],
      contacts: { phoneNumbers: [], emails: [] },
    };
  }, [initialData]);

  const form = useForm<LocationFormData>({
    resolver: zodResolver(LocationFormSchema),
    defaultValues,
    mode: "onChange", // validate as the user types/changes fields
  });

  const { handleSubmit, reset, setValue, watch } = form;
  const locations = watch("locations") as LocationFormData["locations"];
  const phoneNumbers = watch("contacts.phoneNumbers");
  const emails = watch("contacts.emails");

  // Initialize form with one location and its contacts for new entries.
  useEffect(() => {
    if (isOpen && !initialData) {
      const newLocationId = generateLocationId();
      reset({
        locations: [
          {
            id: newLocationId,
            type: "Branch",
            location: "",
            coordinates: { latitude: "", longitude: "" },
          },
        ],
        contacts: {
          phoneNumbers: [
            {
              type: "INQUIRY",
              locationId: newLocationId,
              number: "",
            },
          ],
          emails: [
            {
              type: "INQUIRY",
              locationId: newLocationId,
              email: "",
            },
          ],
        },
      });
    }
  }, [isOpen, initialData, reset, generateLocationId]);

  const handleTypeChange = (index: number, newType: "HQ" | "Branch") => {
    const updatedLocations = locations.map((loc, i) => {
      if (i === index) {
        return {
          ...loc,
          type: newType,
        };
      }
      if (newType === "HQ" && loc.type === "HQ") {
        return {
          ...loc,
          type: "Branch" as "Branch" | "HQ",
        };
      }
      return loc;
    });
    setValue("locations", updatedLocations);
  };

  const hasHQ = locations.some((loc) => loc.type === "HQ");
  const onSubmit = (data: LocationFormData) => {
    onSave(data);
    setIsOpen(false);
    reset();
  };

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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Please fill out the details for the location.
        </DialogDescription>
        <Form {...form}>
          <form className="space-y-4">
            {/* Addresses Section */}
            <div className="space-y-4">
              <h4 className="font-medium">Addresses</h4>
              {locations.map((loc, index) => (
                <div
                  key={loc.id}
                  className="border p-4 rounded-md space-y-4 relative pt-12"
                >
                  <Button
                    variant="destructive"
                    className="absolute top-3 right-3"
                    onClick={() => {
                      const updatedLocations = locations.filter(
                        (_, i) => i !== index
                      );
                      setValue("locations", updatedLocations);
                      // Update contacts when location is removed
                      setValue(
                        "contacts.phoneNumbers",
                        phoneNumbers.filter((p) => p.locationId !== loc.id)
                      );
                      setValue(
                        "contacts.emails",
                        emails.filter((e) => e.locationId !== loc.id)
                      );
                    }}
                  >
                    <X />
                  </Button>
                  <div className="space-y-4">
                    <div className="flex justify-between gap-3">
                      <FormField
                        control={form.control}
                        name={`locations.${index}.type`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                handleTypeChange(
                                  index,
                                  value as "HQ" | "Branch"
                                );
                                field.onChange(value);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  value="HQ"
                                  disabled={hasHQ && loc.type !== "HQ"}
                                >
                                  HQ
                                </SelectItem>
                                <SelectItem value="Branch">Branch</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage>
                              {fieldState.error?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`locations.${index}.location`}
                        render={({ field, fieldState }) => (
                          <FormItem className="w-full">
                            <Input {...field} placeholder="Address" />
                            <FormMessage>
                              {fieldState.error?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                    <h5 className="font-medium">Co-ordinates:</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`locations.${index}.coordinates.latitude`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <Input {...field} placeholder="Latitude" />
                            <FormMessage>
                              {fieldState.error?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`locations.${index}.coordinates.longitude`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <Input {...field} placeholder="Longitude" />
                            <FormMessage>
                              {fieldState.error?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newLocation = {
                    id: generateLocationId(),
                    type: "Branch" as "Branch" | "HQ",
                    location: "",
                    coordinates: { latitude: "", longitude: "" },
                  };
                  setValue("locations", [...locations, newLocation]);
                }}
              >
                <Plus /> Add Address
              </Button>
            </div>

            {/* Contacts Section */}
            <div className="space-y-4 border p-4 rounded-md">
              <h4 className="font-medium">Contacts</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h5 className="font-medium">Phone Numbers</h5>
                  <button
                    type="button"
                    onClick={() => {
                      const defaultLocationId = locations[0]?.id || "";
                      setValue("contacts.phoneNumbers", [
                        ...phoneNumbers,
                        {
                          type: "INQUIRY",
                          locationId: defaultLocationId,
                          number: "",
                        },
                      ]);
                    }}
                  >
                    <Plus size={15} />
                  </button>
                </div>
                {phoneNumbers.map((phone, index) => (
                  <div key={index} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`contacts.phoneNumbers.${index}.type`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              const updated = [...phoneNumbers];
                              updated[index].type = value as
                                | "INQUIRY"
                                | "SUPPORT";
                              field.onChange(value);
                              setValue("contacts.phoneNumbers", updated);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="INQUIRY">Inquiry</SelectItem>
                              <SelectItem value="SUPPORT">Support</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`contacts.phoneNumbers.${index}.locationId`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              const updated = [...phoneNumbers];
                              updated[index].locationId = value;
                              field.onChange(value);
                              setValue("contacts.phoneNumbers", updated);
                            }}
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Address" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((loc) => (
                                <SelectItem key={loc.id} value={loc.id}>
                                  {loc.location || "Add a location above"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`contacts.phoneNumbers.${index}.number`}
                      render={({ field, fieldState }) => (
                        <FormItem className="flex-1">
                          <Input {...field} placeholder="Phone Number" />
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setValue(
                          "contacts.phoneNumbers",
                          phoneNumbers.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <X size={15} />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <h5 className="font-medium">Emails</h5>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const defaultLocationId = locations[0]?.id || "";
                      setValue("contacts.emails", [
                        ...emails,
                        {
                          type: "INQUIRY",
                          locationId: defaultLocationId,
                          email: "",
                        },
                      ]);
                    }}
                  >
                    <Plus size={15} />
                  </Button>
                </div>
                {emails.map((email, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <FormField
                      control={form.control}
                      name={`contacts.emails.${index}.type`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              const updated = [...emails];
                              updated[index].type = value as
                                | "INQUIRY"
                                | "SUPPORT";
                              field.onChange(value);
                              setValue("contacts.emails", updated);
                            }}
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="INQUIRY">Inquiry</SelectItem>
                              <SelectItem value="SUPPORT">Support</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`contacts.emails.${index}.locationId`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              const updated = [...emails];
                              updated[index].locationId = value;
                              field.onChange(value);
                              setValue("contacts.emails", updated);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Address" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((loc) => (
                                <SelectItem key={loc.id} value={loc.id}>
                                  {loc.location || "Add a location above"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`contacts.emails.${index}.email`}
                      render={({ field, fieldState }) => (
                        <FormItem className="flex-1">
                          <Input {...field} placeholder="Email Address" />
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setValue(
                          "contacts.emails",
                          emails.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <X size={15} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" onClick={handleSubmit(onSubmit)} className="w-full">
                Save Location
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
