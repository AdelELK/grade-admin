# Architecture et Conventions de Développement

## Conventions de Code

### TypeScript
- Toujours utiliser des types explicites
- Pas de `any` type sauf exception documentée
- Interfaces pour les types d'objets
- Types pour les primitives et unions

### React
- Utiliser des **composants fonctionnels** uniquement
- Noms de fichiers: **PascalCase** (ex: `CollectionList.tsx`)
- Props fortement typées
- Utiliser `React.FC<Props>` pour les types de composants

### État (Zustand)
- Actions nommées explicitement (ex: `addDocuments`, `removeDocument`)
- Logique métier dans le store, pas dans les composants
- Utiliser `useAppStore` pour accéder l'état

### Styles
- Utiliser **Tailwind CSS** uniquement
- Pas de fichiers CSS séparés (sauf `index.css` global)
- Classes Tailwind en PascalCase dans les variables JSX
- `cn()` utility (si ajouté) pour les classes conditionnelles

## Structure des Composants

```tsx
import React from 'react';
import { useAppStore } from '../store';

interface ComponentProps {
  // Props typées
}

export const MyComponent: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks en haut
  const state = useAppStore((s) => s.state);
  const action = useAppStore((s) => s.action);

  // Logique
  const handleClick = () => {
    // Logique métier via store
  };

  // Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};
```

## Fichiers à Ne Pas Modifier

- `vite.config.ts` - Configuration build
- `tsconfig.json` - Configuration TypeScript
- `tailwind.config.js` - Configuration Tailwind
- `index.html` - Template HTML

## Ajouter une Nouvelle Fonctionnalité

1. **Définir les types** dans `store.ts`
2. **Implémenter la logique** dans le store Zustand
3. **Créer/modifier le composant** pour afficher la UI
4. **Tester localement** avec `npm run dev`
5. **Builder** avec `npm run build`

## Debugging

### Voir l'état global
```tsx
// Dans le composant
const allState = useAppStore();
console.log(allState);
```

### Accéder au store directement
```tsx
import { useAppStore } from '../store';

// Dans la console (avec DevTools)
const store = window.__STORE__;
```

## Performance

- Composants re-render seulement si leurs sélecteurs changent
- Utiliser la sélection granulaire du store:
  ```tsx
  // ✅ Bon
  const name = useAppStore((s) => s.currentCollection?.name);
  
  // ❌ Mauvais
  const collection = useAppStore((s) => s.currentCollection);
  ```

## Tests Locaux

```bash
# Development
npm run dev

# Production build
npm run build
npm run preview

# Type check
npx tsc --noEmit
```

## Avant de Commiter

- [ ] `npm run build` réussit sans erreurs
- [ ] Pas de `console.log` en production
- [ ] TypeScript sans erreurs
- [ ] Composants documentés si complexes

## Questions Courantes

### Comment ajouter une dépendance?
```bash
npm install new-package
npm install --save-dev new-dev-package
```

### Comment accéder au store dans les composants?
```tsx
const value = useAppStore((state) => state.propertyOrMethod);
```

### Comment combiner plusieurs sélecteurs?
```tsx
const { collections, currentCollection } = useAppStore((state) => ({
  collections: state.collections,
  currentCollection: state.currentCollection,
}));
```

## Checklist pour une PR

- [ ] Pas de fichiers `.js` générés
- [ ] Pas de dépendances inutiles
- [ ] TypeScript valide
- [ ] Tests manuels réalisés
- [ ] Documentation mise à jour
