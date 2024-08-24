import { z } from 'zod';
import { publicProcedure, router, privateProcedure } from './trpc';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';

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

    })

});

// export type definition of API
export type AppRouter = typeof appRouter;