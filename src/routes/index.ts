import { Request, Response, Router } from "express";
import { loggingMiddleware } from "../middleware/logging";
import { SUCCESS } from "../utils/constants/status-codes";
import apiRouter from "./api";

const router = Router();

router.use('/api', loggingMiddleware, apiRouter);
router.get('/', loggingMiddleware, (_request: Request, response: Response) => {
    response.status(SUCCESS.OK.CODE).send({
        message: 'Welcome to Opus Platform'
    })
})

export default router;