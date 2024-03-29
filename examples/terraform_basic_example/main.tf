module "discord_cognito_openid_wrapper" {
  source = "./../../terraform"
  cognito_redirect_uri = "https://<Your API Gateway DNS name>/${local.stage_name}/authorize"
  discord_client_id = "AAAA"
  discord_client_secret = "BBBB"
  stage_name = local.stage_name
}