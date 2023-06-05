import { Router } from "express";
import { getExchangeRatesFromBNB } from "../../../controllers/exchange-rates";

const exchangeRouter = Router({ mergeParams: true });

exchangeRouter
.get(`/exchange`, getExchangeRatesFromBNB);

export default exchangeRouter;