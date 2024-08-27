import { UploadStatus } from "@prisma/client";

export type File = {
    id: string;
    name: string;
    uploadStatus: UploadStatus;
    url: string;
    key: string;
    createdAt: string;
    updatedAt: string;
    userId: string | null;
}