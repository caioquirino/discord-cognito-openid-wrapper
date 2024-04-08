/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Api, DiscordOauth2Connector, OidcService } from '@oidc-proxy-oauth2/api';
import express from 'express';

(async () => {
  const app = express();

  const connector = new DiscordOauth2Connector()
  const oidcProxyOauth2Api = new Api(app, new OidcService(connector))
  await oidcProxyOauth2Api.buildApi()

  const port = process.env.PORT || 3333;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });
  server.on('error', console.error);

})()

