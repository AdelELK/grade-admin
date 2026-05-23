# Async Workers - Architecture Future

## Vue d'Ensemble

L'application supportera des traitements asynchrones pour les opérations longues ou lourdes.

## Architecture

```
Frontend (React)
    ↓
API Gateway (HTTP)
    ↓
Lambda Handler (API)
    ├─ Sync: CRUD Collections/Documents
    └─ Async: Envoyer vers SQS
    ↓
SQS Queue (document-uploader-tasks)
    ↓
Lambda Workers (Python)
    ├─ ImageProcessor    (Resize, Compress)
    ├─ DocumentProcessor (OCR, Extract Text)
    ├─ NotificationWorker (Email, Webhook)
    └─ ReportGenerator   (PDF, CSV)
    ↓
Storage (S3, DynamoDB, SNS)
```

## Cas d'Usage

### 1. Compression d'Images
```
POST /collections/{id}/documents
    ├─ Upload fichier (< 5MB)
    ├─ Créer Document record
    └─ Envoyer message SQS
        └─ ImageProcessor:
            ├─ Télécharger depuis S3
            ├─ Redimensionner (max 1920x1080)
            ├─ Compresser (80% qualité)
            ├─ Générer thumbnail
            └─ Sauvegarder optimisé
```

### 2. Extraction de Texte (OCR)
```
Upload PDF scannée
    └─ DocumentProcessor:
        ├─ Télécharger depuis S3
        ├─ Convertir en images (ImageMagick)
        ├─ Appliquer OCR (Tesseract)
        ├─ Stocker texte extrait
        └─ Sauvegarder metadata
```

### 3. Notifications
```
Action utilisateur
    └─ NotificationWorker:
        ├─ Envoyer email de confirmation
        ├─ Créer notification push
        └─ Webhook vers système externe
```

## Implémentation Terraform

### 1. SQS Queue

```hcl
resource "aws_sqs_queue" "tasks" {
  name                      = "${var.app_name}-tasks"
  visibility_timeout_seconds = 300
  message_retention_seconds  = 86400  # 1 day
  
  tags = local.common_tags
}

resource "aws_sqs_queue_policy" "tasks" {
  queue_url = aws_sqs_queue.tasks.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      Action   = "sqs:SendMessage"
      Resource = aws_sqs_queue.tasks.arn
    }]
  })
}
```

### 2. Lambda Workers

```hcl
resource "aws_lambda_function" "image_processor" {
  filename      = "lambda_image_processor.zip"
  function_name = "${var.app_name}-image-processor"
  role          = aws_iam_role.lambda_worker_role.arn
  handler       = "index.handler"
  runtime       = "python3.11"
  timeout       = 300  # 5 min
  memory_size   = 1024 # 1 GB
  
  environment {
    variables = {
      S3_BUCKET = aws_s3_bucket.documents.id
    }
  }
}

resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = aws_sqs_queue.tasks.arn
  function_name    = aws_lambda_function.image_processor.function_name
  batch_size       = 10
}
```

### 3. Dead Letter Queue

```hcl
resource "aws_sqs_queue" "dlq" {
  name                      = "${var.app_name}-dlq"
  message_retention_seconds = 1209600  # 14 days
}

resource "aws_sqs_queue_redrive_policy" "tasks" {
  queue_url = aws_sqs_queue.tasks.id
  
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = 3
  })
}
```

## Code Lambda Worker - Image Processor

