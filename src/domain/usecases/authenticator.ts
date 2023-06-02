export interface AuthenticationModel {
  email: string
  password: string
}

export interface Authenticator {
  auth: (authModel: AuthenticationModel) => Promise<string>
}
