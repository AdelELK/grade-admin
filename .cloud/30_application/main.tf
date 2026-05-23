terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Décommenter pour utiliser un backend S3
  # backend "s3" {
  #   bucket         = "terraform-state-document-uploader"
  #   key            = "app/terraform.tfstate"
  #   region         = "eu-west-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-locks"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.app_name
      ManagedBy   = "Terraform"
      CreatedAt   = timestamp()
    }
  }
}

# Data source pour le compte AWS courant
data "aws_caller_identity" "current" {}

data "aws_region" "current" {}
