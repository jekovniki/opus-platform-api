import { Router, Request, Response } from "express";
import { SUCCESS } from "../../../utils/constants/status-codes";
import { accessControlMiddleware } from "../../../middleware/access";

const privateRouter = Router({ mergeParams: true });

privateRouter.get(`/private`, accessControlMiddleware, (_request: Request, response: Response) => {
    response.status(SUCCESS.OK.CODE).send({
        message: 'You are signed in successfully'
    });
})

export default privateRouter;