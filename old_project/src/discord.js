/* eslint-disable no-console */
const axios = require('axios');
const btoa = require('btoa');
const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  COGNITO_REDIRECT_URI,
  DISCORD_API_URL,
  // DISCORD_LOGIN_URL
} = require('./config');
const logger = require('./connectors/logger');

const getApiEndpoints = (apiBaseUrl = DISCORD_API_URL) => ({
  userDetails: `${apiBaseUrl}/users/@me`,
  oauthToken: `${apiBaseUrl}/oauth2/token`,
  oauthAuthorize: `${apiBaseUrl}/oauth2/authorize`,
});

const check = (response) => {
  logger.debug('Checking response: %j', response, {});
  if (response.data) {
    if (response.data.error) {
      throw new Error(
        `Discord API responded with a failure: ${response.data.error}, ${response.data.error_description}`
      );
    } else if (response.status === 200) {
      return response.data;
    }
  }
  throw new Error(
    `Discord API responded with a failure: ${response.status} (${response.statusText})`
  );
};

const discordGet = (url, accessToken) =>
  axios({
    method: 'GET',
    url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

/**
 *
 * @param apiBaseUrl
 * @param loginBaseUrl
 * @returns {import("./types").DiscordClient}
 */
module.exports = (apiBaseUrl, loginBaseUrl) => {
  const urls = getApiEndpoints(apiBaseUrl, loginBaseUrl || apiBaseUrl);
  return {
    getAuthorizeUrl: (client_id, scope, state, response_type) =>
      `${urls.oauthAuthorize}?client_id=${client_id}&scope=${encodeURIComponent(
        scope
      )}&state=${state}&response_type=${response_type}`,
    getUserDetails: (accessToken) =>
      discordGet(urls.userDetails, accessToken).then(check),
    getToken: (code, state) => {
      const data = {
        // OAuth required fields
        grant_type: 'authorization_code',
        redirect_uri: COGNITO_REDIRECT_URI,
        client_id: DISCORD_CLIENT_ID,
        // GitHub Specific
        response_type: 'code',
        client_secret: DISCORD_CLIENT_SECRET,
        code,
        // State may not be present, so we conditionally include it
        ...(state && { state }),
      };

      logger.debug(
        'Getting token from %s with data: %j',
        urls.oauthToken,
        data,
        {}
      );
      return axios({
        method: 'post',
        url: urls.oauthToken,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(
            `${DISCORD_CLIENT_ID}:${DISCORD_CLIENT_SECRET}`
          )}`,
        },
        data,
      }).then(check);
    },
  };
};
