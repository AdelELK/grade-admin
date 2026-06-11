import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useAppStore } from '../store';
const DocumentItem = ({ doc, onDelete }) => {
    const isImage = doc.type === 'image';
    return (_jsxs("div", { className: "flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition group", children: [_jsx("div", { className: "flex-shrink-0", children: isImage ? (_jsx(ImageIcon, { className: "w-5 h-5 text-blue-500" })) : (_jsx(FileText, { className: "w-5 h-5 text-red-500" })) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: doc.name }), _jsx("p", { className: "text-xs text-gray-500", children: new Date(doc.uploadedAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        }) })] }), _jsx("button", { onClick: onDelete, className: "flex-shrink-0 p-2 opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }));
};
export const DocumentList = ({ documents }) => {
    const removeDocument = useAppStore((state) => state.removeDocument);
    const currentEvaluation = useAppStore((state) => state.currentEvaluation);
    if (documents.length === 0) {
        return (_jsxs("div", { className: "py-12 text-center", children: [_jsx(ImageIcon, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), _jsx("p", { className: "text-gray-500", children: "Aucun document dans cette \u00E9valuation" })] }));
    }
    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("h3", { className: "text-sm font-semibold text-gray-700 mb-4", children: ["Documents (", documents.length, ")"] }), documents.map((doc) => (_jsx(DocumentItem, { doc: doc, onDelete: () => {
                    if (currentEvaluation) {
                        removeDocument(currentEvaluation.id, doc.id);
                    }
                } }, doc.id)))] }));
};
