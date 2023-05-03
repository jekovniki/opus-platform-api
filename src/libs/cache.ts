import { Redis, RedisKey} from "ioredis";
import { CACHE } from "../utils/configuration";
import { logger } from "./logger";
import { ICacheService } from "../interfaces/libs/cache";

class Cache implements ICacheService {
    protected client: Redis;
    protected port: number;
    protected host: string;
    protected readyStatus = "ready";
    protected connectStatus = "connect";

    constructor(port: number, host: string) {
        this.port = port;
        this.host = host;
        this.client = new Redis(this.port, this.host);
    }

    public getClient(): Redis {
        return this.client;
    }

    public async get(key: RedisKey): Promise<string | null> {
        return this.client.get(key, (error, result) => {
            if (error) {
                return null;
            }

            return result;
        })
    }

    public async set(key: RedisKey, value: string | number | Buffer): Promise<string | undefined> {
        return this.client.set(key, value);
    }

    public async remove(keys: RedisKey[]): Promise<number> {
        return this.client.del(keys);
    }

    public status(): string {
        if (this.client.status === this.readyStatus || this.client.status === this.connectStatus) {
            logger.info(`Connected successfully to memory database(Redis) on: ${this.host}:${this.port}`);
        } else {
            logger.error(`Could not connected to memory database(Redis) on: ${this.host}:${this.port} | Current status is ${this.client.status}`);
        }

        return this.client.status;
    }
}

export const cache = new Cache(CACHE.PORT, CACHE.HOST);