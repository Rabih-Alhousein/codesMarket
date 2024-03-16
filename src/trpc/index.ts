// this is the backend router, it's the entry point for all your backend procedures

import { authRouter } from "./auth-router";
import { router } from "./trpc";

export const appRouter = router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
