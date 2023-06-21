import { Router } from "express";
import { getPEPList } from "../../../controllers/pep";

const pepRouter = Router({ mergeParams: true });

pepRouter.get(`/pep`, getPEPList);

export default pepRouter;