import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type?: TokenType
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
export interface LoginRequestPayload {
  email: string
  password: string
}

export interface SocialAuthRequestPayload {
  email: string
  name: string
  avatar: string
}
