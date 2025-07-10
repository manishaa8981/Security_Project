// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/shadcn/form";
// import { Input } from "@/components/shadcn/input";
// import { Card, CardContent } from "@/components/shadcn/card";
// import { Button } from "@/components/shadcn/button";
// import { X } from "lucide-react";

// import LocationDialog from "@/components/pageComponents/distributor/distributorForm/LocationDialog";
// import DistributionRightsDialog from "./distributorRightsDialog";

// import { LocationFormData } from "@/lib/formSchemas/distributorFormSchema/locationSchemas";
// import {
//   DistributorFormData,
//   DistributorSchema,
// } from "@/lib/formSchemas/distributorFormSchema/basicDetailsSchema";
// import { DistributionRightFormData } from "@/lib/formSchemas/distributorFormSchema/rightsSchema";

// import {
//   useAddDistributor,
//   useDistributorLogoUpload,
// } from "@/api/distributorApi";
// import ImageUploader from "../../../common/ImageUploader";

// const DistributorForm = () => {
//   const [distributorData, setDistributorData] = useState<{
//     id: string | null;
//     distributorName: string | null;
//   }>({ id: null, distributorName: null });
//   const [locationData, setLocationData] = useState<LocationFormData>({
//     locations: [],
//     contacts: {
//       phoneNumbers: [],
//       emails: [],
//     },
//   });
//   const [distributionRights, setDistributionRights] = useState<
//     DistributionRightFormData[]
//   >([]);
//   const [showImageUpload, setShowImageUpload] = useState<boolean>(false);
//   const { mutate: uploadDistributorLogo, isPending } =
//     useDistributorLogoUpload();

//   const form = useForm<DistributorFormData>({
//     resolver: zodResolver(DistributorSchema),
//     defaultValues: {
//       name: "",
//       commissionRate: 0,
//       isActive: false,
//     },
//   });

//   const { mutate: addDistributorMutation } = useAddDistributor();

//   const onSubmit = (data: DistributorFormData) => {
//     const transformedContacts = locationData.locations.map((loc) => {
//       const phoneNumbersForLoc = locationData.contacts.phoneNumbers
//         .filter((phone) => phone.locationId === loc.id)
//         .map((phone) => ({
//           type: phone.type.charAt(0).toUpperCase() + phone.type.slice(1),
//           number: phone.number,
//         }));

//       const emailsForLoc = locationData.contacts.emails
//         .filter((email) => email.locationId === loc.id)
//         .map((email) => ({
//           type: email.type.charAt(0).toUpperCase() + email.type.slice(1),
//           email: email.email,
//         }));

//       return {
//         location: loc.location,
//         phoneNumbers: phoneNumbersForLoc,
//         emails: emailsForLoc,
//       };
//     });

//     // Prepare complete data for API
//     const completeData = {
//       name: data.name,
//       commissionRate: data.commissionRate,
//       isActive: data.isActive,
//       locations: locationData.locations.map((loc) => ({
//         type: loc.type,
//         location: loc.location,
//         coordinates: {
//           latitude: parseFloat(loc.coordinates.latitude),
//           longitude: parseFloat(loc.coordinates.longitude),
//         },
//       })),
//       contacts: transformedContacts,
//       distributionRights: distributionRights.map((right) => ({
//         movieId: right.movieId,
//         commissionRate: right.commissionRate,
//         territories: right.territories,
//         validFrom: right.validFrom,
//         validUntil: right.validUntil,
//       })),
//     };

//     // Submit to API
//     addDistributorMutation(completeData, {
//       onSuccess: (data) => {
//         setDistributorData({
//           id: data.distributor._id,
//           distributorName: data.distributor.name,
//         });
//         setShowImageUpload(true);
//       },
//     });
//   };

//   const handleAddLocation = (data: LocationFormData) => {
//     setLocationData({
//       locations: [...locationData.locations, ...data.locations],
//       contacts: {
//         phoneNumbers: [
//           ...locationData.contacts.phoneNumbers,
//           ...data.contacts.phoneNumbers,
//         ],
//         emails: [...locationData.contacts.emails, ...data.contacts.emails],
//       },
//     });
//   };

//   const handleAddDistributionRight = (rightData: DistributionRightFormData) => {
//     setDistributionRights([...distributionRights, rightData]);
//   };

