import { Request, Response } from "express";
import * as PEP from "../services/pep";
import { SERVER, SUCCESS } from "../utils/constants/status-codes";


export async function getPEPList(_request: Request, response: Response): Promise<void> {
    try {
        const result = await PEP.getPEPList();
        if (result.success === false) {
            response.status(SERVER.ERROR.CODE).send(result);
            return;
        }

        response.status(SUCCESS.CREATED.CODE).send(result);
    } catch (error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        });
    }
}