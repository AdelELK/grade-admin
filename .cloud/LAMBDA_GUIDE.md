# Backend Lambda - Guide d'Implémentation

## Structure du Code Lambda

```
lambda/
├── index.py              # Handler principal
├── requirements.txt      # Dépendances Python
├── handlers/
│   ├── collections.py    # CRUD Collections
│   ├── documents.py      # CRUD Documents
│   └── auth.py          # Authentification (futur)
├── models/
│   ├── collection.py     # Modèle Collection
│   └── document.py       # Modèle Document
├── services/
│   ├── s3_service.py     # Logique S3
│   └── dynamodb_service.py # Logique DynamoDB (futur)
└── utils/
    ├── responses.py      # Formatage des réponses
    └── logger.py        # Logging configuré
```

## Handler Lambda Principal

### index.py

```python
import json
import logging
from handlers import collections, documents
from utils.responses import error_response, success_response
from utils.logger import setup_logger

logger = setup_logger(__name__)

async def handler(event, context):
    """
    Handler principal Lambda
    
    event: {
        'requestContext': {'http': {'method': 'GET', 'path': '/collections'}},
        'body': '{"name": "Collection"}',
        'pathParameters': {'id': 'col-123'},
        'queryStringParameters': {'limit': '10'}
    }
    """
    
    try:
        method = event['requestContext']['http']['method']
        path = event['requestContext']['http']['path']
        
        logger.info(f"{method} {path}")
        
        # Router les requêtes
        if path.startswith('/collections') and method == 'GET':
            return await collections.list_collections(event, context)
        
        elif path.startswith('/collections') and method == 'POST':
            return await collections.create_collection(event, context)
        
        elif path.startswith('/collections') and method in ['GET', 'PUT', 'DELETE']:
            collection_id = event['pathParameters'].get('id')
            
            if method == 'GET':
                return await collections.get_collection(collection_id, event, context)
            elif method == 'PUT':
                return await collections.update_collection(collection_id, event, context)
            elif method == 'DELETE':
                return await collections.delete_collection(collection_id, event, context)
        
        elif path.startswith('/collections') and path.endswith('/documents') and method == 'POST':
            collection_id = event['pathParameters'].get('id')
            return await documents.upload_document(collection_id, event, context)
        
        elif path.startswith('/documents') and method == 'DELETE':
            document_id = event['pathParameters'].get('id')
            return await documents.delete_document(document_id, event, context)
        
        else:
            return error_response("Route not found", 404)
    
    except Exception as e:
        logger.error(f"Erreur: {str(e)}", exc_info=True)
        return error_response("Internal server error", 500)
```

## Handlers Collections

### handlers/collections.py

