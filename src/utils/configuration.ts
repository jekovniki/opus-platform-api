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
