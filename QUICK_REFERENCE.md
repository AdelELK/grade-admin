# 📋 Quick Reference Guide

## Structure du Projet

```
src/
├── components/
│   ├── App.tsx                 # Composant parent principal
│   ├── CollectionList.tsx      # Gestion des collections (CRUD)
│   ├── FileUploader.tsx        # Uploader avec drag & drop
│   └── DocumentList.tsx        # Affichage des documents
├── store.ts                    # État global Zustand
├── main.tsx                    # Point d'entrée React
└── index.css                   # Styles globaux Tailwind
```

## Commandes Essentielles

```bash
# Développement
npm run dev

# Production
npm run build && npm run preview

# Check TypeScript
npx tsc --noEmit
```

## Types Clés

### Collection
```typescript
interface Collection {
  id: string;
  name: string;
  description?: string;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Document
```typescript
interface Document {
  id: string;
  name: string;
  file: File;
  type: 'pdf' | 'image';
  uploadedAt: Date;
  preview?: string;
}
```

## Actions du Store

```typescript
// Collections
createCollection(name, description?)
updateCollection(id, name, description?)
deleteCollection(id)
selectCollection(id)

// Documents
addDocuments(files)
removeDocument(collectionId, documentId)

// Utils
getCollectionById(id)
```

## Utiliser le Store dans un Composant

```tsx
import { useAppStore } from '../store';

const collections = useAppStore((state) => state.collections);
const addDocuments = useAppStore((state) => state.addDocuments);

// Ou multiple selectors
const { collections, currentCollection } = useAppStore((state) => ({
  collections: state.collections,
  currentCollection: state.currentCollection,
}));
```

## Configuration Importante

### TypeScript
- Strict mode activé
- Module resolution: node
- JSX: react-jsx

### Tailwind CSS
- Classes utility uniquement
- Breakpoints: sm, md, lg, xl
- Couleurs: gray, blue principalement

### Vite
- Port par défaut: 5173
- Auto open: true
- HMR (Hot Module Replacement) activé

## Fichiers à Ne Pas Modifier

- ✋ `vite.config.ts`
- ✋ `tsconfig.json`
- ✋ `tailwind.config.js`
- ✋ `index.html`

## Bonnes Pratiques

1. **Composants**
   - Petit et focalisé
   - Une responsabilité
   - Props typées

2. **État**
   - Logique dans le store
   - Pas de state local inutile
   - Sélecteurs granulaires

3. **Styles**
   - Tailwind uniquement
   - Pas de CSS-in-JS
   - Classes réutilisables

4. **Types**
   - Pas de `any`
   - Interfaces explicites
   - Types stricts

## Ajouter une Nouvelle Fonctionnalité

1. **Définir les types** dans `store.ts`
2. **Ajouter l'action** dans `useAppStore`
3. **Créer le composant** qui utilise l'action
4. **Importer** et utiliser dans `App.tsx`
5. **Tester** avec `npm run dev`

## Debugging

```tsx
// Voir tout l'état global
const state = useAppStore();
console.log(state);

// Voir une action
console.log(useAppStore.getState());
```

## Deploy

```bash
# Build
npm run build

# Dossier de sortie
dist/

# Servir localement
npx http-server dist/
```

## Ressources Utiles

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://zustand-demo.vercel.app)
- [Lucide Icons](https://lucide.dev)
- [Vite Docs](https://vitejs.dev)

## Support

Pour des questions sur le projet, consultez:
- `.github/copilot-instructions.md`
- `ARCHITECTURE.md`
- `USE_CASES.md`
- `GETTING_STARTED.md`
