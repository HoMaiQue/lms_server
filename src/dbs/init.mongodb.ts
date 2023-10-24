import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connectString = process.env.DB_URL as string
class Database {
  private static instance: Database
  constructor() {
    this.connect()
  }
  connect(type = 'mongodb') {
    mongoose.set('debug', true)
    mongoose.set('debug', { color: true })

    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then((_) => {
        console.log('Connected MongoDB Success')
      })
      .catch((e) => console.log('Error Connect'))
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}
const instanceMongoDB = Database.getInstance()
export default instanceMongoDB
