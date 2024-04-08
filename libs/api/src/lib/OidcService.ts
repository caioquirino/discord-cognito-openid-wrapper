import { Oauth2Connector } from "../types";

export class OidcService {

  public constructor(private readonly oauth2Connector: Oauth2Connector<unknown>) {}

  public async getUserInfo(accessToken: string) {
    return this.oauth2Connector.getUserDetails(accessToken)
  }

  public async getToken(code: string, state: string, host?: string): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  public async authorize(clientId: string, scope: string, state: string, responseType: string): Promise<string> {
    //// `https://discord.com/api/oauth2/authorize?client_id=${clientId}&scope=${scope}&state=${state}&response_type=${responseType}`
    throw new Error("Method not implemented.");
  }
  public async getJwks(): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  public async getOpenIdConfiguration(host?: string) {
    throw new Error("Method not implemented.");
  }

}