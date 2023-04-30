import { PublicClientApplication, Configuration } from '@azure/msal-node';
import { handleErrors } from '../../utils/errors';
import { IDENTITY } from '../../utils/configuration';

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
        redirectUri: 'http://localhost:3001/api/v1/auth/microsoft/callback'
    });
}

export async function loginWithMicrosoft(request: Record<string, any>){
    try {
        const tokenRequest = {
            code: request?.query?.code,
            scopes: ['openid', 'profile', 'email'],
            redirectUri: 'http://localhost:3001/api/v1/auth/microsoft/callback'
        }

        const response = await pca.acquireTokenByCode(tokenRequest);

        console.log(response.account);

        return response.account;

    } catch (error) {
        return handleErrors(error);
    }
}