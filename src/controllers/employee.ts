import { Request, Response } from "express";
import * as Employees from "../services/employee";
import { SERVER, SUCCESS } from "../utils/constants/status-codes";

export async function setEmployeeStatus(request: Request, response: Response): Promise<void> {
    try {
        const result = await Employees.setEmployeeStatus(request.body);

        response.status(SUCCESS.CREATED.CODE).send(result);
    } catch(error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        })
    }
}