//   const handleDeleteLocation = (locationId: string) => {
//     setLocationData((prev) => ({
//       locations: prev.locations.filter((loc) => loc.id !== locationId),
//       contacts: {
//         phoneNumbers: prev.contacts.phoneNumbers.filter(
//           (phone) => phone.locationId !== locationId
//         ),
//         emails: prev.contacts.emails.filter(
//           (email) => email.locationId !== locationId
//         ),
//       },
//     }));
//   };

//   const handleDeleteDistributionRights = (indexToDelete: number) => {
//     setDistributionRights((prev) =>
//       prev.filter((_, index) => index !== indexToDelete)
//     );
//   };

//   return (
//     <Card className="w-full mx-auto ">
//       {!showImageUpload && (
//         <CardContent className="p-8">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//               <div>
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Distributor Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div>
//                 <FormField
//                   control={form.control}
//                   name="commissionRate"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Commission Rate (%)</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           {...field}
//                           onChange={(e) => {
//                             let value = Number(e.target.value);
//                             if (value < 0) value = 0;
//                             if (value > 100) value = 100;
//                             field.onChange(value);
//                           }}
//                           min="0"
//                           max="100"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-xl font-semibold">
//                     Location and Contacts
//                   </h3>
//                   <LocationDialog onSave={handleAddLocation} />
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   <div className="flex flex-wrap gap-2">
//                     {locationData.locations.map((location) => (
//                       <div key={location.id} className="relative">
//                         <LocationDialog
//                           key={location.id}
//                           onSave={(data: LocationFormData) => {
//                             setLocationData((prev) => {
//                               // Filter out old location and its contacts
//                               const updatedLocations = prev.locations.map(
//                                 (loc) =>
//                                   loc.id === location.id
//                                     ? data.locations[0]
//                                     : loc
//                               );

//                               const updatedPhoneNumbers =
//                                 prev.contacts.phoneNumbers
//                                   .filter(
//                                     (phone) => phone.locationId !== location.id
//                                   )
//                                   .concat(data.contacts.phoneNumbers);

//                               const updatedEmails = prev.contacts.emails
//                                 .filter(
//                                   (email) => email.locationId !== location.id
//                                 )
//                                 .concat(data.contacts.emails);

//                               return {
//                                 locations: updatedLocations,
//                                 contacts: {
//                                   phoneNumbers: updatedPhoneNumbers,
//                                   emails: updatedEmails,
//                                 },
//                               };
//                             });
//                           }}
//                           initialData={{
//                             locations: [location],
//                             contacts: {
//                               phoneNumbers:
//                                 locationData.contacts.phoneNumbers.filter(
//                                   (phone) => phone.locationId === location.id
//                                 ),
//                               emails: locationData.contacts.emails.filter(
//                                 (email) => email.locationId === location.id
//                               ),
//                             },
//                           }}
//                           triggerText=""
//                           dialogTitle="Edit Location"
//                         >
//                           <div
//                             className={`px-3 py-1 text-sm cursor-pointer rounded-full pb-2 ${
//                               location.type === "HQ"
//                                 ? "bg-primary/40"
//                                 : "bg-secondary"
//                             }`}
//                           >
//                             {location.location}{" "}
//                             <span className="ml-2 text-xs">
//                               ({location.type})
//                             </span>
//                           </div>
//                         </LocationDialog>
//                         <button
//                           className="absolute -top-2.5 -right-0.5 bg-primary rounded-md"
//                           onClick={() => handleDeleteLocation(location.id)}
//                           title="Delete Location"
//                         >
//                           <X size={16} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-xl font-semibold">Distribution Rights</h3>
//                   <DistributionRightsDialog
//                     onSave={handleAddDistributionRight}
//                     addresses={locationData.locations}
//                   />
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {distributionRights.map((right, index) => (
//                     <div key={index} className=" relative">
//                       <DistributionRightsDialog
//                         key={index}
//                         onSave={(updatedRight: DistributionRightFormData) => {
//                           setDistributionRights((prev) =>
//                             prev.map((r, i) => (i === index ? updatedRight : r))
//                           );
//                         }}
//                         addresses={locationData.locations}
//                         initialData={right}
//                         triggerText=""
//                         dialogTitle="Edit Distribution Right"
//                       >
//                         <div className="text-sm cursor-pointer bg-secondary rounded-2xl p-2">
//                           <span className="ml-2 text-xs">
//                             ({right.territories.join(", ")})
//                           </span>
//                         </div>
//                       </DistributionRightsDialog>
//                       <button
//                         className="absolute -top-2.5 -right-0.5 bg-primary rounded-md"
//                         onClick={() => handleDeleteDistributionRights(index)}
//                         title="Delete Rights"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <Button type="submit" className="w-full">
//                 Add Distributor
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       )}
//       {showImageUpload && (
//         <CardContent className="flex justify-center p-5">
//           <ImageUploader
//             uploadFn={({ image }) =>
//               uploadDistributorLogo({
//                 distributorId: distributorData.id || "",
//                 image,
//               })
//             }
//             fallbackText={distributorData.distributorName || ""}
//             isUploading={isPending}
//             buttonText={"Distributor Logo"}
//           />
//         </CardContent>
//       )}
//     </Card>
//   );
// };

// export default DistributorForm;

































import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Card, CardContent } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { X } from "lucide-react";

