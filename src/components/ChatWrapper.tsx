import { PropsWithChildren } from "react";

export const ChatWrapper = (props: PropsWithChildren) => {
  return <>{props.children && props.children}</>;
};
