"use client";

import { trpc } from "@/app/_trpc/client";
import { UploadButton } from "./UploadButton";
import { Ghost, Plus, MessageSquare, Trash } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "./ui/button";

enum DashboardStates {
  "NO_FILES",
  "LOADING",
  "READY",
}

export const Dashboard = () => {
  const [state, setState] = useState(DashboardStates.LOADING);
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const { mutate: deleteFile } = trpc.deleteUserFile.useMutation();

  useEffect(() => {
    if (isLoading) {
      setState(DashboardStates.LOADING);
    }
  }, [isLoading]);

  useEffect(() => {
    if (files && files.length !== 0 && state !== DashboardStates.READY) {
      setState(DashboardStates.READY);
    } else {
      setState(DashboardStates.NO_FILES);
    }
  }, [files]);

  const NoFilesState = () => {
    return (
      <div className="mt-16 flex flex-col items-center gap-2">
        <Ghost className="h-8 w-8 text-zinc-800" />
        <h3 className="font-semibold text-xl">No files to be displayed</h3>
        <p>Let&apos;s upload your first PDF</p>
      </div>
    );
  };

  const FilesList = () => {
    return (
      <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
        {files &&
          files.length > 0 &&
          files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
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
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
      </ul>
    );
  };

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My files</h1>
        <UploadButton />
      </div>
      {state === DashboardStates.LOADING && (
        <Skeleton height={100} className="my-2" count={3} />
      )}
      {state === DashboardStates.NO_FILES && <NoFilesState />}
      {state === DashboardStates.READY && <FilesList />}
    </main>
  );
};
