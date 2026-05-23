import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store';
import { Collection } from '../store';

interface CollectionListProps {
  collections: Collection[];
  currentCollection: Collection | null;
}

interface CollectionItemProps {
  collection: Collection;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const CollectionItem: React.FC<CollectionItemProps> = ({
  collection,
  isSelected,
  onSelect,
  onDelete,
  onEdit,
}) => {
  return (
    <div
      onClick={() => onSelect(collection.id)}
      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      } group`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{collection.name}</h3>
          {collection.description && (
            <p className="text-sm text-gray-500 mt-1">{collection.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            {collection.documents.length} document{collection.documents.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSelected && <ChevronRight className="w-5 h-5 text-blue-500" />}
          
          <div className="opacity-0 group-hover:opacity-100 transition flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(collection.id);
              }}
              className="p-2 hover:bg-gray-100 rounded transition text-gray-500 hover:text-gray-700"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(collection.id);
              }}
              className="p-2 hover:bg-red-50 rounded transition text-gray-500 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CollectionList: React.FC<CollectionListProps> = ({
  collections,
  currentCollection,
}) => {
  const selectCollection = useAppStore((state) => state.selectCollection);
  const deleteCollection = useAppStore((state) => state.deleteCollection);
  const updateCollection = useAppStore((state) => state.updateCollection);
  const createCollection = useAppStore((state) => state.createCollection);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  const handleEdit = (id: string) => {
    const collection = collections.find((c) => c.id === id);
    if (collection) {
      setEditingId(id);
      setEditName(collection.name);
      setEditDesc(collection.description || '');
    }
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      updateCollection(editingId, editName, editDesc);
      setEditingId(null);
    }
  };

  const handleCreateNew = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName, '');
      setNewCollectionName('');
      setShowNewForm(false);
    }
  };

  if (editingId) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Éditer la collection</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Nom de la collection"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Description (optionnelle)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm font-medium"
            >
              Enregistrer
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition text-sm font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Collections</h2>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showNewForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Nom de la nouvelle collection"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleCreateNew()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateNew}
              className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm font-medium"
            >
              Créer
            </button>
            <button
              onClick={() => {
                setShowNewForm(false);
                setNewCollectionName('');
              }}
              className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition text-sm font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {collections.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 text-sm">Aucune collection créée</p>
        </div>
      ) : (
        <div className="space-y-2">
          {collections.map((collection) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              isSelected={currentCollection?.id === collection.id}
              onSelect={selectCollection}
              onDelete={deleteCollection}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};
