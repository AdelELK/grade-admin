import { create } from 'zustand';
export const useAppStore = create((set, get) => ({
    evaluations: [],
    currentEvaluation: null,
    createEvaluation: (name, description, coverFile) => {
        let coverDoc;
        if (coverFile) {
            let type = 'image';
            if (coverFile.type === 'application/pdf')
                type = 'pdf';
            let preview;
            if (type === 'image') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview = e.target?.result;
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
        const newEvaluation = {
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
    deleteEvaluation: (id) => {
        set((state) => ({
            evaluations: state.evaluations.filter((c) => c.id !== id),
            currentEvaluation: state.currentEvaluation?.id === id ? null : state.currentEvaluation,
        }));
    },
    updateEvaluation: (id, name, description) => {
        set((state) => ({
            evaluations: state.evaluations.map((c) => c.id === id
                ? { ...c, name, description, updatedAt: new Date() }
                : c),
            currentEvaluation: state.currentEvaluation?.id === id
                ? { ...state.currentEvaluation, name, description, updatedAt: new Date() }
                : state.currentEvaluation,
        }));
    },
    selectEvaluation: (id) => {
        const evaluation = get().getEvaluationById(id);
        set({ currentEvaluation: evaluation || null });
    },
    addDocuments: (files) => {
        const { currentEvaluation } = get();
        if (!currentEvaluation)
            return;
        const newDocuments = files.map((file) => {
            let type = 'image';
            if (file.type === 'application/pdf') {
                type = 'pdf';
            }
            let preview;
            if (type === 'image') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview = e.target?.result;
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
            evaluations: state.evaluations.map((c) => c.id === currentEvaluation.id
                ? { ...c, documents: [...c.documents, ...newDocuments], updatedAt: new Date() }
                : c),
            currentEvaluation: {
                ...currentEvaluation,
                documents: [...currentEvaluation.documents, ...newDocuments],
                updatedAt: new Date(),
            },
        }));
    },
    removeDocument: (evaluationId, documentId) => {
        set((state) => ({
            evaluations: state.evaluations.map((c) => c.id === evaluationId
                ? {
                    ...c,
                    documents: c.documents.filter((d) => d.id !== documentId),
                    updatedAt: new Date(),
                }
                : c),
            currentEvaluation: state.currentEvaluation?.id === evaluationId
                ? {
                    ...state.currentEvaluation,
                    documents: state.currentEvaluation.documents.filter((d) => d.id !== documentId),
                    updatedAt: new Date(),
                }
                : state.currentEvaluation,
        }));
    },
    getEvaluationById: (id) => {
        return get().evaluations.find((c) => c.id === id);
    },
}));
