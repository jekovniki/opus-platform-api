import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { ERRORS } from "../../utils/constants/status-codes";

export const validationMiddleware = (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) => 
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(request.body);

            next();
        } catch (error) {
            response.status(ERRORS.BAD_REQUEST.CODE).send({
                success: false,
                message: ERRORS.BAD_REQUEST.MESSAGE
            })
        }
    }