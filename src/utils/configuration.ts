import { config } from 'dotenv';
import { validateEnvironmentVariable } from './helpers';

config();

export const SERVER = {
    HOST: validateEnvironmentVariable(process.env.REST_HOST),
    PORT: Number(validateEnvironmentVariable(process.env.REST_PORT)),
    ORIGIN: () => {
        if (validateEnvironmentVariable(process.env.REST_ORIGIN) === 'true') {
            return true;
        }

        return process.env.REST_ORIGIN;
    }
}

export const CLIENT_APP = {
    HOST: validateEnvironmentVariable(process.env.APP_HOST),
    PORT: Number(validateEnvironmentVariable(process.env.APP_PORT))
}

export const DATABASE = require(validateEnvironmentVariable(process.env.DATABASE_KEY_PATH));

export const CACHE = {
    HOST: validateEnvironmentVariable(process.env.REDIS_HOST),
    PORT: Number(validateEnvironmentVariable(process.env.REDIS_PORT))
}

export const ENVIRONMENT = validateEnvironmentVariable(process.env.ENVIRONMENT);

export const IDENTITY = {
    GOOGLE: {
        ID: validateEnvironmentVariable(process.env.GOOGLE_CLIENT_ID),
        SECRET: validateEnvironmentVariable(process.env.GOOGLE_CLIENT_SECRET)
    },
    MICROSOFT: {
        ID: validateEnvironmentVariable(process.env.MICROSOFT_CLIENT_ID),
        AUTHORITY: validateEnvironmentVariable(process.env.MICROSOFT_AUTHORITY),
        SECRET: validateEnvironmentVariable(process.env.MICROSOFT_CLIENT_SECRET)
    }
}

export const PATH = {
    API: {
        v1: {
            name: '/api/v1',
            auth: '/api/v1/auth'
        }
    }
}

export const ACCESS_TOKEN_SECRET = validateEnvironmentVariable(process.env.ACCESS_TOKEN_SECRET);
export const ACCESS_TOKEN_ISSUER = validateEnvironmentVariable(process.env.ACCESS_TOKEN_ISSUER);
export const ACCESS_TOKEN_LIVE_IN_HOURS = Number(validateEnvironmentVariable(process.env.ACCESS_TOKEN_LIVE_IN_HOURS));

export function SET_APPLICATION_PATH() {
    if (ENVIRONMENT === 'development') {
        return `http://${CLIENT_APP.HOST}:${CLIENT_APP.PORT}`
    }
    if (ENVIRONMENT === 'qa') {
        return `http://qa.${CLIENT_APP.HOST}:${CLIENT_APP.PORT}`
    }
    
    return `https://${CLIENT_APP.HOST}:${CLIENT_APP.PORT}`
}

export const LISTED_INSTRUMENT_TYPES = {
    PREMIUM: 'Premium_Equities_Segment',
    STANDARD: 'Standard_Equities_Segment',
    SPECIAL_PURPOSE_VEHICLES: 'Special_Purpose_Vehicles_Segment',
    BONDS: 'Bonds_Segment',
    COMPENSATORY_INSTRUMENTS: 'Compensatory_Instruments_Segment',
    EXCHANGE_TRADED_PRODUCTS: 'Exchange_Traded_Products_Segment',
    SUBSCRIPTION_RIGHTS: 'Subscription_Rights_Segment',
    PRIVATISATION: 'Privatisation_Segment',
    INITIAL_PUBLIC_OFFERING: 'Initial_Public_Offering_Segment',
    GOVERNMENT_SECURITIES: 'Government_Securities_Segment'
}

export const MARKET_INSTRUMENTS_CACHE_KEY = 'market-instruments';

export const CRM_TOKEN = validateEnvironmentVariable(process.env.CRM_PROJECT_TOKEN);