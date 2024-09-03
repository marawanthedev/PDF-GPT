import { Cloud, File, Loader2 } from "lucide-react";
import { useState } from "react";
import DropZone from "react-dropzone";
import { Progress } from "../ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "../ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { db } from "@/db";

export const UploadDropZone = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();
  const { startUpload } = useUploadThing("pdfUploader");
  const { toast } = useToast();
  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: async (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const startSimulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 95) {
          clearInterval(interval);
          return p;
        }
        return p + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <DropZone
      multiple={false}
      onDrop={async (acceptedFiles) => {
        setIsUploading(true);
        const progressInterval = startSimulateProgress();

        // handle file uploading
        const res = await startUpload(acceptedFiles);

        if (!res) {
          return toast({
            title: "Something went wrong",
            description: "please try again later",
            variant: "destructive",
          });
        }

        const [fileResponse] = res;
        const key = fileResponse.key;

        if (!key) {
          return toast({
            title: "Something went wrong",
            description: "please try again later",
            variant: "destructive",
          });
        }

        //   once its done  we clear interval
        clearInterval(progressInterval);
        setUploadProgress(100);

        //   polling mechanism
        startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => {
        return (
          <div
            {...getRootProps()}
            className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
          >
            <div className="flex items-center justify-center h-full w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Cloud className="h-6 w-6 mb-2 text-zinc-500" />
                  <p className="mb-2 text-sm text-zinc-700">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-zinc-500">PDF (up tp 4mb)</p>
                </div>
                {acceptedFiles && acceptedFiles[0] ? (
                  <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                    <div className="px-3 py-2 h-full grid place-items-start">
                      {/* preview */}
                      <File className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="px-3 py-2 text-sm truncate">
                      {acceptedFiles[0].name}
                    </div>
                  </div>
                ) : null}

                {isUploading ? (
                  <div className="w-full mt-4 max-w-xs mx-auto">
                    <Progress
                      indicatorColor={
                        uploadProgress === 100 ? "bg-green-500" : ""
                      }
                      value={uploadProgress}
                      className="h-2 w-full bg-zinc-200"
                    />
                    {uploadProgress === 100 ? (
                      <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                        <Loader2 className="h-3 w-3  animate-spin" />
                        Redirecting...
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <input
                  type="file"
                  id="dropzone-file"
                  className="hidden"
                  {...getInputProps()}
                />
              </label>
            </div>
          </div>
        );
      }}
    </DropZone>
  );
};
