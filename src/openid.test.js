const openid = require('./openid');
const discord = require('./discord');
const crypto = require('./crypto');

// FIXME: (caio) this is very likely to fail

jest.mock('./discord');
jest.mock('./crypto');

const MOCK_TOKEN = 'MOCK_TOKEN';
const MOCK_CODE = 'MOCK_CODE';

describe('openid domain layer', () => {

  /**
   * @type {import("./test_types").JestMocked<import("./types").DiscordClient>}
   */
  const discordMock = {
    getUserEmails: jest.fn(),
    getUserDetails: jest.fn(),
    getToken: jest.fn(),
    getAuthorizeUrl: jest.fn(),
  };

  beforeEach(() => {
    discord.mockImplementation(() => discordMock);
  });

  describe('userinfo function', () => {
    const mockEmails = () => {
      discordMock.getUserEmails.mockImplementation(() =>
        Promise.resolve(
        {
          email: 'email@example.com',
          verified: true,
        })
      );
    };

    describe('with a good token', () => {
      describe('with complete user details', () => {
        beforeEach(() => {
          discordMock.getUserDetails.mockImplementation(() =>
            Promise.resolve({
              "id": "80351110224678912",
              "username": "Nelly",
              "discriminator": "1337",
              "avatar": "8342729096ea3675442027381ff50dfe",
              "verified": true,
              "email": "nelly@discord.com",
              "flags": 64,
              "banner": "06c16474723fe537c283b8efa61a30c8",
              "accent_color": 16711680,
              "premium_type": 1,
              "public_flags": 64
            })
          );
        });
        describe('with an email', () => {
          beforeEach(() => {
            mockEmails();
          });
          it('Returns the aggregated complete object', async () => {
            const response = await openid.getUserInfo(MOCK_TOKEN);
            expect(response).toEqual({
              "email": "nelly@discord.com",
              "email_verified": true,
              "name": "Nelly#1337",
              "picture": "https://cdn.discordapp.com/avatars/80351110224678912/8342729096ea3675442027381ff50dfe.png",
              "preferred_username": "Nelly",
              "profile": "https://discordapp.com",
              "sub": "80351110224678912",
              "website": "https://discordapp.com"
            });
          });
        });
      });
    });
    describe('with a bad token', () => {
      beforeEach(() => {
        discordMock.getUserDetails.mockImplementation(() =>
          Promise.reject(new Error('Bad token'))
        );
        discordMock.getUserEmails.mockImplementation(() =>
          Promise.reject(new Error('Bad token'))
        );
      });
      it('fails', () =>
        expect(openid.getUserInfo('bad token')).rejects.toThrow(
          new Error('Bad token')
        ));
    });
  });
  describe('token function', () => {
    describe('with the correct code', () => {
      beforeEach(() => {
        discordMock.getToken.mockImplementation(() =>
          Promise.resolve({
            access_token: 'SOME_TOKEN',
            token_type: 'bearer',
            scope: 'scope1,scope2',
          })
        );
        crypto.makeIdToken.mockImplementation(() => 'ENCODED TOKEN');
      });

      it('returns a token', async () => {
        const token = await openid.getTokens(
          MOCK_CODE,
          'some state',
          'somehost.com'
        );
        expect(token).toEqual({
          access_token: 'SOME_TOKEN',
          id_token: 'ENCODED TOKEN',
          scope: 'openid scope1 scope2',
          token_type: 'bearer',
        });
      });
    });
    describe('with a bad code', () => {
      beforeEach(() => {
        discordMock.getToken.mockImplementation(() =>
          Promise.reject(new Error('Bad code'))
        );
      });
      it('fails', () =>
        expect(openid.getUserInfo('bad token', 'two', 'three')).rejects.toThrow(
          new Error('Bad token')
        ));
    });
  });
  describe('jwks', () => {
    it('Returns the right structure', () => {
      const mockKey = { key: 'mock' };
      crypto.getPublicKey.mockImplementation(() => mockKey);
      expect(openid.getJwks()).toEqual({ keys: [mockKey] });
    });
  });
  describe('authorization', () => {
    beforeEach(() => {
      discordMock.getAuthorizeUrl.mockImplementation(
        (client_id, scope, state, response_type) =>
          `https://not-a-real-host.com/authorize?client_id=${client_id}&scope=${scope}&state=${state}&response_type=${response_type}`
      );
    });
    it('Redirects to the authorization URL', () => {
      expect(
        openid.getAuthorizeUrl('client_id', 'scope', 'state', 'response_type')
      ).toEqual(
        'https://not-a-real-host.com/authorize?client_id=client_id&scope=scope&state=state&response_type=response_type'
      );
    });
  });
  describe('openid-configuration', () => {
    describe('with a supplied hostname', () => {
      it('returns the correct response', () => {
        expect(openid.getConfigFor('not-a-real-host.com')).toEqual({
          authorization_endpoint: 'https://not-a-real-host.com/authorize',
          claims_supported: [
            'sub',
            'name',
            'preferred_username',
            'profile',
            'picture',
            'website',
            'email',
            'email_verified',
            'updated_at',
            'iss',
            'aud',
          ],
          display_values_supported: ['page', 'popup'],
          id_token_signing_alg_values_supported: ['RS256'],
          issuer: 'https://not-a-real-host.com',
          jwks_uri: 'https://not-a-real-host.com/.well-known/jwks.json',
          request_object_signing_alg_values_supported: ['none'],
          response_types_supported: [
            'code',
            'code id_token',
            'id_token',
            'token id_token',
          ],
          scopes_supported: ['openid', 'read:user', 'user:email'],
          subject_types_supported: ['public'],
          token_endpoint: 'https://not-a-real-host.com/token',
          token_endpoint_auth_methods_supported: [
            'client_secret_basic',
            'private_key_jwt',
          ],
          token_endpoint_auth_signing_alg_values_supported: ['RS256'],
          userinfo_endpoint: 'https://not-a-real-host.com/userinfo',
          userinfo_signing_alg_values_supported: ['none'],
        });
      });
    });
  });
});
