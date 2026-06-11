import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Trash2, Edit2, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store';
import MultiStepCollectionForm from './MultiStepCollectionForm';
const CollectionItem = ({ collection, isSelected, onSelect, onDelete, onEdit, }) => {
    return (_jsx("div", { onClick: () => onSelect(collection.id), className: `p-4 rounded-lg border-2 cursor-pointer transition ${isSelected
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 bg-white hover:border-gray-300'} group`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: collection.name }), collection.description && (_jsx("p", { className: "text-sm text-gray-500 mt-1", children: collection.description })), _jsxs("p", { className: "text-xs text-gray-400 mt-2", children: [collection.documents.length, " document", collection.documents.length !== 1 ? 's' : ''] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [isSelected && _jsx(ChevronRight, { className: "w-5 h-5 text-blue-500" }), _jsxs("div", { className: "opacity-0 group-hover:opacity-100 transition flex gap-1", children: [_jsx("button", { onClick: (e) => {
                                        e.stopPropagation();
                                        onEdit(collection.id);
                                    }, className: "p-2 hover:bg-gray-100 rounded transition text-gray-500 hover:text-gray-700", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: (e) => {
                                        e.stopPropagation();
                                        onDelete(collection.id);
                                    }, className: "p-2 hover:bg-red-50 rounded transition text-gray-500 hover:text-red-500", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] })] }) }));
};
export const EvaluationList = ({ collections, currentEvaluation, }) => {
    const selectEvaluation = useAppStore((state) => state.selectEvaluation);
    const deleteEvaluation = useAppStore((state) => state.deleteEvaluation);
    const updateEvaluation = useAppStore((state) => state.updateEvaluation);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [showNewForm, setShowNewForm] = useState(false);
    const handleEdit = (id) => {
        const collection = collections.find((c) => c.id === id);
        if (collection) {
            setEditingId(id);
            setEditName(collection.name);
            setEditDesc(collection.description || '');
        }
    };
    const handleSaveEdit = () => {
        if (editingId && editName.trim()) {
            updateEvaluation(editingId, editName, editDesc);
            setEditingId(null);
        }
    };
    if (editingId) {
        return (_jsxs("div", { className: "bg-white p-6 rounded-lg border border-gray-200", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: "\u00C9diter l'\u00E9valuation" }), _jsxs("div", { className: "space-y-3", children: [_jsx("input", { type: "text", value: editName, onChange: (e) => setEditName(e.target.value), placeholder: "Titre de l'\u00E9valuation", className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("textarea", { value: editDesc, onChange: (e) => setEditDesc(e.target.value), placeholder: "Description (optionnelle)", className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none", rows: 3 }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleSaveEdit, className: "flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm font-medium", children: "Enregistrer" }), _jsx("button", { onClick: () => setEditingId(null), className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition text-sm font-medium", children: "Annuler" })] })] })] }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "\u00C9valuations" }), _jsx("button", { onClick: () => setShowNewForm(!showNewForm), className: "p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900", children: _jsx(Plus, { className: "w-5 h-5" }) })] }), showNewForm && (_jsx(MultiStepCollectionForm, { onClose: () => setShowNewForm(false) })), collections.length === 0 ? (_jsx("div", { className: "py-8 text-center", children: _jsx("p", { className: "text-gray-500 text-sm", children: "Aucune \u00E9valuation cr\u00E9\u00E9e" }) })) : (_jsx("div", { className: "space-y-2", children: collections.map((collection) => (_jsx(CollectionItem, { collection: collection, isSelected: currentEvaluation?.id === collection.id, onSelect: selectEvaluation, onDelete: deleteEvaluation, onEdit: handleEdit }, collection.id))) }))] }));
};
