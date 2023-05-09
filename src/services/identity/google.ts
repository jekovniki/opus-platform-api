import { OAuth2Client } from "google-auth-library";
import { IDENTITY, PATH, SET_APPLICATION_PATH } from "../../utils/configuration";
import { handleErrors } from "../../utils/errors";
import { Request } from "express";
import { addEmployee, checkIfEmployeeExistsById, getEmployeeByEmail, setEmployeeLastLogin } from "../../dal/employee";
import { IBaseResponse } from "../../interfaces/base";
import { IEmployeeData } from "../../interfaces/services/employee";
import { USER_STATUS } from "../../utils/constants/user";

const client = new OAuth2Client(IDENTITY.GOOGLE.ID, IDENTITY.GOOGLE.SECRET, `${SET_APPLICATION_PATH()}${PATH.API.v1.auth}/google/callback`);

export function redirectToGoogleAuthentication(): string {
    return client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email']
    });
}

export async function loginWithGoogle(request: Request): Promise<IEmployeeData | IBaseResponse> {
    try {
      const { tokens } = await client.getToken(request.query.code as string);
      client.setCredentials(tokens);
      const { data } = await client.request({
        url: 'https://www.googleapis.com/oauth2/v1/userinfo',
      }) as Record<string, any>;

      const employeeExists = await checkIfEmployeeExistsById(data?.id);
      if (employeeExists === false) {
        await addEmployee({
          id: data.id,
          email: data?.email,
          verifiedEmail: data?.verified_email,
          givenName: data?.given_name,
          familyName: data?.family_name,
          picture: data?.picture,
          job: data?.job || null,
          companyUic: null,
          status: USER_STATUS.PENDING,
          createdAt: Date.now(),
          lastLogin: Date.now()
        });

        return {
          id: data.id,
          email: data?.email,
          verifiedEmail: data?.verified_email,
          givenName: data?.given_name,
          familyName: data?.family_name,
          picture: data?.picture,
          job: data?.job || null,
          status: USER_STATUS.PENDING,
          companyUic: data?.company || null,
          createdAt: Date.now(),
          lastLogin: Date.now()
        }
      }

      await setEmployeeLastLogin(data?.email);

      return getEmployeeByEmail(data?.email);
    } catch (error) {
      console.log(error);
        return handleErrors(error)
    }
}