import LocationDialog from "@/components/pageComponents/distributor/distributorForm/LocationDialog";
import DistributionRightsDialog from "./distributorRightsDialog";

import { LocationFormData } from "@/lib/formSchemas/distributorFormSchema/locationSchemas";
import {
  DistributorFormData,
  DistributorSchema,
} from "@/lib/formSchemas/distributorFormSchema/basicDetailsSchema";
import { DistributionRightFormData } from "@/lib/formSchemas/distributorFormSchema/rightsSchema";

import {
  useAddDistributor,
  // useUpdateDistributor,
  useDistributorLogoUpload,
} from "@/api/distributorApi";
import ImageUploader from "../../../common/ImageUploader";

interface DistributorFormProps {
  editData?: DistributorFormData & {
    locations: LocationFormData["locations"];
    contacts: LocationFormData["contacts"];
    distributionRights: DistributionRightFormData[];
    onSubmitSuccess: () => void;
  };
}

// const DistributorForm: React.FC<DistributorFormProps> = ({
//   editData,
//   onSubmitSuccess,
// }) => {
//   const [distributorData, setDistributorData] = useState<{
//     id: string | null;
//     distributorName: string | null;
//   }>({ id: null, distributorName: null });
//   const [locationData, setLocationData] = useState<LocationFormData>({
//     locations: editData?.locations || [],
//     contacts: {
//       phoneNumbers: editData?.contacts?.phoneNumbers || [],
//       emails: editData?.contacts?.emails || [],
//     },
//   });

//   const [distributionRights, setDistributionRights] = useState<
//     DistributionRightFormData[]
//   >(editData?.distributionRights || []);
//   const [showImageUpload, setShowImageUpload] = useState<boolean>(false);
//   const { mutate: uploadDistributorLogo, isPending } =
//     useDistributorLogoUpload();

//   const form = useForm<DistributorFormData>({
//     resolver: zodResolver(DistributorSchema),
//     defaultValues: {
//       name: editData?.name || "",
//       commissionRate: editData?.commissionRate || 0,
//       isActive: editData?.isActive || false,
//     },
//   });

//   const { mutate: addDistributorMutation } = useAddDistributor();
//   // const { mutate: updateDistributorMutation } = useUpdateDistributor();

//   const onSubmit = (data: DistributorFormData) => {
//     console.log(data);
//     const transformedContacts = locationData.locations.map((loc) => {
//       const phoneNumbersForLoc = locationData.contacts.phoneNumbers
//         .filter((phone) => phone.locationId === loc.id)
//         .map((phone) => ({
//           type: phone.type.charAt(0).toUpperCase() + phone.type.slice(1),
//           number: phone.number,
//         }));

//       const emailsForLoc = locationData.contacts.emails
//         .filter((email) => email.locationId === loc.id)
//         .map((email) => ({
//           type: email.type.charAt(0).toUpperCase() + email.type.slice(1),
//           email: email.email,
//         }));

//       return {
//         location: loc.location,
//         phoneNumbers: phoneNumbersForLoc,
//         emails: emailsForLoc,
//       };
//     });

