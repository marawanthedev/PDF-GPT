import { z } from 'zod';
import { publicProcedure, router, privateProcedure } from './trpc';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { pc } from '@/lib/pinecon';
import { DeleteOneOptions } from '@pinecone-database/pinecone';

export const appRouter = router({
    authCallBack: publicProcedure.query(async () => {
        const { getUser } = getKindeServerSession()
        const user = getUser()
        if (!user || !user.id || !user.email) {
            throw new TRPCError({ code: "UNAUTHORIZED" })
        }

        // check if user is in db
        const dbUser = await db.user.findFirst({
            where: {
                email: user.email
            }
        })


        if (!dbUser) {
            // create user in database
            await db.user.create({
                data: {
                    id: user.id,
                    email: user.email,
                }
            })
        }

        return { success: true }
    }),
    getUserFiles: privateProcedure.query(async ({ ctx }) => {
        const { userId } = ctx

        return await db.file.findMany(({
            where: {
                userId: userId
            }
        }))

    }),
    deleteUserFile: privateProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const { userId } = ctx
        const { id } = input

        const file = await db.file.findFirst({
            where: {
                id,
                userId
            }
        })

        if (!file) {
            throw new TRPCError({ code: "NOT_FOUND" })
        }

        // delete from pinecone vector db
        try {

            const index = pc.Index('pdf-gpt')

            // deleting all data within a namespace deletes the name space as well
            await index.namespace(id).deleteAll()

            await db.file.delete({
                where: {
                    id,
                    userId
                }
            })

            return file;

        }
        catch (e) {
            console.log('error:', e)
        }

    }),
    getFile: privateProcedure.input(z.object({ key: z.string() })).mutation(async ({ ctx, input }) => {
        const { userId } = ctx;
        const { key } = input

        const file = await db.file.findFirst({
            where: {
                key,
                userId
            }
        })

        if (!file) {
            throw new TRPCError({ code: "NOT_FOUND" })
        }


        return file
    }),
    getFileUploadStatus: privateProcedure.input(z.object({ fileId: z.string() })).query(async ({ ctx, input }) => {
        const file = await db.file.findFirst({
            where: {
                id: input.fileId,
                userId: ctx.userId
            }
        })

        if (!file) {
            return { status: 'PENDING' as const }
        }

        return {
            status: file.uploadStatus
        }
    })

});

// export type definition of API
export type AppRouter = typeof appRouter;