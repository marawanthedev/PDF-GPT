import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft, XCircle } from "lucide-react";
import Link from "next/link";

export const FaileState = () => {
  return (
    <div className="relative min-h-full bg-zinc-50 fl;ex divide-y divide-zinc-200 flex-col justify-between gap-2">
      <div className="flex-1 flex justify-center  items-center flex-col mb-28">
        <div className="flex flex-col items-center gap-2">
          <XCircle className="h-8 w-8 text-red-500" />
          <h3 className="font-semibold text-xl">Too many pages in PDF</h3>
          <p className="text-zinc-500 text-sm">
            Your <span className="font-medium"> Free </span> plan supports up to
            5 pages per PDF
          </p>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "secondary",
              className: "mt-4",
            })}
          >
            <ChevronLeft className="h-3 w-3 mr-1.5" /> Back
          </Link>
        </div>
      </div>
    </div>
  );
};
