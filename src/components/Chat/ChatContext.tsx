import { createContext, PropsWithChildren, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";

export type IChatContext = {
  isLoading: boolean;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  addMessage: () => void;
};

export const ChatContext = createContext<IChatContext>({
  message: "",
  isLoading: false,
  handleInputChange: () => {},
  addMessage: () => {},
});

export type IChatContextProvider = PropsWithChildren<{
  fileId: string;
}>;

export const ChatContextProvider = ({
  fileId,
  children,
}: IChatContextProvider) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // send message to api endpoint

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send a message");
      }

      return response.body;
    },
  });

  const addMessage = () => sendMessage({ message });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(e.target.value);

  return (
    <ChatContext.Provider
      value={{ addMessage, message, isLoading, handleInputChange }}
    >
      {children}
    </ChatContext.Provider>
  );
};
