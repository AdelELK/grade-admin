# Lambda Function pour l'API
resource "aws_lambda_function" "api_handler" {
  filename         = "lambda_placeholder.zip"
  function_name    = "${var.app_name}-api"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  source_code_hash = filebase64sha256("lambda_placeholder.zip")
  runtime          = "python3.11"
  timeout          = var.lambda_timeout
  memory_size      = var.lambda_memory

  environment {
    variables = {
      S3_BUCKET = aws_s3_bucket.documents.id
      STAGE     = var.environment
    }
  }

  tags = merge(
    {
      Name = "${var.app_name}-api"
    },
    var.tags
  )
}

# CloudWatch Log Group pour Lambda
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.api_handler.function_name}"
  retention_in_days = var.environment == "prod" ? 30 : 7

  tags = merge(
    {
      Name = "${var.app_name}-lambda-logs"
    },
    var.tags
  )
}

# Dummy ZIP file pour le premier déploiement
# À remplacer par le vrai code source
resource "null_resource" "create_placeholder_zip" {
  provisioner "local-exec" {
    command     = <<EOF
mkdir -p lambda_build
echo 'def handler(event, context):
    return {
        "statusCode": 200,
        "body": "Hello from Document Uploader API"
    }' > lambda_build/index.py
cd lambda_build && zip -r ../lambda_placeholder.zip . && cd ..
EOF
    interpreter = ["bash", "-c"]
  }

  triggers = {
    placeholder = "placeholder"
  }
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
