import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export const ChatInput = () => {
  return (
    <div className="sticky bottom-0 left-0 w-full">
      <form
        action=""
        className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
      >
        <div className="relative flex hfull flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative flex items-center justify-between gap-x-2">
              <Textarea
                autoFocus
                placeholder="Enter your question ..."
                rows={1}
                maxRows={4}
                className="resize-none pr-16  text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
              />
              <Button
                aria-label="send message"
                className="absolute top-[50%] translate-y-[-50%] right-[8px]"
              >
                <Send className="h-full w-[calc(100%-25%)]" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
