interface AppConfig {
  port: string | number
}

interface DbConfig {
  host: string
  port: string
  name: string
}

interface EnvironmentConfig {
  app: AppConfig
  db: DbConfig
}

const dev: EnvironmentConfig = {
  app: {
    port: process.env.DEV_ENV_PORT || 3000
  },
  db: {
    host: process.env.DEV_ENV_HOST || '127.0.0.1',
    port: process.env.DEV_ENV_PORT || '27017',
    name: process.env.DEV_ENV_NAME || 'shopDev'
  }
}

const pro: EnvironmentConfig = {
  app: {
    port: process.env.PRO_ENV_PORT || 3000
  },
  db: {
    host: process.env.PRO_ENV_HOST || '127.0.0.1',
    port: process.env.PRO_ENV_PORT || '27017',
    name: process.env.PRO_ENV_NAME || 'shopDev'
  }
}

const config: Record<string, EnvironmentConfig> = { dev, pro }
const env: string = process.env.NODE_ENV || 'dev'

export default config[env]
