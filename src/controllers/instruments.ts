import { Request, Response } from "express";
import { ERRORS, SUCCESS, SERVER } from "../utils/constants/status-codes";
import * as Instruments from "../services/instruments";

export async function getMarketInstruments(request: Request, response: Response): Promise<void> {
    try {
        const company = await Instruments.getMarketInstruments(request.query.code as string);
        if (company && 'success' in company && company.success === false) {
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

export async function addMarketInstrumentData(request: Request, response: Response): Promise<void> {
    try {
        const company = await Instruments.addMarketInstrumentByCode(request.body.code);
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