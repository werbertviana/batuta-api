import { Router } from "express";
import { usersRouter} from "../modules/users/users.routes";
import { authRouter } from "../modules/auth/auth.routes";

export const apiRouter = Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/auth", authRouter);
