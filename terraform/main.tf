# API Gateway V2 HTTP API
resource "aws_apigatewayv2_api" "github_oauth_http_api" {
  name          = "discord_cognito_openid_wrapper"
  protocol_type = "HTTP"
  description   = "Discord Cognito OpenID Wrapper (SSO) using HTTP API"
}

data "archive_file" "lambda_file" {
  for_each = tomap(local.api_integrations)
  type = "zip"
  source {
    content  = file("${path.module}/../dist-lambda/${each.value.lambda_handler}.js")
    filename = "index.js"
  }
  output_file_mode = "0666"
  output_path      = "${path.module}/../dist-lambda/${each.value.lambda_handler}.js"
}

resource "aws_lambda_function" "lambda" {
  for_each = tomap(local.api_integrations)

  function_name    = each.key
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  filename         = data.archive_file.lambda_file[each.key].output_path
  source_code_hash = data.archive_file.lambda_file[each.key].output_base64sha256
  role             = aws_iam_role.lambda_iam_role.id

  environment {
    variables = {
      discord_client_id     = var.discord_client_id
      discord_client_secret = var.discord_client_secret
      cognito_redirect_uri  = var.cognito_redirect_uri
      discord_api_url       = var.discord_url
      discord_login_url     = var.discord_login_url
    }
  }
}

# Lambda permissions to allow HTTP API to invoke them
resource "aws_lambda_permission" "lambda_permission" {
  for_each = toset(keys(tomap(local.api_integrations)))

  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda[each.key].function_name
  principal     = "apigateway.amazonaws.com"
  # This source_arn restricts invocation to the specific HTTP API. Adjust the stage_name as necessary.
  source_arn = "${aws_apigatewayv2_api.github_oauth_http_api.execution_arn}/*/*"
}

# Integration between HTTP API and Lambda
resource "aws_apigatewayv2_integration" "lambda_integration" {
  for_each = toset(keys(tomap(local.api_integrations)))

  api_id           = aws_apigatewayv2_api.github_oauth_http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.lambda[each.value].invoke_arn
  description      = "${each.value} lambda integration"
}

# Define routes for each Lambda function
resource "aws_apigatewayv2_route" "route" {
  for_each = local.api_integrations

  api_id    = aws_apigatewayv2_api.github_oauth_http_api.id
  route_key = "${each.value.method} ${each.value.path}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration[each.key].id}"
}

# Deploy the HTTP API
resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.github_oauth_http_api.id
  name        = var.stage_name
  auto_deploy = true
}

resource "aws_iam_role" "lambda_iam_role" {
  name = "discord_cognito_openid_wrapper"

  assume_role_policy = data.aws_iam_policy_document.lambda_iam_assume_role_policy.json
}

data "aws_iam_policy_document" "lambda_iam_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy" "lambda_iam_policy" {
  name   = "discord_cognito_openid_wrapper"
  role   = aws_iam_role.lambda_iam_role.id
  policy = data.aws_iam_policy_document.lambda_iam_policy_document.json
}

data "aws_iam_policy_document" "lambda_iam_policy_document" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    effect    = "Allow"
    resources = ["arn:aws:logs:*:*:*"]
  }
}
