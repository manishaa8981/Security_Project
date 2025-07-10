// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/shadcn/button";
// import { Input } from "@/components/shadcn/input";
// import { Calendar } from "@/components/shadcn/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/shadcn/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/shadcn/select";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/shadcn/form";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import {
//   MovieFormValues,
//   movieSchema,
// } from "@/lib/formSchemas/movieFormSchema";
// import { useAddMovie } from "@/api/movieApi";

// const MovieForm = () => {
//   const movieMutation = useAddMovie();
//   const form = useForm<MovieFormValues>({
//     resolver: zodResolver(movieSchema),
//     defaultValues: {
//       name: "",
//       category: "Nepali",
//       description: "",
//       releaseDate: new Date(),
//       duration_min: 0,
//       language: "Nepali",
//       posterURL: {
//         sm: "", // Small poster URL
//         lg: "", // Large poster URL
//       },
//       trailerURL: "",
//       status: "upcoming",
//     },
//   });

//   const onSubmit = async (values: MovieFormValues) => {
//     movieMutation.mutate(values);
//   };

//   const getYouTubeThumbnail = (url: string) => {
//     const videoId = url.split("v=")[1]?.split("&")[0];
//     return videoId
//       ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
//       : "";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-2xl mx-auto">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             {/* Trailer Section */}
//             <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//               <FormField
//                 control={form.control}
//                 name="trailerURL"
//                 render={({ field }) => (
//                   <FormItem className="space-y-0">
//                     <div className="aspect-video w-full bg-gray-900">
//                       {field.value ? (
//                         <img
//                           src={
//                             getYouTubeThumbnail(field.value) ||
//                             "/placeholder.svg"
//                           }
//                           alt="Trailer Thumbnail"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center text-gray-400">
//                           Movie Trailer Preview
//                         </div>
//                       )}
//                     </div>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter YouTube trailer URL"
//                         {...field}
//                         className="border-x-0 border-b-0 rounded-none"
//                       />
//                     </FormControl>
//                     <FormMessage className="p-2" />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="relative">
//               {/* Poster Section - Left Side */}
//               <div className="absolute left-4 -top-4 w-[180px]">
//                 <div className="space-y-4">
//                   {/* Small Poster */}
//                   <FormField
//                     control={form.control}
//                     name="posterURL.sm"
//                     render={({ field }) => (
//                       <FormItem className="bg-white rounded-lg shadow-sm overflow-hidden">
//                         <div className="aspect-[2/3] w-full bg-gray-100">
//                           {field.value ? (
//                             <img
//                               src={field.value || "/placeholder.svg"}
//                               alt="Small Movie Poster"
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <div className="w-full h-full flex items-center justify-center text-gray-400">
//                               Small Poster
//                             </div>
//                           )}
//                         </div>
//                         <FormControl>
//                           <Input
//                             placeholder="Small Poster URL"
//                             {...field}
//                             className="border-x-0 border-b-0 rounded-none text-sm"
//                           />
//                         </FormControl>
//                         <FormMessage className="p-2" />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Large Poster */}
//                   <FormField
//                     control={form.control}
//                     name="posterURL.lg"
//                     render={({ field }) => (
//                       <FormItem className="bg-white rounded-lg shadow-sm overflow-hidden">
//                         <div className="aspect-[2/3] w-full bg-gray-100">
//                           {field.value ? (
//                             <img
//                               src={field.value || "/placeholder.svg"}
//                               alt="Large Movie Poster"
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <div className="w-full h-full flex items-center justify-center text-gray-400">
//                               Large Poster
//                             </div>
//                           )}
//                         </div>
//                         <FormControl>
//                           <Input
//                             placeholder="Large Poster URL"
//                             {...field}
//                             className="border-x-0 border-b-0 rounded-none text-sm"
//                           />
//                         </FormControl>
//                         <FormMessage className="p-2" />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               </div>

//               {/* Details Section - Right Side */}
//               <div className="ml-[200px] space-y-6">
//                 <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-sm">
//                   <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                       <FormItem className="col-span-2">
//                         <FormLabel>Movie Name</FormLabel>
//                         <FormControl>
//                           <Input {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="category"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Category</FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="Nepali">Nepali</SelectItem>
//                             <SelectItem value="Bollywood">Bollywood</SelectItem>
//                             <SelectItem value="Hollywood">Hollywood</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="releaseDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Release Date</FormLabel>
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <FormControl>
//                               <Button variant="outline" className="w-full">
//                                 <CalendarIcon className="mr-2 h-4 w-4" />
//                                 {field.value
//                                   ? format(field.value, "PPP")
//                                   : "Pick a date"}
//                               </Button>
//                             </FormControl>
//                           </PopoverTrigger>
//                           <PopoverContent className="w-auto p-0" align="start">
//                             <Calendar
//                               mode="single"
//                               selected={field.value}
//                               onSelect={field.onChange}
//                             />
//                           </PopoverContent>
//                         </Popover>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="duration_min"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Duration (minutes)</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             {...field}
//                             onChange={(e) =>
//                               field.onChange(Number(e.target.value))
//                             }
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="language"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Language</FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="Nepali">Nepali</SelectItem>
//                             <SelectItem value="Hindi">Hindi</SelectItem>
//                             <SelectItem value="English">English</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 {/* Description Section */}
//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem className="bg-white p-6 rounded-lg shadow-sm">
//                       <FormLabel>Description</FormLabel>
//                       <FormControl>
//                         <textarea
//                           {...field}
//                           className="w-full min-h-[120px] p-3 border rounded-md resize-y"
//                           placeholder="Enter movie description"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>

