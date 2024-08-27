"use client";

import { trpc } from "@/app/_trpc/client";
import { useState, useEffect } from "react";
import { FilesList } from "./FilesList";
import { NoFiles } from "./NoFiles";
import { Loading } from "./Loading";
import { ControlBar } from "./ControlBar";

enum DashboardStates {
  "NO_FILES",
  "LOADING",
  "READY",
}

export const Dashboard = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);
  const utils = trpc.useContext();
  const [state, setState] = useState(DashboardStates.LOADING);
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const { mutate: deleteFile } = trpc.deleteUserFile.useMutation({
    onMutate: ({ id }) => {
      setCurrentlyDeletingFile(id);
    },
    onSuccess: () => {
      utils.getUserFiles.invalidate(); // that is used to invalidate data once changed
    },
    onSettled: () => {
      setCurrentlyDeletingFile(null);
    },
  });

  useEffect(() => {
    if (isLoading) {
      setState(DashboardStates.LOADING);
    }
  }, [isLoading]);

  useEffect(() => {
    if (files && files.length !== 0) {
      if (state !== DashboardStates.READY) {
        setState(DashboardStates.READY);
      }
    } else {
      if (state !== DashboardStates.LOADING) {
        setState(DashboardStates.NO_FILES);
      }
    }
  }, [files]);

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <ControlBar />
      {state === DashboardStates.LOADING && <Loading />}
      {state === DashboardStates.NO_FILES && <NoFiles />}
      {state === DashboardStates.READY && (
        <FilesList
          files={files}
          currentlyDeletingFile={currentlyDeletingFile}
          deleteFile={deleteFile}
        />
      )}
    </main>
  );
};