//     // Prepare complete data for API
//     const completeData = {
//       id: editData?._id || "",
//       name: data.name,
//       commissionRate: data.commissionRate,
//       isActive: data.isActive,
//       locations: locationData.locations.map((loc) => ({
//         type: loc.type,
//         location: loc.location,
//         coordinates: {
//           latitude: parseFloat(loc.coordinates.latitude),
//           longitude: parseFloat(loc.coordinates.longitude),
//         },
//       })),
//       contacts: transformedContacts,
//       distributionRights: distributionRights.map((right) => ({
//         movieId: right.movieId,
//         commissionRate: right.commissionRate,
//         territories: right.territories,
//         validFrom: right.validFrom,
//         validUntil: right.validUntil,
//       })),
//     };

//     // Submit to API
//     if (editData) {
//       // console.log("submitted");
//       // updateDistributorMutation(completeData, {
//       //   onSuccess: (data) => {
//       //     setDistributorData({
//       //       id: data.distributor._id,
//       //       distributorName: data.distributor.name,
//       //     });
//       //     setShowImageUpload(true);
//       //   },
//       // });
//     } else {
//       console.log("here");
//       addDistributorMutation(completeData, {
//         onSuccess: (data) => {
//           setDistributorData({
//             id: data.distributor._id,
//             distributorName: data.distributor.name,
//           });
//           setShowImageUpload(true);
//         },
//       });
//     }
//   };

// useEffect(() => {
//   if (editData) {
//     setLocationData({
//       locations: editData.locations || [],
//       contacts: {
//         phoneNumbers: editData.contacts?.phoneNumbers || [],
//         emails: editData.contacts?.emails || [],
//       },
//     });
//     setDistributionRights(editData.distributionRights || []);
//   }
// }, [editData]);


//   const handleAddLocation = (data: LocationFormData) => {
//     setLocationData({
//       locations: [...locationData.locations, ...data.locations],
//       contacts: {
//         phoneNumbers: [
//           ...locationData.contacts.phoneNumbers,
//           ...data.contacts.phoneNumbers,
//         ],
//         emails: [...locationData.contacts.emails, ...data.contacts.emails],
//       },
//     });
//   };

//   const handleAddDistributionRight = (rightData: DistributionRightFormData) => {
//     setDistributionRights([...distributionRights, rightData]);
//   };

//   const handleDeleteLocation = (locationId: string) => {
//     setLocationData((prev) => ({
//       locations: prev.locations.filter((loc) => loc.id !== locationId),
//       contacts: {
//         phoneNumbers: prev.contacts.phoneNumbers.filter(
//           (phone) => phone.locationId !== locationId
//         ),
//         emails: prev.contacts.emails.filter(
//           (email) => email.locationId !== locationId
//         ),
//       },
//     }));
//   };

//   const handleDeleteDistributionRights = (indexToDelete: number) => {
//     setDistributionRights((prev) =>
//       prev.filter((_, index) => index !== indexToDelete)
//     );
//   };

//   return (
//     <Card className="w-full mx-auto ">
//       {!showImageUpload && (
//         <CardContent className="p-8">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//               <div>
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Distributor Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div>
//                 <FormField
//                   control={form.control}
//                   name="commissionRate"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Commission Rate (%)</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           {...field}
//                           onChange={(e) => {
//                             let value = Number(e.target.value);
//                             if (value < 0) value = 0;
//                             if (value > 100) value = 100;
//                             field.onChange(value);
//                           }}
//                           min="0"
//                           max="100"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-xl font-semibold">
//                     Location and Contacts
//                   </h3>
//                   <LocationDialog onSave={handleAddLocation} />
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   <div className="flex flex-wrap gap-2">
//                     {locationData.locations.map((location) => (
//                       <div key={location.id} className="relative">
//                         <LocationDialog
//                           key={location.id}
//                           onSave={(data: LocationFormData) => {
//                             setLocationData((prev) => {
//                               // Filter out old location and its contacts
//                               const updatedLocations = prev.locations.map(
//                                 (loc) =>
//                                   loc.id === location.id
//                                     ? data.locations[0]
//                                     : loc
//                               );

