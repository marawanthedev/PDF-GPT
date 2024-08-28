"use client";

import { ChevronDown, ChevronUp, Loader2, SearchIcon } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useToast } from "../ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type IPdfRenderer = {
  url: string;
};

export const PdfRenderer = ({ url }: IPdfRenderer) => {
  const { toast } = useToast();
  const { ref, width } = useResizeDetector();
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [currPage, setCurrPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const previousPage = () => {
    setCurrPage((prev) => {
      if (prev - 1 >= 1) {
        return prev - 1;
      }
      return prev;
    });
  };
  const nextPage = () => {
    setCurrPage((prev) => {
      if (prev + 1 > numPages!) {
        return prev;
      } else {
        return prev + 1;
      }
    });
  };
  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrPage(Number(page));
    setValue("page", page);
  };

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      {/* topbar*/}
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currPage <= 1}
            onClick={previousPage}
            variant="ghost"
            aria-label="previous page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={`${cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}`}
              onBlur={() => handleSubmit(handlePageSubmit)()}
            />
          </div>
          <p className="text-zinc-700 text-sm space-x-1">
            <span>/</span>
            <span>{numPages ?? "x"}</span>
          </p>
          <Button
            disabled={numPages === undefined || currPage === numPages}
            onClick={nextPage}
            variant="ghost"
            aria-label="next page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button aria-label="zoom" variant="ghost" className="gap-1.5">
                <SearchIcon className="h-4 w-4" />
                {scale * 100}%
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(1);
                }}
              >
                100%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(1.5);
                }}
              >
                150%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(2);
                }}
              >
                200%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* topbar*/}
      {/* pdf view */}
      <div className="flex-1 w-full max-h-screen-">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh - 10rem)]">
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
              <Page
                width={width ? width : 1}
                pageNumber={currPage}
                scale={scale}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
      {/* pdf view */}
    </div>
  );
};
