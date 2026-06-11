import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { useAppStore } from '../store';
export const FileUploader = () => {
    const fileInputRef = useRef(null);
    const addDocuments = useAppStore((state) => state.addDocuments);
    const currentEvaluation = useAppStore((state) => state.currentEvaluation);
    const handleClick = () => {
        fileInputRef.current?.click();
    };
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            addDocuments(files);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files);
        const validFiles = files.filter((file) => file.type === 'application/pdf' || file.type.startsWith('image/'));
        if (validFiles.length > 0) {
            addDocuments(validFiles);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    if (!currentEvaluation) {
        return (_jsx("div", { className: "p-8 text-center text-gray-500", children: _jsx("p", { children: "S\u00E9lectionnez ou cr\u00E9ez une \u00E9valuation pour commencer" }) }));
    }
    return (_jsxs("div", { onDrop: handleDrop, onDragOver: handleDragOver, onClick: handleClick, className: "border-2 border-dashed border-gray-300 rounded-lg p-12 cursor-pointer transition hover:border-gray-400 hover:bg-gray-50", children: [_jsx("input", { ref: fileInputRef, type: "file", multiple: true, accept: ".pdf,image/*", onChange: handleFileChange, className: "hidden" }), _jsxs("div", { className: "flex flex-col items-center justify-center gap-3", children: [_jsx(Upload, { className: "w-8 h-8 text-gray-400" }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-medium text-gray-700", children: "D\u00E9posez vos fichiers ici" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "ou cliquez pour parcourir" })] }), _jsx("p", { className: "text-xs text-gray-400 mt-2", children: "Accepte: PDF, JPG, PNG, GIF" })] })] }));
};
