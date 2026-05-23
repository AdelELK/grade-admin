variable "aws_region" {
  description = "Région AWS"
  type        = string
  default     = "eu-west-1"
}

variable "environment" {
  description = "Environnement (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment doit être dev, staging ou prod."
  }
}

variable "app_name" {
  description = "Nom de l'application"
  type        = string
  default     = "document-uploader"
}

variable "s3_bucket_name" {
  description = "Nom du bucket S3"
  type        = string
  default     = ""
}

variable "lambda_timeout" {
  description = "Timeout Lambda en secondes"
  type        = number
  default     = 30

  validation {
    condition     = var.lambda_timeout > 0 && var.lambda_timeout <= 900
    error_message = "Timeout doit être entre 1 et 900 secondes."
  }
}

variable "lambda_memory" {
  description = "Mémoire Lambda en MB"
  type        = number
  default     = 512

  validation {
    condition     = contains([128, 256, 512, 1024, 1536, 3008], var.lambda_memory)
    error_message = "Mémoire invalide. Valeurs: 128, 256, 512, 1024, 1536, 3008."
  }
}

variable "cors_origins" {
  description = "Origins autorisés pour CORS"
  type        = list(string)
  default     = ["http://localhost:5173", "http://localhost:3000"]
}

variable "tags" {
  description = "Tags additionnels"
  type        = map(string)
  default     = {}
}
