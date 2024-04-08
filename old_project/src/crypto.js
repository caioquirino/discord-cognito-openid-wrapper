const JSONWebKey = require('json-web-key');
const jwt = require('jsonwebtoken');
const { DISCORD_CLIENT_ID } = require('./config');
const logger = require('./connectors/logger');

const KEY_ID = 'jwtRS256';

let privateKey;
let publicKey;

try {
  // eslint-disable-next-line global-require, import/no-unresolved
  privateKey = require('../jwtRS256.key');
  // eslint-disable-next-line global-require, import/no-unresolved
  publicKey = require('../jwtRS256.key.pub');
} catch (error) {
  privateKey = process.env.JWT_PRIVATE_KEY;
  publicKey = process.env.JWT_PUBLIC_KEY;
}

module.exports = {
  getPublicKey: () => ({
    alg: 'RS256',
    kid: KEY_ID,
    ...JSONWebKey.fromPEM(publicKey).toJSON(),
  }),

  makeIdToken: (payload, host) => {
    const enrichedPayload = {
      ...payload,
      iss: `https://${host}`,
      aud: DISCORD_CLIENT_ID,
    };
    logger.debug('Signing payload %j', enrichedPayload, {});
    return jwt.sign(enrichedPayload, privateKey, {
      expiresIn: '1h',
      algorithm: 'RS256',
      keyid: KEY_ID,
    });
  },
};
