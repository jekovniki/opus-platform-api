import { PublicClientApplication, Configuration } from '@azure/msal-node';
import { handleErrors } from '../../utils/errors';
import { IDENTITY, PATH, SET_APPLICATION_PATH } from '../../utils/configuration';

const config: Configuration = {
    auth: {
        clientId: IDENTITY.MICROSOFT.ID,
        authority: IDENTITY.MICROSOFT.AUTHORITY,
        clientSecret: IDENTITY.MICROSOFT.SECRET
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel:any, message:any, containsPii: any) {
                console.log(message);
            },
            piiLoggingEnabled: false
        }
    }
}

const pca = new PublicClientApplication(config);

export async function redirectToMicrosoftAuthentication(): Promise<string> {
    return pca.getAuthCodeUrl({
        scopes: ['openid', 'profile', 'email'],
        redirectUri: `${SET_APPLICATION_PATH()}${PATH.API.v1.auth}/microsoft/callback`
    });
}

export async function loginWithMicrosoft(request: Record<string, any>){
    try {
        const tokenRequest = {
            code: request?.query?.code,
            scopes: ['openid', 'profile', 'email'],
            redirectUri: `${SET_APPLICATION_PATH()}${PATH.API.v1.auth}/microsoft/callback`
        }

        const response = await pca.acquireTokenByCode(tokenRequest);

        console.log(response.account);

        // crm.people.set(fullEmployeeData.id, {
        //     $name: fullEmployeeData.email,
        //     created: (new Date()).toISOString(),
        //     registrationType: REGISTRATION_TYPE.MICROSOFT,
        //     companyUic: fullEmployeeData.companyUic,
        //     name: fullEmployeeData.givenName + fullEmployeeData.familyName,
        //     status: fullEmployeeData.status,
        //     job: fullEmployeeData.job,
        //     agreedTerms: fullEmployeeData.agreedTerms,
        //     verifiedEmail: fullEmployeeData.verifiedEmail
        // });

        return response.account;

    } catch (error) {
        return handleErrors(error);
    }
}