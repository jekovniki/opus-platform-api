import { Response, Request } from 'express';
import * as Services from '../services/exchange-rates';
import { ERRORS, SERVER, SUCCESS } from '../utils/constants/status-codes';

export async function getExchangeRatesFromBNB(request: Request, response: Response): Promise<void> {
    try {
        const result = await Services.getExchangeRates();

        if ('success' in result) {
            response.status(ERRORS.NOT_FOUND.CODE).send(result);
            return;
        }

        response.status(SUCCESS.OK.CODE).send(result);

    } catch (error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        })
    }
}