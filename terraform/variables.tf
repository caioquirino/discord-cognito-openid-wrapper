variable "discord_client_id" {
  type      = string
  sensitive = true
}
variable "discord_client_secret" {
  type      = string
  sensitive = true
}
variable "cognito_redirect_uri" {
  type = string
}
variable "discord_url" {
  type    = string
  default = "https://discordapp.com/api"
}
variable "discord_login_url" {
  type    = string
  default = "https://discordapp.com/api"
}


variable "jwt_private_key" {
  type        = string
  sensitive   = true
  description = "JWT Private Key file. Use the script https://github.com/caioquirino/discord-cognito-openid-wrapper/blob/main/scripts/create-key.sh to generate one."
}
variable "jwt_public_key" {
  type        = string
  sensitive   = true
  description = "Use the script https://github.com/caioquirino/discord-cognito-openid-wrapper/blob/main/scripts/create-key.sh to generate one."
}

variable "stage_name" {
  type = string
}

variable "override_artifact_tag" {
  type = string
  default = null
}

variable "use_local_artifacts" {
  type = bool
  default = false
}