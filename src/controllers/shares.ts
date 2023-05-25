import { Request, Response } from 'express';
import { SERVER, SUCCESS, ERRORS } from '../utils/constants/status-codes';
import { isValueInObject } from '../utils/helpers';
import { ENTITY_TYPES } from '../utils/configuration';
import { getSharesByCompanyId } from '../services/companies';
import { getMutualFundSharesById } from '../services/funds';

export async function getEntityShares(request: Request, response: Response) {
    try {
        if (!request?.query?.id ) {
            response.status(ERRORS.BAD_REQUEST.CODE).send({
                success: false,
                message: ERRORS.BAD_REQUEST.MESSAGE
            });
            return;
        }
        if (!request.query.type || isValueInObject(ENTITY_TYPES, request.query.type as string) === false) {
            response.status(ERRORS.BAD_REQUEST.CODE).send({
                success: false,
                message: ERRORS.BAD_REQUEST.MESSAGE
            });
            return;
        }
        if (request.query.type === ENTITY_TYPES.COMPANY) {
            const result = await getSharesByCompanyId(request.query.id as string);
            
            response.status(SUCCESS.OK.CODE).send(result);

            return;
        }
        if (request.query.type === ENTITY_TYPES.FUND) {
            const result = await getMutualFundSharesById(request.query.id as string);

            response.status(SUCCESS.OK.CODE).send(result);

            return;
        }

        response.status(ERRORS.BAD_REQUEST.CODE).send({
            success: false,
            message: ERRORS.BAD_REQUEST.MESSAGE
        });

    } catch(error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        })
    }
}