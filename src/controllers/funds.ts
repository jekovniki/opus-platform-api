import { Request, Response } from "express";
import { SUCCESS, SERVER, ERRORS } from "../utils/constants/status-codes";
import * as Funds from "../services/funds";

export async function addMutualFund(request: Request, response: Response): Promise<void> {
    try {
        const result = await Funds.addMutualFund(request.body);

        response.status(SUCCESS.CREATED.CODE).send(result);
    } catch(error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        })
    }
}

export async function getMutualFund(request: Request, response: Response): Promise<void> {
    try {
        if (!request?.query?.id && !request?.query?.managementCompany) {
            response.status(ERRORS.BAD_REQUEST.CODE).send({
                success: false,
                message: ERRORS.BAD_REQUEST.MESSAGE
            });

            return;
        }

        if (request.query.id) {
            const result = await Funds.getMutualFundById(request?.query?.id as string);
            if ('success' in result && result.success === false) {
                response.status(ERRORS.NOT_FOUND.CODE).send({
                    success: false,
                    message: ERRORS.NOT_ALLOWED.MESSAGE
                })
            }
            response.status(SUCCESS.OK.CODE).send(result);
            return;
        }

        if (request.query.managementCompany) {
            const result = await Funds.getAllMutualFundsPerCompany(request?.query?.managementCompany as string);
            if ('success' in result && result.success === false) {
                response.status(ERRORS.NOT_FOUND.CODE).send({
                    success: false,
                    message: ERRORS.NOT_ALLOWED.MESSAGE
                })
            }
            response.status(SUCCESS.OK.CODE).send(result);
        }
    } catch(error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        })
    }
}

export async function addInstrumentsToMutualFund(request: Request, response: Response) {
    try {
        const result = await Funds.addInstrumentsToMutualFund(request.body);

        response.status(SUCCESS.OK.CODE).send(result);

    } catch(error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        })
    }
}
