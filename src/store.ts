import { create } from 'zustand';

export interface Document {
  id: string;
  name: string;
  file: File;
  type: 'pdf' | 'image';
  uploadedAt: Date;
  preview?: string;
}

export interface Evaluation {
  id: string;
  name: string;
  description?: string;
  cover?: Document;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

interface AppState {
  evaluations: Evaluation[];
  currentEvaluation: Evaluation | null;
  
  // Evaluation methods
  createEvaluation: (name: string, description?: string, coverFile?: File | null) => void;
  deleteEvaluation: (id: string) => void;
  updateEvaluation: (id: string, name: string, description?: string) => void;
  selectEvaluation: (id: string) => void;
  
  // Document methods
  addDocuments: (files: File[]) => void;
  removeDocument: (evaluationId: string, documentId: string) => void;
  
  // Utility
  getEvaluationById: (id: string) => Evaluation | undefined;
}

export const useAppStore = create<AppState>((set, get) => ({
  evaluations: [],
  currentEvaluation: null,

  createEvaluation: (name: string, description?: string, coverFile?: File | null) => {
    let coverDoc: Document | undefined;
    if (coverFile) {
      let type: 'pdf' | 'image' = 'image';
      if (coverFile.type === 'application/pdf') type = 'pdf';

      let preview: string | undefined;
      if (type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview = e.target?.result as string;
        };
        reader.readAsDataURL(coverFile);
      }

      coverDoc = {
        id: Math.random().toString(36).substr(2, 9),
        name: coverFile.name,
        file: coverFile,
        type,
        uploadedAt: new Date(),
        preview,
      };
    }

    const newEvaluation: Evaluation = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      cover: coverDoc,
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      evaluations: [...state.evaluations, newEvaluation],
    }));
  },

  deleteEvaluation: (id: string) => {
    set((state) => ({
      evaluations: state.evaluations.filter((c) => c.id !== id),
      currentEvaluation: state.currentEvaluation?.id === id ? null : state.currentEvaluation,
    }));
  },

  updateEvaluation: (id: string, name: string, description?: string) => {
    set((state) => ({
      evaluations: state.evaluations.map((c) =>
        c.id === id
          ? { ...c, name, description, updatedAt: new Date() }
          : c
      ),
      currentEvaluation:
        state.currentEvaluation?.id === id
          ? { ...state.currentEvaluation, name, description, updatedAt: new Date() }
          : state.currentEvaluation,
    }));
  },

  selectEvaluation: (id: string) => {
    const evaluation = get().getEvaluationById(id);
    set({ currentEvaluation: evaluation || null });
  },

  addDocuments: (files: File[]) => {
    const { currentEvaluation } = get();
    if (!currentEvaluation) return;

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
      evaluations: state.evaluations.map((c) =>
        c.id === currentEvaluation.id
          ? { ...c, documents: [...c.documents, ...newDocuments], updatedAt: new Date() }
          : c
      ),
      currentEvaluation: {
        ...currentEvaluation,
        documents: [...currentEvaluation.documents, ...newDocuments],
        updatedAt: new Date(),
      },
    }));
  },

  removeDocument: (evaluationId: string, documentId: string) => {
    set((state) => ({
      evaluations: state.evaluations.map((c) =>
        c.id === evaluationId
          ? {
              ...c,
              documents: c.documents.filter((d) => d.id !== documentId),
              updatedAt: new Date(),
            }
          : c
      ),
      currentEvaluation:
        state.currentEvaluation?.id === evaluationId
          ? {
              ...state.currentEvaluation,
              documents: state.currentEvaluation.documents.filter((d) => d.id !== documentId),
              updatedAt: new Date(),
            }
          : state.currentEvaluation,
    }));
  },

  getEvaluationById: (id: string) => {
    return get().evaluations.find((c) => c.id === id);
  },
}));
