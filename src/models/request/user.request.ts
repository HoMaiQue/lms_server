import { JwtPayload } from 'jsonwebtoken'

export interface TokenPayload extends JwtPayload {
  user_id: string
  activationCode: string
  // token_type: TokenType
  // verify: UserVerifyStatus
}
export interface ActivationTokenPayload extends JwtPayload {
  name: string
  email: string
  password: string
  avatar?: string
  activationCode: string
}

export interface RegisterRequestPayload {
  name: string
  email: string
  password: string
  avatar?: string
}
export interface ActivationRequestPayload {
  activationToken: string
  activationCode: string
}
