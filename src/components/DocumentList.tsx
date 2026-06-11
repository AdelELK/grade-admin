import React from 'react';
import { FileText, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useAppStore } from '../store';
import { Document } from '../store';

interface DocumentListProps {
  documents: Document[];
}

const DocumentItem: React.FC<{ doc: Document; onDelete: () => void }> = ({ doc, onDelete }) => {
  const isImage = doc.type === 'image';

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition group">
      <div className="flex-shrink-0">
        {isImage ? (
          <ImageIcon className="w-5 h-5 text-blue-500" />
        ) : (
          <FileText className="w-5 h-5 text-red-500" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {doc.name}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(doc.uploadedAt).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      <button
        onClick={onDelete}
        className="flex-shrink-0 p-2 opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  const removeDocument = useAppStore((state) => state.removeDocument);
  const currentEvaluation = useAppStore((state) => state.currentEvaluation);

  if (documents.length === 0) {
    return (
      <div className="py-12 text-center">
        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Aucun document dans cette évaluation</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Documents ({documents.length})
      </h3>
      {documents.map((doc) => (
        <DocumentItem
          key={doc.id}
          doc={doc}
            onDelete={() => {
            if (currentEvaluation) {
              removeDocument(currentEvaluation.id, doc.id);
            }
          }}
        />
      ))}
    </div>
  );
};
