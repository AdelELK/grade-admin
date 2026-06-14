# API Gateway HTTP API
resource "aws_apigatewayv2_api" "api" {
  name          = "${var.app_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = var.cors_origins
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization", "X-Amz-Date", "X-Api-Key", "X-Amz-Security-Token"]
    max_age       = 300
  }

  tags = merge(
    {
      Name = "${var.app_name}-api"
    },
    var.tags
  )
}

# API Gateway Integration avec Lambda
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "2.0"

  target = "arn:aws:apigateway:${data.aws_region.current.name}:lambda:path/2015-03-31/functions/${aws_lambda_function.api_handler.arn}/invocations"
}

data "aws_region" "current" {}

# Routes API Gateway
locals {
  api_routes = {
    "GET /assessments"         = "GetAssessments"
    "POST /assessment"         = "CreateAssessment"
    "GET /assessments/{id}"    = "GetAssessment"
    "PUT /assessments/{id}"    = "UpdateAssessment"
    "DELETE /assessments/{id}" = "DeleteAssessment"
    "GET /presigned-url"       = "GetPresignedUrl"
  }
}

resource "aws_apigatewayv2_route" "api_routes" {
  for_each = local.api_routes

  api_id             = aws_apigatewayv2_api.api.id
  route_key          = each.key
  target             = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
  authorization_type = "NONE"
}

# API Gateway Stage
resource "aws_apigatewayv2_stage" "api_stage" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = var.environment
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_logs.arn
    format = jsonencode({
      requestId        = "$context.requestId"
      ip               = "$context.identity.sourceIp"
      requestTime      = "$context.requestTime"
      httpMethod       = "$context.httpMethod"
      resourcePath     = "$context.resourcePath"
      status           = "$context.status"
      protocol         = "$context.protocol"
      responseLength   = "$context.responseLength"
      error            = "$context.error.message"
      integrationError = "$context.integration.error"
    })
  }

  tags = merge(
    {
      Name = "${var.app_name}-${var.environment}"
    },
    var.tags
  )
}

# CloudWatch Log Group pour API Gateway
resource "aws_cloudwatch_log_group" "api_logs" {
  name              = "/aws/apigateway/${var.app_name}-${var.environment}"
  retention_in_days = var.environment == "prod" ? 30 : 7

  tags = merge(
    {
      Name = "${var.app_name}-api-logs"
    },
    var.tags
  )
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "api_errors" {
  alarm_name          = "${var.app_name}-api-errors"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "4XXError"
  namespace           = "AWS/ApiGateway"
  period              = "300"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "Alert when API has 5+ errors in 5 minutes"
  alarm_actions       = [] # À configurer avec SNS topic

  dimensions = {
    ApiName = aws_apigatewayv2_api.api.name
  }
}
