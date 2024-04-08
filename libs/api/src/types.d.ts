export interface Oauth2Connector<T> {
  getUserDetails: (accessToken: string) => Promise<T>
}