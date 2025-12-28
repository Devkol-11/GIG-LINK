export interface ICachePort {
        get<T>(key: string): Promise<T | null>;
        set(key: string, value: any, ttl?: number): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
}
