import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAppStore } from '../store';
const steps = ['Renseignements', 'Système de notation', 'Finaliser'];
export const MultiStepCollectionForm = ({ onClose }) => {
    const createEvaluation = useAppStore((s) => s.createEvaluation);
    const [step, setStep] = useState(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target?.result);
            reader.readAsDataURL(file);
        }
        else {
            setPreview(null);
        }
    }, [file]);
    const handleFile = (f) => {
        if (!f)
            return;
        const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowed.includes(f.type)) {
            setError('Format non supporté — PDF ou image (jpg, png, webp) uniquement');
            return;
        }
        setError(null);
        setFile(f);
    };
    const handleCreate = () => {
        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }
        createEvaluation(title.trim(), description.trim() || undefined, file || null);
        setTitle('');
        setDescription('');
        setFile(null);
        setPreview(null);
        setError(null);
        if (onClose)
            onClose();
    };
    return (_jsx("div", { className: "bg-gray-100 p-6 rounded-md", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("div", { className: "bg-white rounded-t-md px-6 py-4 border border-b-0 border-gray-200", children: _jsx("div", { className: "flex items-center gap-4", children: steps.map((s, idx) => {
                            const index = idx + 1;
                            const active = index === step;
                            const completed = index < step;
                            return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${completed ? 'bg-blue-500 text-white' : active ? 'border-2 border-blue-500 text-blue-600' : 'bg-white text-gray-600 border'}`, onClick: () => setStep(index), style: { cursor: 'pointer' }, children: index }), _jsx("div", { className: `text-sm ${active ? 'text-gray-900 font-semibold' : 'text-gray-500'}`, children: s })] }, s));
                        }) }) }), _jsxs("div", { className: "bg-white p-6 rounded-b-md border border-gray-200 shadow-sm", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-3", children: "Cr\u00E9er une nouvelle \u00E9valuation" }), step === 1 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Titre" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Titre de la collection", className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description (optionnelle)" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Description", className: "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none", rows: 4 })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Mod\u00E8le (PDF ou image) \u2014 obligatoire" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("input", { type: "file", accept: "application/pdf,image/*", onChange: (e) => handleFile(e.target.files?.[0]), className: "text-sm", "aria-required": true }), preview && (_jsx("img", { src: preview, alt: "preview", className: "w-20 h-20 object-cover rounded" })), !preview && file && _jsx("span", { className: "text-sm text-gray-600", children: file.name })] })] }), error && _jsx("p", { className: "text-sm text-red-500", children: error }), _jsxs("div", { className: "flex items-center gap-3 mt-4", children: [_jsx("button", { onClick: () => {
                                                if (!file) {
                                                    setError('Vous devez télécharger le modèle (PDF ou image) pour continuer.');
                                                    return;
                                                }
                                                setError(null);
                                                setStep(2);
                                            }, className: "px-4 py-2 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200", disabled: !title.trim(), children: "Suivant" }), _jsx("div", { className: "flex-1" }), _jsx("button", { onClick: () => {
                                                if (!file) {
                                                    setError('Le modèle est requis pour créer l\'évaluation.');
                                                    return;
                                                }
                                                handleCreate();
                                            }, className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm", children: "Cr\u00E9er (\u00E9tape 1)" }), _jsx("button", { onClick: () => { if (onClose)
                                                onClose(); }, className: "px-3 py-2 border border-gray-300 text-sm rounded-md", children: "Annuler" })] })] })), step === 2 && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Syst\u00E8me de notation \u2014 \u00E0 impl\u00E9menter" }), _jsxs("div", { className: "flex gap-2 mt-3", children: [_jsx("button", { onClick: () => setStep(1), className: "px-3 py-2 border rounded", children: "Retour" }), _jsx("button", { onClick: handleCreate, className: "px-4 py-2 bg-blue-500 text-white rounded", children: "Cr\u00E9er" })] })] }))] })] }) }));
};
export default MultiStepCollectionForm;
