import { Request } from "express"

export const getBearerToken = (request: Request): string => {
  const authHeader = request.get('Authorization');
      if (authHeader) {
        // Section 2.1 Authorization request header
        // Should be of the form 'Bearer <token>'
        // We can ignore the 'Bearer ' bit
        return authHeader.split(' ')[1]
      } else if (request.query["access_token"]) {
        // Section 2.3 URI query parameter
        return request.query["access_token"] as string;
      } else if (request.get('Content-Type') === 'application/x-www-form-urlencoded') {
        // Section 2.2 form encoded body parameter
        return request.body.access_token
      }
      throw new Error('No token specified in request');
}