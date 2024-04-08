import type { Oauth2Connector } from "../types"
export type Discord = {}

export class DiscordOauth2Connector implements Oauth2Connector<Discord> {
  constructor() {}

  async getUserDetails(accessToken: string): Promise<Discord> {
    return {}
  }


}