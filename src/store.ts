import { create } from 'zustand';

export interface Document {
  id: string;
  name: string;
  file: File;
  type: 'pdf' | 'image';
  uploadedAt: Date;
  preview?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

interface AppState {
  collections: Collection[];
  currentCollection: Collection | null;
  
  // Collection methods
  createCollection: (name: string, description?: string) => void;
  deleteCollection: (id: string) => void;
  updateCollection: (id: string, name: string, description?: string) => void;
  selectCollection: (id: string) => void;
  
  // Document methods
  addDocuments: (files: File[]) => void;
  removeDocument: (collectionId: string, documentId: string) => void;
  
  // Utility
  getCollectionById: (id: string) => Collection | undefined;
}

export const useAppStore = create<AppState>((set, get) => ({
  collections: [],
  currentCollection: null,

  createCollection: (name: string, description?: string) => {
    const newCollection: Collection = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      collections: [...state.collections, newCollection],
    }));
  },

  deleteCollection: (id: string) => {
    set((state) => ({
      collections: state.collections.filter((c) => c.id !== id),
      currentCollection: state.currentCollection?.id === id ? null : state.currentCollection,
    }));
  },

  updateCollection: (id: string, name: string, description?: string) => {
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === id
          ? { ...c, name, description, updatedAt: new Date() }
          : c
      ),
      currentCollection:
        state.currentCollection?.id === id
          ? { ...state.currentCollection, name, description, updatedAt: new Date() }
          : state.currentCollection,
    }));
  },

  selectCollection: (id: string) => {
    const collection = get().getCollectionById(id);
    set({ currentCollection: collection || null });
  },

  addDocuments: (files: File[]) => {
    const { currentCollection } = get();
    if (!currentCollection) return;

    const newDocuments: Document[] = files.map((file) => {
      let type: 'pdf' | 'image' = 'image';
      if (file.type === 'application/pdf') {
        type = 'pdf';
      }

      let preview: string | undefined;
      if (type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        file,
        type,
        uploadedAt: new Date(),
        preview,
      };
    });

    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === currentCollection.id
          ? { ...c, documents: [...c.documents, ...newDocuments], updatedAt: new Date() }
          : c
      ),
      currentCollection: {
        ...currentCollection,
        documents: [...currentCollection.documents, ...newDocuments],
        updatedAt: new Date(),
      },
    }));
  },

  removeDocument: (collectionId: string, documentId: string) => {
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === collectionId
          ? {
              ...c,
              documents: c.documents.filter((d) => d.id !== documentId),
              updatedAt: new Date(),
            }
          : c
      ),
      currentCollection:
        state.currentCollection?.id === collectionId
          ? {
              ...state.currentCollection,
              documents: state.currentCollection.documents.filter((d) => d.id !== documentId),
              updatedAt: new Date(),
            }
          : state.currentCollection,
    }));
  },

  getCollectionById: (id: string) => {
    return get().collections.find((c) => c.id === id);
  },
}));
