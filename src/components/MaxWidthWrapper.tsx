import { cn } from "@/lib/utils";
import { PropsWithChildren, ReactNode } from "react";

type IMaxWidthWrapper = PropsWithChildren & {
  className?: string;
};

export const MaxWidthWrapper = (props: IMaxWidthWrapper) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
        props.className
      )}
    >
      {props.children && props.children}
    </div>
  );
};
