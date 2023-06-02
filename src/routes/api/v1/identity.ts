import { Router } from "express";
import { loginInternal, loginWithGoogle, loginWithMicrosoft, redirectToGoogle, redirectToMicrosoft } from "../../../controllers/identity";
import { loginSchema } from "../../../types/identity";
import { validationMiddleware } from "../../../middleware/validation";

const identityRouter = Router({ mergeParams: true });

identityRouter.get(`/google`, redirectToGoogle);
identityRouter.get(`/google/callback`, loginWithGoogle);

identityRouter.get(`/microsoft`, redirectToMicrosoft);
identityRouter.get(`/microsoft/callback`, loginWithMicrosoft);
        
identityRouter.post(`/internal/login`, validationMiddleware(loginSchema),  loginInternal);

export default identityRouter;