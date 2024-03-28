import { AxiosResponse } from 'axios';

type Snowflake = string

/**
 * https://discord.com/developers/docs/resources/user#user-object
 * Example:
 * {
 *   "id": "80351110224678912",
 *   "username": "Nelly",
 *   "discriminator": "1337",
 *   "avatar": "8342729096ea3675442027381ff50dfe",
 *   "verified": true,
 *   "email": "nelly@discord.com",
 *   "flags": 64,
 *   "banner": "06c16474723fe537c283b8efa61a30c8",
 *   "accent_color": 16711680,
 *   "premium_type": 1,
 *   "public_flags": 64
 * }
 */
type User = {
  id: Snowflake
  username: string
  discriminator: string
  global_name?: string
  avatar?: string
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  banner?: string
  accent_color?: number
  locale?: string
  verified?: boolean
  email?: string
  public_flags?: number
  avatar_decorations?: string
}

/**
 * https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-access-token-response
 * Example:
 * {
 *   "access_token": "6qrZcUqja7812RVdnEKjpzOL4CvHBFG",
 *   "token_type": "Bearer",
 *   "expires_in": 604800,
 *   "refresh_token": "D43f5y0ahjqew82jZ4NViEr2YafMKhue",
 *   "scope": "identify"
 * }
 */
type Oauth2Token = {
  access_token: string,
  token_type: "Bearer",
  expires_in: number,
  refresh_token: string,
  scope: string
}

type DiscordClient = {
  getAuthorizeUrl: (client_id, scope, state, response_type) => string
  getUserDetails: (accessToken) => AxiosResponse<User>
  // getUserEmails: (accessToken) => AxiosResponse<User>
  getToken: (accessToken) => AxiosResponse<Oauth2Token>
}