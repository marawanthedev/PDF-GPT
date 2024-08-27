import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
    pdfUploader: f({ pdf: { maxFileSize: "4MB" }, })
        .middleware(async ({ req }): Promise<{ userId: string }> => {
            const { getUser } = getKindeServerSession()
            const user = getUser()

            if (!user || !user.id) {
                throw new Error("UnAuthorized")
            }
            return {
                userId: user.id
            };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db.file.create({
                data: {
                    key: file.key,
                    name: file.name,
                    userId: metadata.userId,
                    url: file.url,
                    uploadStatus: 'PROCCESSING'
                }
            })
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;