```python
import json
import boto3
import logging
from typing import Dict, Any
from PIL import Image
import io

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3_client = boto3.client('s3')

def handler(event, context):
    """
    Traite les messages SQS pour optimiser les images
    """
    
    try:
        for record in event['Records']:
            message = json.loads(record['body'])
            
            if message['task_type'] == 'process_image':
                process_image(message)
            
            # Supprimer le message de la queue après succès
            sqs_client.delete_message(
                QueueUrl=record['eventSourceARN'],
                ReceiptHandle=record['receiptHandle']
            )
        
        return {
            'statusCode': 200,
            'body': json.dumps('Traitement complété')
        }
    
    except Exception as e:
        logger.error(f"Erreur: {str(e)}")
        # Le message sera automatiquement renvoyé à la DLQ après 3 tentatives
        raise


def process_image(message: Dict[str, Any]) -> None:
    """
    Compresse et optimise une image
    """
    
    bucket = message['bucket']
    key = message['key']
    
    logger.info(f"Traitement image: {key}")
    
    # Télécharger
    obj = s3_client.get_object(Bucket=bucket, Key=key)
    image_data = obj['Body'].read()
    
    # Ouvrir et redimensionner
    image = Image.open(io.BytesIO(image_data))
    
    # Redimensionner si nécessaire
    if image.width > 1920 or image.height > 1080:
        image.thumbnail((1920, 1080), Image.LANCZOS)
    
    # Compresser
    output = io.BytesIO()
    image.save(output, format='JPEG', quality=80, optimize=True)
    output.seek(0)
    
    # Uploader optimisé
    optimized_key = f"optimized/{key}"
    s3_client.put_object(
        Bucket=bucket,
        Key=optimized_key,
        Body=output.read(),
        ContentType='image/jpeg'
    )
    
    # Générer thumbnail
    thumbnail = image.copy()
    thumbnail.thumbnail((200, 200))
    
    thumb_output = io.BytesIO()
    thumbnail.save(thumb_output, format='JPEG', quality=80)
    thumb_output.seek(0)
    
    thumb_key = f"thumbnails/{key}"
    s3_client.put_object(
        Bucket=bucket,
        Key=thumb_key,
        Body=thumb_output.read(),
        ContentType='image/jpeg'
    )
    
    logger.info(f"Image traitée: {optimized_key}")
```

## Message SQS Format

```json
{
  "task_type": "process_image",
  "bucket": "document-uploader-documents-123456-eu-west-1",
  "key": "documents/col-123/doc-456.jpg",
  "collection_id": "col-123",
  "document_id": "doc-456",
  "user_id": "user-789",
  "metadata": {
    "size": 2097152,
    "format": "jpg",
    "uploaded_at": "2026-05-23T10:00:00Z"
  }
}
```

## Monitoring

### CloudWatch Metrics

```python
cloudwatch = boto3.client('cloudwatch')

cloudwatch.put_metric_data(
    Namespace='DocumentUploader',
    MetricData=[
        {
            'MetricName': 'ImagesProcessed',
            'Value': 1,
            'Unit': 'Count'
        },
        {
            'MetricName': 'ProcessingTime',
            'Value': 2.5,
            'Unit': 'Seconds'
        }
    ]
)
```

### Alarms

```hcl
resource "aws_cloudwatch_metric_alarm" "dlq_alarm" {
  alarm_name          = "${var.app_name}-dlq-messages"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = "300"
  statistic           = "Average"
  threshold           = "1"
  alarm_description   = "Alert when messages in DLQ"
  
  dimensions = {
    QueueName = aws_sqs_queue.dlq.name
  }
}
```

## Dépendances Python

```txt
boto3==1.28.0
Pillow==10.0.0
pytesseract==0.3.10
python-json-logger==2.0.7
aws-lambda-powertools==2.20.0
```

## Prochaines Étapes

1. [ ] Implémenter ImageProcessor Lambda
2. [ ] Implémenter DocumentProcessor (OCR) Lambda
3. [ ] Implémenter NotificationWorker Lambda
4. [ ] Ajouter DLQ monitoring
5. [ ] Setup CloudWatch alarms
6. [ ] Tester avec messages de test
7. [ ] Ajouter retries et exponential backoff
8. [ ] Implémenter ReportGenerator

## Coûts Estimés (par mois)

- SQS: ~$0.01 (1M requêtes)
- Lambda Execution: ~$2.00 (10M invocations, 5min chacune)
- **Total additionnel**: ~$2.01/mois
