import { File } from "@/types";
import { format } from "date-fns";
import { Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Pick } from "@prisma/client/runtime/library";
import { IFilesList } from "../Dashboard/FilesList";

type IFileItem = {
  file: File;
} & Pick<IFilesList, "deleteFile"> &
  Pick<IFilesList, "currentlyDeletingFile">;

export const FileItem = ({
  file,
  deleteFile,
  currentlyDeletingFile,
}: IFileItem) => {
  return (
    <li
      key={file.id}
      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
    >
      <Link href={`/dashboard/${file.id}`}>
        <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
              <h3 className="truncate text-lg font-medium-text-zinc-900">
                {file.name}
              </h3>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4" />{" "}
          {format(new Date(file.createdAt), "MMM yyyy")}{" "}
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          mocked
        </div>
        <Button
          size="sm"
          variant="destructive"
          className="w-full"
          onClick={() => {
            deleteFile({ id: file.id });
          }}
        >
          {file.id === currentlyDeletingFile ? (
            <Loader2 />
          ) : (
            <Trash className="w-4 h-4" />
          )}
        </Button>
      </div>
    </li>
  );
};
