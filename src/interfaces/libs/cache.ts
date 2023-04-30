import { Redis, RedisKey } from "ioredis";

export interface ICacheService {
    getClient(): Redis;
    get(key: RedisKey): Promise<string | null>;
    set(key: RedisKey, value: string | number | Buffer): Promise<string | undefined>;
    remove(keys: RedisKey[]): Promise<number>;
    status(): string;
}