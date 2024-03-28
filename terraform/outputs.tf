output "discord_shim_issuer" {
  value = aws_apigatewayv2_stage.default_stage.invoke_url
}