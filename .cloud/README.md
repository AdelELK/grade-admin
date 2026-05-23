# Cloud Infrastructure avec Terraform

Configuration infrastructure AWS pour l'application Document Uploader.

## Structure

```
.cloud/
├── 30_application/          # Infrastructure application
│   ├── variables.tf         # Variables Terraform
│   ├── main.tf             # Ressources principales
│   ├── s3.tf               # Configuration S3
│   ├── lambda.tf           # Configuration Lambda
│   ├── api_gateway.tf      # Configuration API Gateway
│   ├── iam.tf              # Rôles et permissions
│   └── outputs.tf          # Sorties Terraform
│
└── 90_dns/                 # Configuration DNS (futur)
    ├── variables.tf
    ├── main.tf
    └── outputs.tf
```

## Composants AWS

### S3 Bucket
- **Nom**: `document-uploader-files`
- **Région**: `eu-west-1`
- **Versioning**: Activé
- **Lifecycle**: Archive après 30 jours

### Lambda Functions
1. **API Handler** (Python)
   - Déclenchement: API Gateway HTTP
   - Runtime: Python 3.11
   - Gestion: CRUD collections et documents
   - Timeout: 30s
   - Memory: 512 MB

2. **Async Workers** (Futur)
   - Event: S3 put/delete
   - Traitement asynchrone
   - File d'attente: SQS

### API Gateway
- Type: HTTP API (v2)
- Routes:
  - `GET /collections`
  - `POST /collections`
  - `GET /collections/{id}`
  - `PUT /collections/{id}`
  - `DELETE /collections/{id}`
  - `POST /collections/{id}/documents`
  - `DELETE /documents/{id}`

### IAM
- Role Lambda: Accès S3, CloudWatch Logs
- Permissions: ListBucket, GetObject, PutObject, DeleteObject
- CORS: Frontend uniquement

## Déploiement

### Prérequis
```bash
# Installation Terraform
brew install terraform  # macOS
choco install terraform # Windows
```

### Variables
```bash
# Créer terraform.tfvars
aws_region      = "eu-west-1"
environment      = "dev"
app_name         = "document-uploader"
```

### Déployer
```bash
cd .cloud/30_application
terraform init
terraform plan
terraform apply
```

### Détruire
```bash
terraform destroy
```

## Monitoring

### CloudWatch
- Logs Lambda: `/aws/lambda/document-uploader-api`
- Métriques: Invocations, Erreurs, Durée
- Alertes: Erreurs > 5/min

## Sécurité

- ✅ Chiffrement S3 (AES-256)
- ✅ CORS restrictif
- ✅ API Key pour protection (futur)
- ✅ VPC Endpoint (optionnel)
- ✅ Versioning S3 activé

## Coûts Estimés (par mois)

- S3: ~$0.50 (1 GB)
- Lambda: ~$0.20 (1M invocations)
- API Gateway: ~$3.50
- **Total**: ~$4.20/mois

## Prochaines Étapes

1. [ ] Créer S3 bucket avec Terraform
2. [ ] Configurer Lambda API handler
3. [ ] Configurer API Gateway
4. [ ] Tester intégration
5. [ ] Ajouter async workers
6. [ ] Configurer DNS (Route53)
7. [ ] Setup CI/CD (GitHub Actions)
