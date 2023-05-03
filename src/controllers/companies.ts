import { Request, Response } from "express";
import { ERRORS, SERVER, SUCCESS } from "../utils/constants/status-codes";
import * as Companies from "../services/companies";
import { setEmployeeCompanyAndStatus } from "../services/employee";
import { USER_STATUS } from "../utils/constants/user";


export async function addManagementCompany(request: Request, response: Response): Promise<void> {
    try {
        const company = await Companies.addManagementCompany(request.body);
        if (company.success === false) {
            response.status(ERRORS.BAD_REQUEST.CODE).send(company);
        }
        const employee = await setEmployeeCompanyAndStatus({ email: request.body.admin, companyUic: request.body.uic, status: USER_STATUS.APPROVED });
        if (employee.success === false) {
            response.status(ERRORS.BAD_REQUEST.CODE).send(employee);
        }

        response.status(SUCCESS.CREATED.CODE).send(employee);

    } catch(error) {
        response.status(SERVER.ERROR.CODE).send({
            success: false,
            message: SERVER.ERROR.MESSAGE
        })
    }
}

export async function getManagementCompany(request: Request, response: Response): Promise<void> {
    try {
        if (!request?.query?.id) {
            response.status(ERRORS.BAD_REQUEST.CODE).send({
                success: false,
                message: ERRORS.BAD_REQUEST.MESSAGE
            });
            return;
        }

        const company = await Companies.getManagementCompanyById(request.query.id as string);
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