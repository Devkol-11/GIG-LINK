declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT?: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    COIN_GECKO_API_KEY: string;
    COIN_MARKET_CAP_API_KEY: string;
  }
}
