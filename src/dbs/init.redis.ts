import Redis from 'ioredis'
import dotenv from 'dotenv'
dotenv.config()
const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log('Redis connected')
    return process.env.REDIS_URL
  }
  throw new Error('Redis connection failed')
}
const client = new Redis(redisClient())

export default client
// import Redis from "ioredis"

// const client = new Redis("rediss://default:5f5e57788ea546bebd71e42be9450e73@liberal-gecko-36886.upstash.io:36886");
// export default client
