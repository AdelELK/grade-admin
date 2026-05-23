# 📖 Cas d'Usage et Workflow

## Scénario 1: Organiser des documents scannés

**Objectif**: Regrouper des factures mensuelles en collections

1. Créer une collection "Factures 2026"
   - Cliquer sur le bouton + dans la sidebar
   - Entrer le nom et description
   - La collection apparaît dans la liste

2. Uploader les fichiers
   - Déposer les PDFs dans la zone de drop
   - Ou cliquer pour parcourir
   - Les documents apparaissent dans la liste

3. Gérer les documents
   - Survoler un document pour voir le bouton supprimer
   - Cliquer sur la poubelle pour retirer

## Scénario 2: Créer plusieurs collections par catégorie

**Objectif**: Organiser les documents par projet

Créer les collections:
- "Projet A - Documents"
- "Projet B - Images"
- "Projet A - Devis"

Puis sélectionner une collection et y ajouter les fichiers correspondants.

## Scénario 3: Éditer une collection existante

1. Cliquer sur l'icône crayon dans la collection
2. Modifier le nom ou la description
3. Cliquer sur "Enregistrer"
4. Les changements sont reflétés immédiatement

## Scénario 4: Supprimer une collection

1. Survoler une collection
2. Cliquer sur l'icône poubelle
3. La collection et tous ses documents sont supprimés
4. Si c'était la collection sélectionnée, la sélection se réinitialise

## Workflow Complet: Numériser et Organiser des Documents

### Étape 1: Préparation
- Numériser les documents
- Sauvegarder en PDF ou JPG

### Étape 2: Organisation
- Créer une collection pour chaque catégorie
  - "Factures"
  - "Contrats"
  - "Correspondance"
  - etc.

### Étape 3: Upload
- Pour chaque collection:
  - Sélectionner la collection
  - Déposer les fichiers
  - Vérifier l'upload

### Étape 4: Révision
- Vérifier que tous les documents sont présents
- Supprimer les doublons
- Éditer les descriptions si nécessaire

## Limitations Actuelles

⚠️ **Important**: 

- Les données ne sont **pas persistées** (rechargement = perte)
- Les fichiers ne sont **pas sauvegardés** (stockage mémoire uniquement)
- Pas de **synchronisation** avec cloud

## Migration vers un Backend

Lorsque vous ajouterez un backend, le workflow devrait inclure:

### Upload Async
```tsx
// Future implémentation
const uploadToServer = async (file: File, collectionId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('collectionId', collectionId);
  
  const response = await fetch('/api/documents/upload', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

### Persistance
- Collections sauvegardées en base de données
- Fichiers stockés sur serveur ou cloud
- État synchronisé lors du chargement

### Authentification
- Login utilisateur
- Chaque utilisateur a ses propres collections
- Partage optionnel de collections

## Tips & Tricks

### Drag & Drop Efficace
- Glissez plusieurs fichiers à la fois
- Format PDF en noir et blanc: téléchargement plus rapide
- Images: comprimez avant si fichiers très volumineux

### Navigation Clavier (Futur)
```
- Tab: Navigation entre éléments
- Enter: Sélectionner/Éditer
- Delete: Supprimer
- Escape: Annuler
```

### Debugging
- Ouvrir DevTools (F12)
- Vérifier Console pour les erreurs
- Vérifier Network pour les uploads

## Métriques et Monitoring (Futur)

À considérer pour la production:
- Nombre de collections par utilisateur
- Taille totale des documents
- Temps d'upload moyen
- Erreurs les plus fréquentes

## Support d'Autres Formats (Futur)

Possibilité d'étendre à:
- `.docx`, `.xlsx` (Office)
- `.txt`, `.csv` (Texte)
- `.zip` (Archives)
- `.mp3`, `.mp4` (Média)

## Partage et Collaboration (Futur)

Fonctionnalités possibles:
- Partager une collection avec d'autres utilisateurs
- Permissions (lecture seule, édition)
- Historique des modifications
- Commentaires sur documents
