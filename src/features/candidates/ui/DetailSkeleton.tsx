import { Sk } from "@/shared/ui/Skeleton";

export function DetailSkeleton() {
  return (
    <div className="flex flex-col overflow-y-auto rounded-xl border border-[#EDEDED] bg-white lg:h-[648px]">
      <div className="sticky top-0 z-10 border-b border-[#EDEDED] bg-white px-4 sm:px-6 pb-4 pt-4 sm:pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Sk className="h-10 w-10 sm:h-12 sm:w-12 rounded-md" />
            <div className="min-w-0">
              <Sk className="h-5 w-16 mb-2" />
              <Sk className="h-5 sm:h-6 w-56 mb-1" />
              <Sk className="h-3 w-32" />
            </div>
          </div>
          <Sk className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4">
        <div className="border-b border-[#EDEDED] pb-4 space-y-3">
          <Sk className="h-4 w-40" />
          <Sk className="h-4 w-56" />
        </div>
        <div className="py-5 space-y-2">
          <Sk className="h-5 w-32 mb-2" />
          <Sk className="h-3 w-full" />
          <Sk className="h-3 w-11/12" />
          <Sk className="h-3 w-10/12" />
          <Sk className="h-3 w-9/12" />
        </div>
      </div>
    </div>
  );
}
