# 📄 Document Uploader - Guide de Démarrage

Bienvenue dans l'application **Document Uploader** - un gestionnaire de collections de documents PDF et images construit avec React, TypeScript et Tailwind CSS.

## 🚀 Démarrage Rapide

### Installation

```bash
npm install
```

### Lancer le serveur de développement

```bash
npm run dev
```

L'application s'ouvrira automatiquement sur `http://localhost:5173`.

### Build pour production

```bash
npm run build
```

### Prévisualiser le build

```bash
npm run preview
```

## 📋 Fonctionnalités

### Collections
- ✅ **Créer** une nouvelle collection
- ✅ **Éditer** le nom et la description
- ✅ **Supprimer** une collection
- ✅ **Sélectionner** une collection pour ajouter des documents

### Documents
- ✅ **Uploader** les fichiers via drag & drop ou clic
- ✅ **Afficher** la liste des documents
- ✅ **Supprimer** un document
- ✅ **Support** PDF et images (JPG, PNG, GIF, WebP, etc.)

### Interface
- ✅ **Minimaliste** et épurée
- ✅ **Responsive** (desktop et mobile)
- ✅ **Dark mode ready** (utilise Tailwind)
- ✅ **Icônes intuitives** (Lucide React)

## 📁 Structure du Projet

```
mon/
├── src/
│   ├── components/
│   │   ├── App.tsx              # Composant racine
│   │   ├── CollectionList.tsx   # Gestion des collections
│   │   ├── FileUploader.tsx     # Upload avec drag & drop
│   │   └── DocumentList.tsx     # Affichage des documents
│   ├── store.ts                 # État global (Zustand)
│   ├── main.tsx                 # Point d'entrée React
│   └── index.css               # Styles globaux
├── index.html                   # HTML racine
├── vite.config.ts              # Config Vite
├── tsconfig.json               # Config TypeScript
├── tailwind.config.js          # Config Tailwind
└── postcss.config.js           # Config PostCSS
```

## 🏗️ Architecture

### État Global (Zustand)

L'application utilise **Zustand** pour gérer l'état global:

```typescript
interface Collection {
  id: string;
  name: string;
  description?: string;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

interface Document {
  id: string;
  name: string;
  file: File;
  type: 'pdf' | 'image';
  uploadedAt: Date;
}
```

### Stores disponibles

- `createCollection()` - Créer une collection
- `deleteCollection()` - Supprimer une collection
- `updateCollection()` - Éditer une collection
- `selectCollection()` - Sélectionner une collection
- `addDocuments()` - Ajouter des documents
- `removeDocument()` - Supprimer un document

## 🎨 Design

L'interface utilise:
- **Tailwind CSS 3** pour les styles
- **Lucide React** pour les icônes
- **Design minimaliste** avec beaucoup d'espace blanc
- **Couleurs neutres** (grays et bleus)
- **Transitions douces** pour une meilleure UX

## 🔮 Prochaines Étapes

Pour évolver l'application, vous pourriez ajouter:

1. **Backend Node.js/Express**
   - API REST pour persister les collections
   - Base de données (MongoDB/PostgreSQL)

2. **Authentification**
   - Connexion utilisateur
   - Permissions et partage

3. **Stockage Cloud**
   - AWS S3 ou Cloudinary
   - Compression et optimisation des images

4. **Fonctionnalités avancées**
   - Recherche et filtrage
   - Tags et catégories
   - Annotations sur documents
   - Export en PDF

## 📝 Notes

- L'état est totalement **client-side** (données en mémoire)
- Les fichiers ne sont pas persistés actuellement
- Idéal comme prototype ou base pour un projet plus large
- Prêt pour intégration avec un backend

## 🐛 Troubleshooting

### Le port 5173 est utilisé
```bash
npm run dev -- --port 3000
```

### Erreurs TypeScript
```bash
npm install
```

### Build échoue
```bash
npm run build -- --force
```

## 📞 Support

Pour toute question ou suggestion, consultez la documentation Vite, React ou Tailwind CSS officielles.

Bon développement! 🎉
