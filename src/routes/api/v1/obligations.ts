import { Router } from "express";
import { validationMiddleware } from "../../../middleware/validation";
import { addManualObligation, getAllObligations, setObligationStatus } from "../../../controllers/obligations";
import { manualObligationSchema, obligationStatusSchema } from "../../../types/obligations";

const obligationsRouter = Router({ mergeParams: true });

obligationsRouter
.get(`/obligation`, getAllObligations)
.put(`/obligation`, validationMiddleware(obligationStatusSchema), setObligationStatus)
obligationsRouter.post(`/obligation/manual`, validationMiddleware(manualObligationSchema), addManualObligation);

export default obligationsRouter;