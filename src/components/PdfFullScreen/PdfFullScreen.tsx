import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { ExpandIcon, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { useToast } from "../ui/use-toast";

type IPdfFullScreen = {
  url: string;
};

export const PdfFullScreen = ({ url }: IPdfFullScreen) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { ref, width } = useResizeDetector();
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const { toast } = useToast();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button
          variant="ghost"
          className="gap-1.5"
          aria-label="Full screen pdf"
        >
          <ExpandIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh    -10rem)] mt-6">
          <div
            className="flex flex-col justify-center items-center flex-1"
            ref={ref}
          >
            <Document
              loading={
                <div className="flex justify-between">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() =>
                toast({
                  title: "Error loading PDF",
                  description: "please try again",
                  variant: "destructive",
                })
              }
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
              }}
              file={url}
              className="max-h-full "
            >
              {new Array(numPages).fill(0).map((_, index) => {
                return (
                  <Page
                    key={index}
                    width={width ? width : 1}
                    pageNumber={index + 1}
                  />
                );
              })}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};