//                               const updatedPhoneNumbers =
//                                 prev.contacts.phoneNumbers
//                                   .filter(
//                                     (phone) => phone.locationId !== location.id
//                                   )
//                                   .concat(data.contacts.phoneNumbers);

//                               const updatedEmails = prev.contacts.emails
//                                 .filter(
//                                   (email) => email.locationId !== location.id
//                                 )
//                                 .concat(data.contacts.emails);

//                               return {
//                                 locations: updatedLocations,
//                                 contacts: {
//                                   phoneNumbers: updatedPhoneNumbers,
//                                   emails: updatedEmails,
//                                 },
//                               };
//                             });
//                           }}
//                           initialData={{
//                             locations: [location],
//                             contacts: {
//                               phoneNumbers:
//                                 locationData.contacts.phoneNumbers.filter(
//                                   (phone) => phone.locationId === location.id
//                                 ),
//                               emails: locationData.contacts.emails.filter(
//                                 (email) => email.locationId === location.id
//                               ),
//                             },
//                           }}
//                           triggerText=""
//                           dialogTitle="Edit Location"
//                         >
//                           <div
//                             className={`px-3 py-1 text-sm cursor-pointer rounded-full pb-2 ${
//                               location.type === "HQ"
//                                 ? "bg-primary/40"
//                                 : "bg-secondary"
//                             }`}
//                           >
//                             {location.location}{" "}
//                             <span className="ml-2 text-xs">
//                               ({location.type})
//                             </span>
//                           </div>
//                         </LocationDialog>
//                         <button
//                           className="absolute -top-2.5 -right-0.5 bg-primary rounded-md"
//                           onClick={() => handleDeleteLocation(location.id)}
//                           title="Delete Location"
//                         >
//                           <X size={16} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-xl font-semibold">Distribution Rights</h3>
//                   <DistributionRightsDialog
//                     onSave={handleAddDistributionRight}
//                     addresses={locationData.locations}
//                   />
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {distributionRights.map((right, index) => (
//                     <div key={index} className=" relative">
//                       <DistributionRightsDialog
//                         key={index}
//                         onSave={(updatedRight: DistributionRightFormData) => {
//                           setDistributionRights((prev) =>
//                             prev.map((r, i) => (i === index ? updatedRight : r))
//                           );
//                         }}
//                         addresses={locationData.locations}
//                         initialData={right}
//                         triggerText=""
//                         dialogTitle="Edit Distribution Right"
//                       >
//                         <div className="text-sm cursor-pointer bg-secondary rounded-2xl p-2">
//                           <span className="ml-2 text-xs">
//                             ({right.territories.join(", ")})
//                           </span>
//                         </div>
//                       </DistributionRightsDialog>
//                       <button
//                         className="absolute -top-2.5 -right-0.5 bg-primary rounded-md"
//                         onClick={() => handleDeleteDistributionRights(index)}
//                         title="Delete Rights"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <Button type="submit" className="w-full">
//                 {editData ? "Update Distributor" : "Add Distributor"}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       )}
//       {showImageUpload && (
//         <CardContent className="flex justify-center p-5">
//           <ImageUploader
//             uploadFn={({ image }) =>
//               uploadDistributorLogo({
//                 distributorId: distributorData.id || "",
//                 image,
//               })
//             }
//             fallbackText={distributorData.distributorName || ""}
//             isUploading={isPending}
//             buttonText={"Distributor Logo"}
//           />
//         </CardContent>
//       )}
//     </Card>
//   );
// };

// export default DistributorForm;















const DistributorForm: React.FC<DistributorFormProps> = ({
  editData,
  onSubmitSuccess,
}) => {
  const [distributorData, setDistributorData] = useState<{
    id: string | null;
    distributorName: string | null;
  }>({ id: null, distributorName: null });
  const [locationData, setLocationData] = useState<LocationFormData>({
    locations: editData?.locations || [],
    contacts: {
      phoneNumbers: editData?.contacts?.phoneNumbers || [],
      emails: editData?.contacts?.emails || [],
    },
  });

  const [distributionRights, setDistributionRights] = useState<
    DistributionRightFormData[]
  >(editData?.distributionRights || []);
  const [showImageUpload, setShowImageUpload] = useState<boolean>(false);
  const { mutate: uploadDistributorLogo, isPending } =
    useDistributorLogoUpload();

  const form = useForm<DistributorFormData>({
    resolver: zodResolver(DistributorSchema),
    defaultValues: {
      name: editData?.name || "",
      commissionRate: editData?.commissionRate || 0,
      isActive: editData?.isActive !== undefined ? editData.isActive : false,
    },
    mode: "onSubmit",
  });

  const { mutate: addDistributorMutation } = useAddDistributor();
  // const { mutate: updateDistributorMutation } = useUpdateDistributor();

  const handleSubmit = form.handleSubmit((data) => {
    console.log("Form submitted with data:", data);
    
    try {
      const transformedContacts = locationData.locations.map((loc) => {
        const phoneNumbersForLoc = locationData.contacts.phoneNumbers
          .filter((phone) => phone.locationId === loc.id)
          .map((phone) => ({
            type: phone.type.charAt(0).toUpperCase() + phone.type.slice(1),
            number: phone.number,
          }));

        const emailsForLoc = locationData.contacts.emails
          .filter((email) => email.locationId === loc.id)
          .map((email) => ({
            type: email.type.charAt(0).toUpperCase() + email.type.slice(1),
            email: email.email,
          }));

        return {
          location: loc.location,
          phoneNumbers: phoneNumbersForLoc,
          emails: emailsForLoc,
        };
      });

      // Prepare complete data for API
      const completeData = {
        id: editData?._id || "",
        name: data.name,
        commissionRate: data.commissionRate,
        isActive: data.isActive,
        locations: locationData.locations.map((loc) => ({
          type: loc.type,
          location: loc.location,
          coordinates: {
            latitude: parseFloat(loc.coordinates.latitude),
            longitude: parseFloat(loc.coordinates.longitude),
          },
        })),
        contacts: transformedContacts,
        distributionRights: distributionRights.map((right) => ({
          movieId: right.movieId,
          commissionRate: right.commissionRate,
          territories: right.territories,
          validFrom: right.validFrom,
          validUntil: right.validUntil,
        })),
      };

      // Submit to API
      if (editData?._id) {
        console.log("Update mode - submitted data:", completeData);
        // updateDistributorMutation(completeData, {
        //   onSuccess: (data) => {
        //     setDistributorData({
        //       id: data.distributor._id,
        //       distributorName: data.distributor.name,
        //     });
        //     setShowImageUpload(true);
        //     if (onSubmitSuccess) onSubmitSuccess();
        //   },
        // });
      } else {
        console.log("Add mode - submitted data:", completeData);
        addDistributorMutation(completeData, {
          onSuccess: (data) => {
            console.log("Add mutation successful:", data);
            setDistributorData({
              id: data.distributor._id,
              distributorName: data.distributor.name,
            });
            setShowImageUpload(true);
            if (onSubmitSuccess) onSubmitSuccess();
          },
          onError: (error) => {
            console.error("Add mutation failed:", error);
          }
        });
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData.name || "",
        commissionRate: editData.commissionRate || 0,
        isActive: editData.isActive !== undefined ? editData.isActive : false,
      });
      
      setLocationData({
        locations: editData.locations || [],
        contacts: {
          phoneNumbers: editData.contacts?.phoneNumbers || [],
          emails: editData.contacts?.emails || [],
        },
      });
      setDistributionRights(editData.distributionRights || []);
    }
  }, [editData, form]);

  const handleAddLocation = (data: LocationFormData) => {
    setLocationData({
      locations: [...locationData.locations, ...data.locations],
      contacts: {
        phoneNumbers: [
          ...locationData.contacts.phoneNumbers,
          ...data.contacts.phoneNumbers,
        ],
        emails: [...locationData.contacts.emails, ...data.contacts.emails],
      },
    });
  };

  const handleAddDistributionRight = (rightData: DistributionRightFormData) => {
    setDistributionRights([...distributionRights, rightData]);
  };

  const handleDeleteLocation = (locationId: string) => {
    setLocationData((prev) => ({
      locations: prev.locations.filter((loc) => loc.id !== locationId),
      contacts: {
        phoneNumbers: prev.contacts.phoneNumbers.filter(
          (phone) => phone.locationId !== locationId
        ),
        emails: prev.contacts.emails.filter(
          (email) => email.locationId !== locationId
        ),
      },
    }));
  };

  const handleDeleteDistributionRights = (indexToDelete: number) => {
    setDistributionRights((prev) =>
      prev.filter((_, index) => index !== indexToDelete)
    );
  };

  return (
    <Card className="w-full mx-auto">
      {!showImageUpload && (
        <CardContent className="p-8">
          <Form {...form}>
            <form 
              onSubmit={(e) => {
                console.log("Form submit event triggered");
                handleSubmit(e);
              }} 
              className="space-y-8"
            >
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distributor Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
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
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">
                    Location and Contacts
                  </h3>
                  <LocationDialog onSave={handleAddLocation} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex flex-wrap gap-2">
                    {locationData.locations.map((location) => (
                      <div key={location.id} className="relative">
                        <LocationDialog
                          key={location.id}
                          onSave={(data: LocationFormData) => {
                            setLocationData((prev) => {
                              // Filter out old location and its contacts
                              const updatedLocations = prev.locations.map(
                                (loc) =>
                                  loc.id === location.id
                                    ? data.locations[0]
                                    : loc
                              );

                              const updatedPhoneNumbers =
                                prev.contacts.phoneNumbers
                                  .filter(
                                    (phone) => phone.locationId !== location.id
                                  )
                                  .concat(data.contacts.phoneNumbers);

                              const updatedEmails = prev.contacts.emails
                                .filter(
                                  (email) => email.locationId !== location.id
                                )
                                .concat(data.contacts.emails);

                              return {
                                locations: updatedLocations,
                                contacts: {
                                  phoneNumbers: updatedPhoneNumbers,
                                  emails: updatedEmails,
                                },
                              };
                            });
                          }}
                          initialData={{
                            locations: [location],
                            contacts: {
                              phoneNumbers:
                                locationData.contacts.phoneNumbers.filter(
                                  (phone) => phone.locationId === location.id
                                ),
                              emails: locationData.contacts.emails.filter(
                                (email) => email.locationId === location.id
                              ),
                            },
                          }}
                          triggerText=""
                          dialogTitle="Edit Location"
                        >
                          <div
                            className={`px-3 py-1 text-sm cursor-pointer rounded-full pb-2 ${
                              location.type === "HQ"
                                ? "bg-primary/40"
                                : "bg-secondary"
                            }`}
                          >
                            {location.location}{" "}
                            <span className="ml-2 text-xs">
                              ({location.type})
                            </span>
                          </div>
                        </LocationDialog>
                        <button
                          className="absolute -top-2.5 -right-0.5 bg-primary rounded-md"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteLocation(location.id);
                          }}
                          title="Delete Location"
                          type="button"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Distribution Rights</h3>
                  <DistributionRightsDialog
                    onSave={handleAddDistributionRight}
                    addresses={locationData.locations}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {distributionRights.map((right, index) => (
                    <div key={index} className=" relative">
                      <DistributionRightsDialog
                        key={index}
                        onSave={(updatedRight: DistributionRightFormData) => {
                          setDistributionRights((prev) =>
                            prev.map((r, i) => (i === index ? updatedRight : r))
                          );
                        }}
                        addresses={locationData.locations}
                        initialData={right}
                        triggerText=""
                        dialogTitle="Edit Distribution Right"
                      >
                        <div className="text-sm cursor-pointer bg-secondary rounded-2xl p-2">
                          <span className="ml-2 text-xs">
                            ({right.territories.join(", ")})
                          </span>
                        </div>
                      </DistributionRightsDialog>
                      <button
                        className="absolute -top-2.5 -right-0.5 bg-primary rounded-md"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteDistributionRights(index);
                        }}
                        title="Delete Rights"
                        type="button"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                onClick={() => console.log("Submit button clicked")}
              >
                {editData ? "Update Distributor" : "Add Distributor"}
              </Button>
            </form>
          </Form>
        </CardContent>
      )}
      {showImageUpload && (
        <CardContent className="flex justify-center p-5">
          <ImageUploader
            uploadFn={({ image }) =>
              uploadDistributorLogo({
                distributorId: distributorData.id || "",
                image,
              })
            }
            fallbackText={distributorData.distributorName || ""}
            isUploading={isPending}
            buttonText={"Distributor Logo"}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default DistributorForm;