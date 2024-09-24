import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentsListSkeleton() {
  const items = Array.from(Array(5).keys());
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-4 border rounded-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div>
                <Skeleton className="w-5 h-5 rounded-full" />
              </div>
              <div className="grid gap-1">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[250px]" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
