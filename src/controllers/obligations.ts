import { Request, Response } from "express";
import { ERRORS, SUCCESS, SERVER } from "../utils/constants/status-codes";
import * as Obligations from "../services/obligations";

export async function getAllObligations(request: Request, response: Response): Promise<void> {
    try {
        if (!request?.query?.employeeId) {
            response.status(ERRORS.BAD_REQUEST.CODE).send({
                success: false,
                message: ERRORS.BAD_REQUEST.MESSAGE
            });
            return;
        }

        const company = await Obligations.getAllObligations(request.query.employeeId as string, request.query.managementCompanyId as string, request.query.fundIds as any);
        if ('success' in company && company.success === false) {
            response.status(ERRORS.NOT_FOUND.CODE).send(company);
            
            return;
        }

        response.status(SUCCESS.OK.CODE).send(company);

    } catch(error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        })
    }
}

export async function addManualObligation(request: Request, response: Response): Promise<void> {
    try {
        const result = await Obligations.addManualObligation(request.body);
        if ('success' in result && result.success === false) {
            throw result.message;
        }

        response.status(SUCCESS.CREATED.CODE).send(result);
    } catch (error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        });
    }
}

export async function setObligationStatus(request: Request, response: Response): Promise<void> {
    try {
        const result = await Obligations.setObligationStatus(request.body);
        if ('success' in result && result.success === false) {
            throw result.message;
        }

        response.status(SUCCESS.CREATED.CODE).send(result);
    } catch (error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        });
    }
}