import { createHash } from 'node:crypto'

export function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}
export function hashPassword(password: string) {
  return sha256(password + process.env.PASSWORD_SECRET)
}

export function randomCode() {
  return Math.floor(1000 * Math.random() * 9000).toString()
}
