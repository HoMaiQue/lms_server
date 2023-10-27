export enum ROLE {
  client = 'client',
  vendor = 'vendor'
}
export enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}
export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken,
  ActivationCode
}

export enum MediaType {
  Image,
  Video
}
