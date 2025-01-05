import { Router } from "express";
import provinceRouter from "./province.route.js";
import cityRouter from "./city.route.js";
import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";

export const routerV1 = Router();
routerV1.use(provinceRouter);
routerV1.use(cityRouter);
routerV1.use(authRouter);
routerV1.use(userRouter);
