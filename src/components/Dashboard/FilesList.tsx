import { File } from "@/types";
import { FileItem } from "../FileItem";

export type IFilesList = {
  files: File[] | undefined;
  deleteFile: (input: { id: string }) => void; // Adjust the parameter type based on your actual mutation
  currentlyDeletingFile: string | null;
};

export const FilesList = ({
  files,
  deleteFile,
  currentlyDeletingFile,
}: IFilesList) => {
  return (
    <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
      {files &&
        files.length > 0 &&
        files
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((file) => (
            <FileItem
              currentlyDeletingFile={currentlyDeletingFile}
              deleteFile={deleteFile}
              file={file}
            />
          ))}
    </ul>
  );
};