//             {/* Submit Button */}
//             <Button
//               type="submit"
//               disabled={movieMutation.isPending}
//               className="w-full"
//             >
//               {movieMutation.isPending ? "Adding Movie ..." : "Add Movie"}
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default MovieForm;

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Calendar } from "@/components/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";

import { format } from "date-fns";
import {
  CalendarIcon,
  Film,
  Play,
  ImageIcon,
  Clock,
  Globe,
} from "lucide-react";
import {
  MovieFormValues,
  movieSchema,
} from "@/lib/formSchemas/movieFormSchema";
import { useAddMovie } from "@/api/movieApi";

const MovieForm = () => {
  const movieMutation = useAddMovie();
  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      name: "",
      category: "Nepali",
      description: "",
      releaseDate: new Date(),
      duration_min: 0,
      language: "Nepali",
      posterURL: {
        sm: "", // Small poster URL
        lg: "", // Large poster URL
      },
      trailerURL: "",
      status: "upcoming",
    },
  });

  const onSubmit = async (values: MovieFormValues) => {
    movieMutation.mutate(values);
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : "";
  };

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Film className="h-5 w-5" /> Add New Movie
          </CardTitle>
          <CardDescription>
            Enter movie details to add a new title to your catalog
          </CardDescription>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Poster Images */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" /> Movie Posters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Small Poster */}
                  <FormField
                    control={form.control}
                    name="posterURL.sm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Small Poster</FormLabel>
                        <div className="border rounded-md overflow-hidden bg-secondary/20">
                          <div className="aspect-[2/3] w-full">
                            {field.value ? (
                              <img
                                src={field.value}
                                alt="Small Movie Poster"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/20">
                                <ImageIcon className="h-12 w-12 opacity-50" />
                              </div>
                            )}
                          </div>
                          <FormControl>
                            <Input
                              placeholder="Small Poster URL"
                              {...field}
                              className="border-0 rounded-none text-sm bg-background/50 focus:ring-0"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Large Poster */}
                  <FormField
                    control={form.control}
                    name="posterURL.lg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Large Poster</FormLabel>
                        <div className="border rounded-md overflow-hidden bg-secondary/20">
                          <div className="aspect-[2/3] w-full">
                            {field.value ? (
                              <img
                                src={field.value}
                                alt="Large Movie Poster"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/20">
                                <ImageIcon className="h-12 w-12 opacity-50" />
                              </div>
                            )}
                          </div>
                          <FormControl>
                            <Input
                              placeholder="Large Poster URL"
                              {...field}
                              className="border-0 rounded-none text-sm bg-background/50 focus:ring-0"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Middle and Right Columns - Details and Trailer */}
            <div className="lg:col-span-2 space-y-6">
              {/* Movie Details Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Film className="h-4 w-4" /> Movie Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Movie Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter movie title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Nepali">Nepali</SelectItem>
                              <SelectItem value="Bollywood">
                                Bollywood
                              </SelectItem>
                              <SelectItem value="Hollywood">
                                Hollywood
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Globe className="h-4 w-4" /> Language
                            </div>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Nepali">Nepali</SelectItem>
                              <SelectItem value="Hindi">Hindi</SelectItem>
                              <SelectItem value="English">English</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="releaseDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Release Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value
                                    ? format(field.value, "PPP")
                                    : "Pick a date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration_min"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" /> Duration (minutes)
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter duration"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            className="w-full min-h-32 p-3 rounded-md border border-input bg-transparent resize-y focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            placeholder="Enter movie description, plot summary, and other details..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Trailer Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Play className="h-4 w-4" /> Movie Trailer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="trailerURL"
                    render={({ field }) => (
                      <FormItem>
                        <div className="border rounded-md overflow-hidden">
                          <div className="aspect-video w-full bg-secondary/20">
                            {field.value ? (
                              <img
                                src={getYouTubeThumbnail(field.value)}
                                alt="Trailer Thumbnail"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                <Play className="h-12 w-12 mb-2 opacity-50" />
                                <span>Movie Trailer Preview</span>
                              </div>
                            )}
                          </div>
                          <FormControl>
                            <Input
                              placeholder="Enter YouTube trailer URL"
                              {...field}
                              className="border-0 rounded-none focus:ring-0 bg-background/50"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={movieMutation.isPending}
              className="w-full md:w-auto min-w-40"
              size="lg"
            >
              {movieMutation.isPending ? "Adding Movie ..." : "Add Movie"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MovieForm;
