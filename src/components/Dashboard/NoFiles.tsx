import { Ghost } from "lucide-react";

export const NoFiles = () => {
  return (
    <div className="mt-16 flex flex-col items-center gap-2">
      <Ghost className="h-8 w-8 text-zinc-800" />
      <h3 className="font-semibold text-xl">No files to be displayed</h3>
      <p>Let&apos;s upload your first PDF</p>
    </div>
  );
};
