import { Router } from "express";
import { validationMiddleware } from "../../../middleware/validation";
import { managementCompanySchema } from "../../../types/companies";
import { addManagementCompany, getManagementCompany } from "../../../controllers/companies";
import { assignInstrumentToFundSchema, mutualFundSchema } from "../../../types/funds";
import { addInstrumentsToMutualFund, addMutualFund, getMutualFund } from "../../../controllers/funds";
import { accessControlMiddleware } from "../../../middleware/access";
import { employeeStatusSchema } from "../../../types/employee";
import { setEmployeeStatus } from "../../../controllers/employee";
import { getEntityShares } from "../../../controllers/shares";

const entityRouter = Router({ mergeParams: true });

entityRouter
    .post(`/company`, validationMiddleware(managementCompanySchema), addManagementCompany)
    .get(`/company`, getManagementCompany);

entityRouter
    .post(`/mutual-fund`, validationMiddleware(mutualFundSchema), addMutualFund)
    .get(`/mutual-fund`, getMutualFund);

entityRouter.post(`/mutual-fund/instrument`, validationMiddleware(assignInstrumentToFundSchema),  addInstrumentsToMutualFund);

entityRouter.put(`/employee/status`, accessControlMiddleware, validationMiddleware(employeeStatusSchema), setEmployeeStatus);

entityRouter.get(`/shares`, getEntityShares);

export default entityRouter;