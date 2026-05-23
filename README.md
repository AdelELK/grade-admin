# Document Uploader - Collections

Une application React moderne pour uploader et gérer des fichiers PDF et images en collections.

**Frontend** React 18 + **Backend** Lambda Python + **Infrastructure** Terraform AWS

## Caractéristiques

### Frontend
- ✅ Création et gestion de collections
- ✅ Upload de fichiers PDF et images
- ✅ Drag & drop support
- ✅ Suppression et édition de documents
- ✅ Interface minimaliste avec Tailwind CSS
- ✅ État global avec Zustand

### Backend & Infrastructure (en cours)
- 🚀 API Lambda Python (HTTP API Gateway)
- 🚀 Stockage S3 pour les fichiers
- 🚀 Infrastructure as Code Terraform
- 🚀 DynamoDB pour les données (futur)
- 🚀 Async workers avec SQS (futur)

## Stack Technique

### Frontend
- **Framework**: React 18 avec TypeScript
- **Build Tool**: Vite
- **UI/CSS**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend & Infrastructure
- **Infrastructure**: Terraform
- **Compute**: AWS Lambda (Python 3.11)
- **API**: API Gateway HTTP v2
- **Storage**: S3 Bucket
- **Database**: DynamoDB (futur)
- **Queue**: SQS (futur)
- **Region**: eu-west-1

## Installation

### Frontend

```bash
npm install
npm run dev
```

L'application s'ouvrira automatiquement sur `http://localhost:5173`

### Backend / Infrastructure

```bash
cd .cloud/30_application
terraform init
terraform plan
terraform apply
```

## Structure du Projet

```
mon/
├── src/                     # Code React frontend
│   ├── components/          # Composants React
│   ├── store.ts            # État global (Zustand)
│   ├── main.tsx            # Point d'entrée
│   └── index.css           # Styles
│
├── .cloud/                 # Infrastructure Terraform
│   ├── 30_application/     # S3, Lambda, API Gateway
│   │   ├── variables.tf
│   │   ├── main.tf
│   │   ├── s3.tf
│   │   ├── lambda.tf
│   │   ├── api_gateway.tf
│   │   ├── iam.tf
│   │   └── outputs.tf
│   │
│   └── 90_dns/             # Route53 (futur)
│
└── Documentation/
    ├── README.md           # Ce fichier
    ├── GETTING_STARTED.md
    ├── ARCHITECTURE.md
    └── ...
```

## Utilisation

### Frontend

1. **Créer une collection**: Cliquez sur le bouton "+" dans la sidebar
2. **Sélectionner une collection**: Cliquez sur une collection pour la sélectionner
3. **Uploader des fichiers**: 
   - Déposez vos fichiers dans la zone de drop
   - Ou cliquez pour parcourir
4. **Gérer les documents**: Supprimez avec l'icône poubelle
5. **Éditer une collection**: Cliquez sur l'icône crayon

### Backend API

Voir `.cloud/README.md` pour la documentation infrastructure

## Formats supportés

- PDF (.pdf)
- Images (JPG, PNG, GIF, WebP, etc.)

## Ressources

- [Frontend Guide](./GETTING_STARTED.md)
- [Architecture](./ARCHITECTURE.md)
- [Cloud Infrastructure](./.cloud/README.md)
- [Lambda Backend Guide](./.cloud/LAMBDA_GUIDE.md)
- [Terraform Documentation](./.cloud/30_application/)

## Prochaines Étapes

1. [ ] Implémenter les handlers Lambda
2. [ ] Configurer DynamoDB
3. [ ] Connecter le frontend à l'API
4. [ ] Ajouter l'authentification
5. [ ] Implémenter les async workers
6. [ ] Setup CI/CD avec GitHub Actions
7. [ ] Configurer le DNS avec Route53
