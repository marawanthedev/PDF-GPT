import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { pc } from "../../../lib/pinecon"

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
            const createdFile = await db.file.create({
                data: {
                    key: file.key,
                    name: file.name,
                    userId: metadata.userId,
                    url: file.url,
                    uploadStatus: 'PROCCESSING'
                }
            })

            try {
                const pdfResponse = await fetch(createdFile.url)
                const pdfBlob = await pdfResponse.blob()
                const loader = new PDFLoader(pdfBlob)
                const pageLevelDocs = await loader.load()
                const pagesAmt = pageLevelDocs.length

                // steps
                // 1- fetch file
                // 2- convert file to blob
                // 3- load it using pdf loader
                // 4- split text into chunks
                // 5- map chunks and create text out of it
                // 6- embed using openai embeddings and pass text mapped chunks
                // 7- create pinecone compatible embed format
                // 8- upsert to pinecone

                // next would be
                // how to query through them
                // whats the big picture usage of pinecone and openai api

                const textSplitter = new RecursiveCharacterTextSplitter({
                    chunkSize: 1000,
                    chunkOverlap: 200,
                });

                const chunkedDocument = await textSplitter.splitDocuments(pageLevelDocs)
                const chunkedDocumentText = chunkedDocument.map((chunk) => chunk.pageContent.replace(/\n/g, " "))



                const openai = new OpenAI({
                    apiKey: process.env.OPENAI_API_KEY!
                });

                const embeddingsResponse = await openai.embeddings.create({
                    model: "text-embedding-ada-002",
                    input: chunkedDocumentText,
                });

                const embeddings = embeddingsResponse.data.map((embedding: any, index: number) => ({
                    id: `chunk-${index}`, // You can customize this ID based on the document structure
                    values: embedding.embedding,
                    metadata: {
                        fileName: createdFile.name,
                        page: index,
                        content: chunkedDocumentText[index],
                    },
                }));


                const indexName = 'pdf-gpt';

                const existingIndex = await pc.Index(indexName);
                if (!existingIndex) {
                    await pc.createIndex({
                        name: indexName,
                        dimension: embeddings[0].values.length, // Match the dimension of the embedding
                        metric: 'cosine',
                        suppressConflicts: true,
                        spec: {
                            serverless: {
                                cloud: 'aws',
                                region: 'us-east-1',
                            },
                        },
                    });
                }

                const index = pc.index(indexName);

                await index.namespace(createdFile.id).upsert(embeddings)
            }
            catch (err) {
                console.log('error', err)
            }
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;