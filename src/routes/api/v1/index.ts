import { Router } from "express";
import identityRouter from "./identity";
import obligationsRouter from "./obligations";
import assetsRouter from "./assets";
import privateRouter from "./private";
import entityRouter from "./entities";
import exchangeRouter from "./exchange-rates"

const v1Router = Router();

v1Router.use(identityRouter);
v1Router.use(obligationsRouter);
v1Router.use(assetsRouter);
v1Router.use(privateRouter);
v1Router.use(entityRouter);
v1Router.use(exchangeRouter);

export default v1Router;