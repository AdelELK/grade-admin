# Architecture Complète - Document Uploader

## Vue d'Ensemble Système

```
┌─────────────────────────────────────────────────────────────────┐
│                     Document Uploader                            │
│              Frontend + Backend + Infrastructure                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Frontend (React 18 + TypeScript)                               │
│  ├─ Collections Management                                      │
│  ├─ File Upload (Drag & Drop)                                  │
│  └─ UI (Tailwind CSS)                                          │
│  Port: 5173                                                     │
└──────────────────┬──────────────────────────────────────────────┘
                   │ HTTP/HTTPS
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  API Gateway (HTTP API v2)                                      │
│  ├─ CORS: Frontend origins                                     │
│  ├─ Routes:                                                     │
│  │  ├─ GET    /collections                                    │
│  │  ├─ POST   /collections                                    │
│  │  ├─ GET    /collections/{id}                               │
│  │  ├─ PUT    /collections/{id}                               │
│  │  ├─ DELETE /collections/{id}                               │
│  │  ├─ POST   /collections/{id}/documents                    │
│  │  └─ DELETE /documents/{id}                                │
│  └─ Logging: CloudWatch                                        │
└──────────────────┬──────────────────────────────────────────────┘
                   │ AWS Proxy
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  Lambda Handler (Python 3.11)                                   │
│  ├─ Collections CRUD                                           │
│  ├─ Documents CRUD                                             │
│  └─ Queue async tasks                                          │
│  Timeout: 30s | Memory: 512MB                                  │
└──────────┬──────────────────┬──────────────────┬────────────────┘
           │                  │                  │
           │                  │                  │
     ┌─────▼─────┐      ┌─────▼─────┐     ┌────▼─────┐
     │     S3    │      │  DynamoDB │     │    SQS   │
     │  (Files)  │      │  (Metadata)     │ (Queue)  │
     └───────────┘      └───────────┘     └────┬─────┘
                                                │
                                           ┌────▼──────────────┐
                                           │ Lambda Workers    │
                                           ├─ ImageProcessor  │
                                           ├─ OCRProcessor    │
                                           ├─ NotificationWorker
                                           └─ ReportGenerator │
                                           └───────────────────┘
```

## Stack Complet

### Frontend (Dossier: `/src`)
- React 18.2.0
- TypeScript 5.2.2
- Vite 4.5.0
- Tailwind CSS 3.3.6
- Zustand 4.4.1
- Lucide React 0.303.0

### Backend (Dossier: `/.cloud`)
- Python 3.11
- AWS Lambda
- AWS API Gateway
- AWS S3
- AWS DynamoDB (futur)
- AWS SQS (futur)

### Infrastructure (Dossier: `/.cloud`)
- Terraform 1.0+
- AWS Provider 5.0+

### Monitoring
- CloudWatch Logs
- CloudWatch Metrics
- CloudWatch Alarms

## Phases de Développement

### Phase 1: Frontend (✅ Complétée)
- [x] React components
- [x] State management (Zustand)
- [x] Collection CRUD (local)
- [x] Document upload (local)
- [x] UI/UX (Tailwind)
- [x] Documentation

### Phase 2: Infrastructure & API Backend (🚀 En cours)
- [x] Terraform structure
- [x] S3 bucket configuration
- [x] Lambda IAM roles
- [x] API Gateway setup
- [ ] DynamoDB tables
- [ ] Lambda handlers (Collections/Documents)
- [ ] Testing & validation

### Phase 3: Backend Implementation (⏳ À faire)
- [ ] Implement Collections handlers
- [ ] Implement Documents handlers
- [ ] DynamoDB integration
- [ ] Error handling & validation
- [ ] Testing & deployment

### Phase 4: Async Processing (⏳ À faire)
- [ ] SQS queue setup
- [ ] ImageProcessor Lambda
- [ ] OCRProcessor Lambda (Tesseract)
- [ ] NotificationWorker Lambda
- [ ] DLQ monitoring

### Phase 5: Frontend Integration (⏳ À faire)
- [ ] Connect to API Gateway
- [ ] Implement API calls
- [ ] Handle async responses
- [ ] Add loading states
- [ ] Error handling

