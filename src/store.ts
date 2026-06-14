import { create } from 'zustand';

export interface Document {
  id: string;
  name: string;
  file: File;
  s3Key?: string;
  type: 'pdf' | 'image';
  uploadedAt: Date;
  preview?: string;
}

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  document?: Document;
  metadata?: Record<string, unknown>;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AppState {
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  
  // Assessment methods
  addAssessment: (assessment: Assessment) => void;
  deleteAssessment: (id: string) => void;
  updateAssessment: (id: string, title: string, description?: string) => void;
  selectAssessment: (id: string) => void;
  
  // Document methods
  setDocument: (file: File) => void;
  removeDocument: (assessmentId: string) => void;
  
  // Utility
  getAssessmentById: (id: string) => Assessment | undefined;
}

export const useAppStore = create<AppState>((set, get) => ({
  assessments: [],
  currentAssessment: null,

  addAssessment: (assessment: Assessment) => {
    set((state) => ({
      assessments: [...state.assessments, assessment],
      currentAssessment: assessment,
    }));
  },

  deleteAssessment: (id: string) => {
    set((state) => ({
      assessments: state.assessments.filter((c) => c.id !== id),
      currentAssessment: state.currentAssessment?.id === id ? null : state.currentAssessment,
    }));
  },

  updateAssessment: (id: string, title: string, description?: string) => {
    set((state) => ({
      assessments: state.assessments.map((c) =>
        c.id === id
          ? { ...c, title, description, updatedAt: new Date() }
          : c
      ),
      currentAssessment:
        state.currentAssessment?.id === id
          ? { ...state.currentAssessment, title, description, updatedAt: new Date() }
          : state.currentAssessment,
    }));
  },

  selectAssessment: (id: string) => {
    const assessment = get().getAssessmentById(id);
    set({ currentAssessment: assessment || null });
  },

  setDocument: (file: File) => {
    const { currentAssessment } = get();
    if (!currentAssessment) return;

    const document: Document = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      file,
      type: file.type === 'application/pdf' ? 'pdf' : 'image',
      uploadedAt: new Date(),
    };

    set((state) => ({
      assessments: state.assessments.map((c) =>
        c.id === currentAssessment.id
          ? { ...c, document: document, updatedAt: new Date() }
          : c
      ),
      currentAssessment: {
        ...currentAssessment,
        document: document,
        updatedAt: new Date(),
      },
    }));
  },

  removeDocument: (assessmentId: string) => {
    set((state) => ({
      assessments: state.assessments.map((c) =>
        c.id === assessmentId
          ? {
              ...c,
              document: undefined,
              updatedAt: new Date(),
            }
          : c
      ),
      currentAssessment:
        state.currentAssessment?.id === assessmentId
          ? {
              ...state.currentAssessment,
              document: undefined,
              updatedAt: new Date(),
            }
          : state.currentAssessment,
    }));
  },

  getAssessmentById: (id: string) => {
    return get().assessments.find((c) => c.id === id);
  },
}));
