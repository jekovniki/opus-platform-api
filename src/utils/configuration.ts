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