```python
import json
import uuid
from datetime import datetime
from utils.responses import success_response, error_response
from utils.logger import setup_logger

logger = setup_logger(__name__)

async def list_collections(event, context):
    """GET /collections"""
    try:
        # TODO: Récupérer depuis DynamoDB
        collections = [
            {
                'id': 'col-1',
                'name': 'Factures',
                'description': 'Documents factures',
                'documents': [],
                'createdAt': '2026-05-23T10:00:00Z',
                'updatedAt': '2026-05-23T10:00:00Z'
            }
        ]
        return success_response(collections)
    except Exception as e:
        logger.error(f"Erreur list_collections: {str(e)}")
        return error_response(str(e), 500)

async def create_collection(event, context):
    """POST /collections"""
    try:
        body = json.loads(event.get('body', '{}'))
        
        # Validation
        if not body.get('name'):
            return error_response("Name is required", 400)
        
        # Créer la collection
        collection = {
            'id': f"col-{uuid.uuid4().hex[:12]}",
            'name': body['name'],
            'description': body.get('description', ''),
            'documents': [],
            'createdAt': datetime.utcnow().isoformat() + 'Z',
            'updatedAt': datetime.utcnow().isoformat() + 'Z'
        }
        
        # TODO: Sauvegarder dans DynamoDB
        logger.info(f"Collection créée: {collection['id']}")
        
        return success_response(collection, 201)
    except Exception as e:
        logger.error(f"Erreur create_collection: {str(e)}")
        return error_response(str(e), 500)

async def get_collection(collection_id, event, context):
    """GET /collections/{id}"""
    try:
        # TODO: Récupérer depuis DynamoDB
        if not collection_id:
            return error_response("Collection ID is required", 400)
        
        return success_response({'id': collection_id})
    except Exception as e:
        logger.error(f"Erreur get_collection: {str(e)}")
        return error_response(str(e), 500)

async def update_collection(collection_id, event, context):
    """PUT /collections/{id}"""
    try:
        body = json.loads(event.get('body', '{}'))
        # TODO: Mettre à jour dans DynamoDB
        return success_response({'id': collection_id, **body})
    except Exception as e:
        logger.error(f"Erreur update_collection: {str(e)}")
        return error_response(str(e), 500)

async def delete_collection(collection_id, event, context):
    """DELETE /collections/{id}"""
    try:
        # TODO: Supprimer de DynamoDB
        return success_response({'message': 'Collection deleted'}, 204)
    except Exception as e:
        logger.error(f"Erreur delete_collection: {str(e)}")
        return error_response(str(e), 500)
```

## Handlers Documents

### handlers/documents.py

```python
import json
import uuid
import os
from datetime import datetime
from services.s3_service import upload_to_s3, delete_from_s3
from utils.responses import success_response, error_response
from utils.logger import setup_logger

logger = setup_logger(__name__)

async def upload_document(collection_id, event, context):
    """POST /collections/{id}/documents"""
    try:
        body = json.loads(event.get('body', '{}'))
        
        # Validation
        if not body.get('name'):
            return error_response("Document name is required", 400)
        
        # Générer ID unique
        document_id = f"doc-{uuid.uuid4().hex[:12]}"
        
        # Uploader le fichier
        # TODO: Implémenter l'upload base64 ou multipart
        
        document = {
            'id': document_id,
            'name': body['name'],
            'type': body.get('type', 'image'),
            'uploadedAt': datetime.utcnow().isoformat() + 'Z',
            'size': body.get('size', 0)
        }
        
        # TODO: Sauvegarder dans DynamoDB
        
        logger.info(f"Document uploadé: {document_id}")
        return success_response(document, 201)
    except Exception as e:
        logger.error(f"Erreur upload_document: {str(e)}")
        return error_response(str(e), 500)

async def delete_document(document_id, event, context):
    """DELETE /documents/{id}"""
    try:
        # TODO: Supprimer de S3
        # TODO: Supprimer de DynamoDB
        return success_response({'message': 'Document deleted'}, 204)
    except Exception as e:
        logger.error(f"Erreur delete_document: {str(e)}")
        return error_response(str(e), 500)
```

## Prochaines Étapes

1. [ ] Implémenter les handlers Collections (CRUD)
2. [ ] Implémenter les handlers Documents (CRUD)
3. [ ] Configurer DynamoDB dans Terraform
4. [ ] Implémenter les services S3
5. [ ] Implémenter les services DynamoDB
6. [ ] Ajouter authentification (Cognito/API Keys)
7. [ ] Ajouter validation des inputs
8. [ ] Ajouter logging structuré
9. [ ] Ajouter monitoring et alarms
10. [ ] Ajouter async workers pour traitement

## Requirements.txt

```
boto3==1.28.0
python-json-logger==2.0.7
aws-lambda-powertools==2.20.0
```

## Déploiement

```bash
# 1. Installer les dépendances
pip install -r requirements.txt -t lambda_package/

# 2. Copier le code
cp index.py handlers/ models/ services/ utils/ lambda_package/

# 3. Créer le ZIP
cd lambda_package && zip -r ../lambda_deployment.zip . && cd ..

# 4. Uploader vers Lambda (Terraform le fera automatiquement)
```
