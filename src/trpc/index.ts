import { z } from 'zod';
import { procedure, router } from './trpc';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError } from '@trpc/server';

export const appRouter = router({
    authCallBack: procedure.query(() => {
        const { getUser } = getKindeServerSession()
        const user = getUser()
        if (!user || !user.id) {
            throw new TRPCError({ code: "UNAUTHORIZED" })
        }

        // check if user is in db

        return { success: true }
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;