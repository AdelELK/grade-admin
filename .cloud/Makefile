.PHONY: help init plan apply destroy format validate clean

APP_DIR := 30_application

help:
	@echo "Document Uploader - Infrastructure Terraform"
	@echo ""
	@echo "Commandes disponibles:"
	@echo "  make init       - Initialiser Terraform"
	@echo "  make plan       - Plan les changements"
	@echo "  make apply      - Appliquer les changements"
	@echo "  make destroy    - Détruire l'infrastructure"
	@echo "  make format     - Formater les fichiers .tf"
	@echo "  make validate   - Valider la syntaxe"
	@echo "  make output     - Afficher les outputs"
	@echo "  make clean      - Nettoyer les fichiers temporaires"

init:
	@echo "Initialisation de Terraform..."
	cd $(APP_DIR) && terraform init

plan:
	@echo "Plan des changements..."
	cd $(APP_DIR) && terraform plan -out=tfplan

apply:
	@echo "Application des changements..."
	cd $(APP_DIR) && terraform apply tfplan

destroy:
	@echo "Destruction de l'infrastructure..."
	cd $(APP_DIR) && terraform destroy

format:
	@echo "Formatage des fichiers Terraform..."
	terraform fmt -recursive

validate:
	@echo "Validation de la syntaxe..."
	cd $(APP_DIR) && terraform validate

output:
	@echo "Outputs Terraform:"
	cd $(APP_DIR) && terraform output

clean:
	@echo "Nettoyage des fichiers temporaires..."
	cd $(APP_DIR) && rm -rf .terraform terraform.lock.hcl tfplan lambda_placeholder.zip lambda_build/

docs:
	@echo "Génération de la documentation..."
	terraform-docs markdown table $(APP_DIR) > $(APP_DIR)/TERRAFORM.md

## Commandes avancées

state-list:
	@echo "État des ressources:"
	cd $(APP_DIR) && terraform state list

state-show:
	@echo "Détails d'une ressource (usage: make state-show RESOURCE=aws_s3_bucket.documents):"
	cd $(APP_DIR) && terraform state show $(RESOURCE)

import:
	@echo "Import d'une ressource (usage: make import RESOURCE=aws_s3_bucket.documents ID=bucket-name):"
	cd $(APP_DIR) && terraform import $(RESOURCE) $(ID)

refresh:
	@echo "Rafraîchissement de l'état..."
	cd $(APP_DIR) && terraform refresh
