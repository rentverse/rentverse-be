import { Router } from "express";
import provinceRouter from "./province.route.js";
import cityRouter from "./city.route.js";

export const routerV1 = Router();
routerV1.use(provinceRouter);
routerV1.use(cityRouter);
