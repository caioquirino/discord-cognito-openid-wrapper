import { Express, Request, Response } from "express";
import { OidcService } from "./OidcService";
import { getBearerToken } from "./api.util";

export class Api {
  constructor(private readonly app: Express, private readonly oidcService: OidcService) {

  }

  public async buildApi(): Promise<void> {
    this.app.get('/userinfo', this.getUserinfo);
    this.app.post('/userinfo', this.postUserinfo);
    this.app.get('/token', this.getToken);
    this.app.post('/token', this.postToken);
    this.app.get('/authorize', this.getAuthorize);
    this.app.post('/authorize', this.postAuthorize);
    this.app.get('/jwks.json', this.getJwks);
    this.app.get('/.well-known/jwks.json', this.getJwks);
    this.app.get('/.well-known/openid-configuration', this.getOpenIdConfiguration);
  }

  private async getUserinfo(request: Request, response: Response) {
    const accessToken = getBearerToken(request)
    return response.send(await this.oidcService.getUserInfo(accessToken))
  }

  private async postUserinfo(request: Request, response: Response) {
    return this.getUserinfo(request, response)
  }

  private async getToken(request: Request, response: Response) {
    const code = request.body.code || request.query["code"];
    const state = request.body.state || request.query["state"];
    const host = request.get('host');
    return response.send(this.oidcService.getToken(code, state, host))
  }

  private async postToken(request: Request, response: Response) {
    return this.getToken(request, response)
  }

  private async getAuthorize(request: Request, response: Response) {
    const clientId = request.query["client_id"]
    const scope = request.query["scope"]
    const state = request.query["state"]
    const responseType = request.query["response_type"]
    return response.redirect(await this.oidcService.authorize(clientId, scope, state, responseType));
  }

  private async postAuthorize(request: Request, response: Response) {
    return this.getAuthorize(request, response)
  }

  private async getJwks(request: Request, response: Response) {
    return response.send(this.oidcService.getJwks())
  }

  private async getOpenIdConfiguration(request: Request, response: Response) {
    const host = request.get('host');
    return response.send(this.oidcService.getOpenIdConfiguration(host))
  }

}