import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Note: CollectionList/FileUploader/DocumentList imports removed because page now shows single form
import MultiStepCollectionForm from './MultiStepCollectionForm';
export const App = () => {
    // collections and currentCollection not needed on this view
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white border-b border-gray-200", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Gestionnaire de Documents" }), _jsx("p", { className: "text-gray-500 mt-1", children: "Organisez vos fichiers PDF et images en collections" })] }) }), _jsx("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: _jsx("div", { className: "min-h-[60vh] flex items-start justify-center", children: _jsx("div", { className: "w-full", children: _jsx(MultiStepCollectionForm, {}) }) }) })] }));
};
