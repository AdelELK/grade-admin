# 🎨 UI/UX Overview

## Vue d'ensemble de l'Interface

```
┌─────────────────────────────────────────────────────────────────┐
│ Gestionnaire de Documents                                       │
│ Organisez vos fichiers PDF et images en collections             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────────────────────────┐
│                  │                                              │
│  Collections     │  Upload & Documents                         │
│  ──────────────  │  ──────────────────                         │
│                  │                                              │
│  [+] Ajouter     │  Collection: "Factures 2026"               │
│                  │                                              │
│  [✓] Factures    │  ┌────────────────────────────────────────┐ │
│      2024        │  │ Déposez vos fichiers ici               │ │
│      12 docs ➜   │  │ ou cliquez pour parcourir              │ │
│                  │  │ Accepte: PDF, JPG, PNG, GIF            │ │
│  [ ] Contrats    │  └────────────────────────────────────────┘ │
│      5 docs      │                                              │
│                  │  Documents (3)                              │
│  [ ] Images      │  ──────────────                             │
│      23 docs     │                                              │
│                  │  ├─ [📄] facture-jan.pdf   01/01/2026 12:30 │
│                  │  │        [hover: 🗑️]                        │
│                  │  │                                           │
│                  │  ├─ [🖼️] devis.jpg        15/01/2026 14:15 │
│                  │  │        [hover: 🗑️]                        │
│                  │  │                                           │
│                  │  └─ [📄] reçu.pdf         22/01/2026 09:45 │
│                  │         [hover: 🗑️]                        │
│                  │                                              │
└──────────────────┴──────────────────────────────────────────────┘
```

## Interactions Utilisateur

### 1️⃣ Créer une Collection

```
1. Cliquer sur [+] dans la sidebar
2. Entrer le nom: "Factures 2026"
3. Optionnel: Description
4. Cliquer "Créer"
5. ✅ Collection ajoutée à la liste
```

### 2️⃣ Uploader des Fichiers

```
1. Sélectionner une collection (elle devient bleue)
2. Déposer les fichiers PDF/images dans la zone
3. OU cliquer pour parcourir
4. Les documents apparaissent dans la liste
5. ✅ Fichiers gérés par la collection
```

### 3️⃣ Supprimer un Document

```
1. Survoler un document (il devient gris clair)
2. Apparition du bouton 🗑️ à droite
3. Cliquer sur 🗑️
4. ✅ Document supprimé (pas de confirmation)
```

### 4️⃣ Éditer une Collection

```
1. Survoler une collection
2. Apparition des boutons ✏️ 🗑️
3. Cliquer sur ✏️
4. Formulaire pour éditer nom et description
5. Cliquer "Enregistrer" ou "Annuler"
6. ✅ Collection mise à jour
```

### 5️⃣ Supprimer une Collection

```
1. Survoler une collection
2. Apparition des boutons ✏️ 🗑️
3. Cliquer sur 🗑️
4. ✅ Collection ET tous ses documents supprimés
```

## Design System

### Couleurs

```
- Fond principal: #f9fafb (gray-50)
- Fond composants: blanc
- Bordures: #e5e7eb (gray-200)
- Texte principal: #111827 (gray-900)
- Texte secondaire: #6b7280 (gray-500)
- Texte tertaire: #d1d5db (gray-300)
- Accent: #3b82f6 (blue-500)
- Hover: #eff6ff (blue-50)
- Danger: #ef4444 (red-500)
```

### Typographie

```
- Titres principaux: 30px, gras
- Titres sections: 18px, semibold
- Texte normal: 16px, regular
- Petit texte: 14px/12px, gray-500
```

### Espacement

```
- Gap entre éléments: 16px (gap-4)
- Padding interne: 16px-24px
- Margin sections: 32px (py-8)
```

### Icônes (Lucide React)

```
+ [Plus]              Ajouter une collection
✏️ [Edit2]           Éditer une collection
🗑️ [Trash2]         Supprimer
📤 [Upload]          Upload/Drop zone
📄 [FileText]       Fichier PDF
🖼️ [Image]          Image
▶️ [ChevronRight]    Collection sélectionnée
```

## États Visuels

### Collection

```
Non sélectionnée:
┌─ Nom de la collection         ────────────────────┐
│ Description optionnelle        ✏️  🗑️             │
│ 5 documents                                        │
└─────────────────────────────────────────────────────┘

Sélectionnée (hover):
┌─ Nom de la collection         ▶️ ✏️  🗑️           │ (fond bleu-50)
│ Description optionnelle                            │ (bordure blue)
│ 5 documents                                        │
└─────────────────────────────────────────────────────┘
```

### Document

```
Normal:
├─ [📄] nom-fichier.pdf    22/01/2026 09:45

Hover:
├─ [📄] nom-fichier.pdf    22/01/2026 09:45    [🗑️]
```

### Upload Zone

```
Normal (vide):
┌────────────────────────────────────────────┐
│         Déposez vos fichiers ici           │
│     ou cliquez pour parcourir             │
│  Accepte: PDF, JPG, PNG, GIF              │
└────────────────────────────────────────────┘

Hover:
┌────────────────────────────────────────────┐
│ (background: #f9fafb) (bordure: #9ca3af)  │
│         Déposez vos fichiers ici           │
│     ou cliquez pour parcourir             │
│  Accepte: PDF, JPG, PNG, GIF              │
└────────────────────────────────────────────┘
```

## Breakpoints Responsive

```
Mobile (< 640px):
- Sidebar: Masquée ou collapse
- Layout: 1 colonne

Tablet (640px - 1024px):
- Sidebar: 25% width
- Layout: 2 colonnes

Desktop (> 1024px):
- Sidebar: 25% width (1/4)
- Main: 75% width (3/4)
- Layout: 2 colonnes
```

## Animations & Transitions

```
- Bordures: 150ms
- Opacité (hover): 100ms
- Coleurs: 150ms
- Tailles: none (immédiat)
```

## Accessibilité

- ✅ Contraste suffisant (AA WCAG)
- ✅ Bordures claires au focus (keyboard)
- ✅ Alt text sur icônes (implicit)
- ✅ Labels explicites sur inputs
- ✅ Hierarchie heading claire

## Messages et Feedback

```
✅ Succès:
   Collection créée: "Factures 2026"

❌ Erreur:
   Formats acceptés: PDF, JPG, PNG, GIF

ℹ️ Info:
   Aucun document dans cette collection

⚠️ Avertissement:
   Sélectionnez une collection pour commencer
```

## Future UI Improvements (v2.0)

- [ ] Dark mode toggle
- [ ] Toast notifications
- [ ] Skeleton loaders
- [ ] Preview des images
- [ ] Pagination
- [ ] Searchbar
- [ ] Tags sur documents
- [ ] Drag & drop pour réorganiser
- [ ] Bulk actions (select multiple)
- [ ] Custom icons par collection
