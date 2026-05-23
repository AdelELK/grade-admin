output "s3_bucket_name" {
  description = "Nom du bucket S3"
  value       = aws_s3_bucket.documents.id
}

output "s3_bucket_arn" {
  description = "ARN du bucket S3"
  value       = aws_s3_bucket.documents.arn
}

output "s3_bucket_region" {
  description = "Région du bucket S3"
  value       = aws_s3_bucket.documents.region
}

output "lambda_function_name" {
  description = "Nom de la fonction Lambda"
  value       = aws_lambda_function.api_handler.function_name
}

output "lambda_function_arn" {
  description = "ARN de la fonction Lambda"
  value       = aws_lambda_function.api_handler.arn
}

output "lambda_role_arn" {
  description = "ARN du rôle Lambda"
  value       = aws_iam_role.lambda_role.arn
}

output "api_gateway_endpoint" {
  description = "URL de l'API Gateway"
  value       = aws_apigatewayv2_stage.api_stage.invoke_url
}

output "api_gateway_id" {
  description = "ID de l'API Gateway"
  value       = aws_apigatewayv2_api.api.id
}

output "api_gateway_stage" {
  description = "Stage de l'API Gateway"
  value       = aws_apigatewayv2_stage.api_stage.name
}

output "cloudwatch_lambda_logs" {
  description = "CloudWatch Log Group pour Lambda"
  value       = aws_cloudwatch_log_group.lambda_logs.name
}

output "cloudwatch_api_logs" {
  description = "CloudWatch Log Group pour API Gateway"
  value       = aws_cloudwatch_log_group.api_logs.name
}

output "deployment_summary" {
  description = "Résumé du déploiement"
  value = {
    environment     = var.environment
    region          = var.aws_region
    app_name        = var.app_name
    s3_bucket       = aws_s3_bucket.documents.id
    lambda_function = aws_lambda_function.api_handler.function_name
    api_endpoint    = aws_apigatewayv2_stage.api_stage.invoke_url
  }
}
