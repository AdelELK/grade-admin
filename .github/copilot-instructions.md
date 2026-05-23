# Document Uploader - Copilot Instructions

## Project Overview

Application React pour uploader et gérer des fichiers PDF et images en collections. Frontend uniquement avec interface minimaliste et épurée.

## Stack Technique

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 4
- **UI/CSS**: Tailwind CSS 3
- **State Management**: Zustand
- **Icons**: Lucide React

## Architecture

### Structure des fichiers

```
src/
├── components/
│   ├── App.tsx              # Composant principal
│   ├── CollectionList.tsx   # Gestion des collections
│   ├── FileUploader.tsx     # Upload de fichiers avec drag & drop
│   └── DocumentList.tsx     # Affichage et gestion des documents
├── store.ts                 # État global avec Zustand
├── main.tsx                 # Point d'entrée React
├── index.css               # Styles globaux (Tailwind)
├── vite.config.ts          # Configuration Vite
└── tailwind.config.js      # Configuration Tailwind
```

### État Zustand

Le store `useAppStore` gère:

- Collections (CRUD)
- Documents (Add/Remove)
- Navigation entre collections

Types clés:

- `Collection`: id, name, description, documents[], timestamps
- `Document`: id, name, file, type (pdf|image), uploadedAt, preview

## Fonctionnalités

✅ Création/édition/suppression de collections
✅ Upload de fichiers PDF et images
✅ Drag & drop support
✅ Gestion de documents avec suppression
✅ Interface responsive (desktop + mobile)
✅ Design minimaliste avec Tailwind CSS

## Commandes

```bash
npm run dev      # Lancer serveur de développement (port 5173)
npm run build    # Build production
npm run preview  # Prévisualiser le build
```

## Pour la prochaine étape

Prévoir l'intégration d'un backend pour:

- Persistance en base de données
- API REST pour CRUD sur collections et documents
- Stockage des fichiers (local ou cloud)
- Authentification utilisateur

## Notes de développement

- L'état est totalement client-side (Zustand en-mémoire)
- Les fichiers ne sont stockés que dans la mémoire du navigateur
- Pas d'API backend configurée actuellement
- Design responsive via Tailwind
- Icônes via Lucide React
