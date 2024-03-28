locals {
  api_integrations = {
    "open_id_discovery" = {
      path           = "/.well-known/openid-configuration",
      method         = "GET",
      lambda_handler = "open-id-configuration.js"
    },
    "authorize" = {
      path           = "/authorize",
      method         = "GET"
      lambda_handler = "authorize.js"
    },
    "token" = {
      path           = "/token",
      method         = "ANY"
      lambda_handler = "token.js"
    },
    "user_info" = {
      path           = "/userinfo",
      method         = "ANY"
      lambda_handler = "userinfo.js"
    },
    "jwks" = {
      path           = "/.well-known/jwks.json",
      method         = "GET"
      lambda_handler = "jwks.js"
    }
  }
}