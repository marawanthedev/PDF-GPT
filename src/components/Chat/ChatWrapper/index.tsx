"use client";
import { PropsWithChildren, useState } from "react";
import { ChatInput } from "../ChatInput";
import { Messages } from "../Messages";
import { trpc } from "@/app/_trpc/client";
import { FaileState } from "./failedState";
import { ProcessingState } from "./proccessingState";
import { LoadingState } from "./loadingState";

type IPropsWithChildren = {
  fileId: string;
} & PropsWithChildren;

const MAX_REFETCHES = 10;

export const ChatWrapper = (props: IPropsWithChildren) => {
  const [refetchCount, setRefetchCount] = useState(0);
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId: props.fileId,
    },
    {
      refetchInterval: (data) => {
        const done = data?.status === "SUCCESS" || data?.status === "FAILED";
        if (done || refetchCount >= MAX_REFETCHES) {
          return false;
        } else {
          setRefetchCount((prev) => prev + 1);
          return 500;
        }
      },
    }
  );

  // if (isLoading) {
  //   return <LoadingState />;
  // }

  // if (data?.status === "PROCCESSING") {
  //   return <ProcessingState />;
  // }

  // if (data?.status === "FAILED") {
  //   return <FaileState />;
  // }

  return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
      <div className="h-[300px] justify-between flex flex-col mb-28">
        <Messages />
      </div>
      <ChatInput />
    </div>
  );
};