### Phase 6: DevOps & Deployment (⏳ À faire)
- [ ] GitHub Actions CI/CD
- [ ] Terraform automation
- [ ] Environment management (dev/staging/prod)
- [ ] Monitoring & alerting
- [ ] Route53 DNS

## Coûts AWS Estimés (par mois)

| Service | Estimation | Condition |
|---------|-----------|-----------|
| S3 | $0.50 | 1 GB de stockage |
| Lambda | $0.20 | 1M d'invocations, 30s avg |
| API Gateway | $3.50 | 3.5M de requêtes |
| DynamoDB | $1.25 | Provisioned mode minimal |
| SQS | $0.01 | 1M de messages |
| CloudWatch | $0.50 | Logs + metrics |
| **TOTAL** | **~$6.00** | Estimation conservatrice |

## Fichiers Clés

### Frontend
```
src/
├── components/
│   ├── App.tsx
│   ├── CollectionList.tsx
│   ├── FileUploader.tsx
│   └── DocumentList.tsx
├── store.ts
├── main.tsx
└── index.css
```

### Infrastructure
```
.cloud/
├── 30_application/
│   ├── variables.tf
│   ├── main.tf
│   ├── s3.tf
│   ├── lambda.tf
│   ├── api_gateway.tf
│   ├── iam.tf
│   ├── outputs.tf
│   └── terraform.tfvars.example
├── 90_dns/
│   └── (futur)
├── README.md
├── LAMBDA_GUIDE.md
├── ASYNC_WORKERS.md
└── Makefile
```

### Documentation
```
├── README.md
├── GETTING_STARTED.md
├── ARCHITECTURE.md
├── QUICK_REFERENCE.md
├── PROJECT_SUMMARY.md
├── USE_CASES.md
├── UI_DESIGN.md
└── CHECKLIST.md
```

## Diagramme de Flux Utilisateur

```
┌─────────────────────────────────────────────────────────────────┐
│                     Utilisateur                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    Créer collection
                         │
            ┌────────────▼────────────┐
            │  API: POST /collections │
            │  Payload: {name, desc}  │
            └────────────┬────────────┘
                         │
            ┌────────────▼────────────┐
            │ Lambda: Validate Input  │
            │ Store: DynamoDB         │
            └────────────┬────────────┘
                         │
                    ✅ Collection créée
                         │
                    Uploader fichiers
                         │
            ┌────────────▼────────────────┐
            │ API: POST /collections/{id} │
            │/documents                    │
            │ Payload: file (base64)       │
            └────────────┬────────────────┘
                         │
            ┌────────────▼──────────────────┐
            │ Lambda: Validate File         │
            │ Upload to S3                  │
            │ Store metadata: DynamoDB      │
            │ Queue async task: SQS         │
            └────────────┬──────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ✅ File        🚀 Background        📊 Metadata
    uploaded      Processing          Stored
                   (Image compress)
                   (OCR if PDF)
```

## Checklist de Déploiement

### Prérequis
- [ ] AWS Account configuré
- [ ] AWS CLI configuré
- [ ] Terraform installé
- [ ] Python 3.11 installé
- [ ] Node.js 18+ installé

### Déploiement Infrastructure
```bash
cd .cloud/30_application
terraform init
terraform plan
terraform apply
# Copier les outputs (API endpoint, S3 bucket, etc.)
```

### Configuration Frontend
```bash
# Mettre à jour .env ou config.ts avec API endpoint
VITE_API_URL=https://xxx.lambda-url.eu-west-1.on.aws

npm run build
# Déployer sur S3 + CloudFront (futur)
```

### Déploiement Backend Lambda
```bash
# Préparer le code Python
pip install -r requirements.txt -t lambda_package/
cp src/ lambda_package/
cd lambda_package && zip -r lambda.zip . && cd ..

# Uploader (Terraform gère l'upload)
terraform apply
```

## Liens Utiles

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [React Documentation](https://react.dev)
- [AWS API Gateway](https://docs.aws.amazon.com/apigateway/)
- [S3 Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/BestPractices.html)

## Support & Contribution

Pour toute question ou pour contribuer:
1. Consulter la documentation existante
2. Vérifier les issues existantes
3. Créer une nouvelle issue avec contexte détaillé
4. Proposer une PR avec tests

## License

MIT
