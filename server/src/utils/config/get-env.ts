import { Logger } from '@nestjs/common';

const getBooleanFromString = (value: string | undefined, def = false) => {
  if (value === undefined || value === '') return def;

  return ['true', '1', 'yes', 'enabled'].includes(value.toLowerCase());
};

const getNumberFromString = (value: string | undefined, def: number) => {
  if (value === undefined) return def;

  const num = +value;

  if (isNaN(num)) {
    Logger.warn(
      `'${value}' is not a number. It has been defaulted to '${def}'. Please, check the configuration file and set a valid number.`,
    );
    return def;
  }
  return num;
};

export const getEnv = (): EnvFile => {
  const env = process.env as unknown as RawEnvFile;

  return {
    domain: env.DOMAIN,
    databaseUrl: env.DATABASE_URL,
    openApi: getBooleanFromString(env.OPEN_API),
    cors: getBooleanFromString(env.CORS, true),
    port: getNumberFromString(env.PORT, 5001),
    helmet: getBooleanFromString(env.HELMET, true),
    dev: getBooleanFromString(env.DEV, false),

    auth: {
      host: env.TMWU_AUTH_HOST,
      configRetryDelay: getNumberFromString(
        env.TMWU_AUTH_CONFIG_RETRY_DELAY,
        10000,
      ),
    },

    warehouseApiKey: env.WAREHOUSE_API_KEY,
    warehouseHost: env.WAREHOUSE_HOST,

    scrapperApiKeyEncKey: env.SCRAPPER_API_KEY_ENC_KEY,
    https: getBooleanFromString(env.HTTPS, true),
  };
};

interface EnvFile {
  domain: string;

  databaseUrl: string;

  openApi: boolean;
  cors: boolean;
  port: number;
  helmet: boolean;

  dev: boolean;

  auth: {
    host: string;
    configRetryDelay: number;
  };

  warehouseApiKey: string;
  warehouseHost: string;

  scrapperApiKeyEncKey: string;

  https: boolean;
}

class RawEnvFile {
  DOMAIN: string;

  DATABASE_URL: string;

  OPEN_API?: string;
  CORS?: string;
  PORT?: string;
  HELMET?: string;

  DEV?: string;

  TMWU_AUTH_HOST: string;
  TMWU_AUTH_CONFIG_RETRY_DELAY?: string;

  WAREHOUSE_API_KEY: string;
  WAREHOUSE_HOST: string;

  SCRAPPER_API_KEY_ENC_KEY: string;

  HTTPS?: string;
}
