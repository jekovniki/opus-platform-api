import { Express, Request, Response } from "express";
import { logger } from "../libs/logger";
import { PATH } from "../utils/configuration";
import { register, redirectToGoogle, loginWithGoogle, loginInternal, redirectToMicrosoft, loginWithMicrosoft } from "../controllers/identity";
import { loggingMiddleware } from "./middleware/logging";
import { validationMiddleware } from "./middleware/validation";
import { loginSchema, registrationSchema } from "../types/identity";
import { accessControlMiddleware } from "./middleware/access";
import { managementCompanySchema } from "../types/companies";
import { addManagementCompany, getManagementCompany } from "../controllers/companies";
import { setEmployeeStatus } from "../controllers/employee";
import { SUCCESS } from "../utils/constants/status-codes";
import { employeeStatusSchema } from "../types/employee";
import { mutualFundSchema } from "../types/funds";
import { addMutualFund, getMutualFund } from "../controllers/funds";

export function setRoutes(server: Express): void {
    try {
        server.get('/', loggingMiddleware, (_request: Request, response: Response) => {
            response.status(SUCCESS.OK.CODE).send({
                message: 'Welcome to Opus Platform'
            })
        })

        server.post(`${PATH.API.v1.name}/register`, loggingMiddleware, validationMiddleware(registrationSchema), register);

        setIdentityRoutes(server);
        setPrivateRoutes(server);

    } catch (error) {
        logger.error(error);
    }
}

export function setIdentityRoutes(server: Express): void {
    try {
        server.get(`${PATH.API.v1.auth}/google`, loggingMiddleware, redirectToGoogle);
        server.get(`${PATH.API.v1.auth}/google/callback`, loggingMiddleware, loginWithGoogle);

        server.get(`${PATH.API.v1.auth}/microsoft`, loggingMiddleware, redirectToMicrosoft);
        server.get(`${PATH.API.v1.auth}/microsoft/callback`, loggingMiddleware, loginWithMicrosoft);
        
        server.post(`${PATH.API.v1.auth}/internal/login`, loggingMiddleware, validationMiddleware(loginSchema),  loginInternal);

    } catch (error) {
        logger.error(error);
    }
}

export function setPrivateRoutes(server: Express):void {
    try {
        server.get(`/private`, loggingMiddleware, accessControlMiddleware, (_request: Request, response: Response) => {
            response.status(SUCCESS.OK.CODE).send({
                message: 'You are signed in successfully'
            });
        });

        server.post(`${PATH.API.v1.name}/company`, loggingMiddleware, validationMiddleware(managementCompanySchema), addManagementCompany);
        server.get(`${PATH.API.v1.name}/company`, loggingMiddleware, getManagementCompany);

        server.post(`${PATH.API.v1.name}/mutual-fund`, loggingMiddleware, validationMiddleware(mutualFundSchema), addMutualFund);
        server.get(`${PATH.API.v1.name}/mutual-fund`, loggingMiddleware, getMutualFund);

        server.put(`${PATH.API.v1.name}/employee/status`, loggingMiddleware, accessControlMiddleware, validationMiddleware(employeeStatusSchema), setEmployeeStatus);
    } catch (error) {
        logger.error(error);
    }
}