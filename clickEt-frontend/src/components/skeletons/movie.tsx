import { Skeleton } from "@/components/shadcn/skeleton";

export const MovieDetailsSkeleton = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="relative h-[80vh] overflow-hidden">
      <Skeleton className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="absolute bottom-20 left-0 px-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-8" />
          <Skeleton className="h-8 w-full mb-8" />
          <Skeleton className="h-8 w-full mb-8" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  </div>
);