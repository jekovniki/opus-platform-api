import { OAuth2Client } from "google-auth-library";
import { IDENTITY } from "../../utils/configuration";
import { handleErrors } from "../../utils/errors";
import { Request } from "express";
import { addEmployee, checkIfEmployeeExistsByID, getEmployeeByEmail, setEmployeeLastLogin } from "../../dal/employee";
import { IBaseResponse } from "../../interfaces/base";
import { IEmployeeData } from "../../interfaces/services/employee";

const client = new OAuth2Client(IDENTITY.GOOGLE.ID, IDENTITY.GOOGLE.SECRET, 'http://localhost:3001/api/v1/auth/google/callback');

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

      const employeeExists = await checkIfEmployeeExistsByID(data?.id);
      if (employeeExists === false) {
        await addEmployee({
          id: data.id,
          email: data?.email,
          verifiedEmail: data?.verified_email,
          givenName: data?.given_name,
          familyName: data?.family_name,
          picture: data?.picture,
          job: data?.job || null,
          company: data?.company || null,
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
          company: data?.company || null,
          createdAt: Date.now(),
          lastLogin: Date.now()
        }
      }

      await setEmployeeLastLogin(data?.email);

      return getEmployeeByEmail(data?.email);
    } catch (error) {
        return handleErrors(error)
    }
}