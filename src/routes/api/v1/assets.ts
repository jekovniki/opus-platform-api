import { Router } from "express";
import { validationMiddleware } from "../../../middleware/validation";
import { obligationStatusSchema } from "../../../types/obligations";
import { getMarketInstruments } from "../../../controllers/instruments";
import { addMarketInstruments } from "../../../dal/instruments";

const assetsRouter = Router({ mergeParams: true });

assetsRouter
.get(`/instruments`, getMarketInstruments)
.post(`/instruments`, validationMiddleware(obligationStatusSchema), addMarketInstruments);

export default assetsRouter;