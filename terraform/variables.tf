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
variable "stage_name" {
  type = string
}