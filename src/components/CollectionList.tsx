import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store';
import { Evaluation } from '../store';
import MultiStepCollectionForm from './MultiStepCollectionForm';

interface EvaluationListProps {
  evaluations: Evaluation[];
  currentEvaluation: Evaluation | null;
}

interface EvaluationItemProps {
  evaluation: Evaluation;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const EvaluationItem: React.FC<EvaluationItemProps> = ({
  evaluation,
  isSelected,
  onSelect,
  onDelete,
  onEdit,
}) => {
  return (
    <div
      onClick={() => onSelect(evaluation.id)}
      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      } group`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{evaluation.name}</h3>
          {evaluation.description && (
            <p className="text-sm text-gray-500 mt-1">{evaluation.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            {evaluation.documents.length} document{evaluation.documents.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSelected && <ChevronRight className="w-5 h-5 text-blue-500" />}
          
          <div className="opacity-0 group-hover:opacity-100 transition flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(evaluation.id);
              }}
              className="p-2 hover:bg-gray-100 rounded transition text-gray-500 hover:text-gray-700"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(evaluation.id);
              }}
              className="p-2 hover:bg-red-50 rounded transition text-gray-500 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EvaluationList: React.FC<EvaluationListProps> = ({
  evaluations,
  currentEvaluation,
}) => {
  const selectEvaluation = useAppStore((state) => state.selectEvaluation);
  const deleteEvaluation = useAppStore((state) => state.deleteEvaluation);
  const updateEvaluation = useAppStore((state) => state.updateEvaluation);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  const handleEdit = (id: string) => {
    const evaluation = evaluations.find((c) => c.id === id);
    if (evaluation) {
      setEditingId(id);
      setEditName(evaluation.name);
      setEditDesc(evaluation.description || '');
    }
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      updateEvaluation(editingId, editName, editDesc);
      setEditingId(null);
    }
  };

  

  if (editingId) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Éditer l'évaluation</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Titre de l'évaluation"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Description (optionnelle)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm font-medium"
            >
              Enregistrer
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition text-sm font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Évaluations</h2>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showNewForm && (
        <MultiStepCollectionForm onClose={() => setShowNewForm(false)} />
      )}

      {evaluations.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 text-sm">Aucune évaluation créée</p>
        </div>
      ) : (
        <div className="space-y-2">
          {evaluations.map((evaluation) => (
            <EvaluationItem
              key={evaluation.id}
              evaluation={evaluation}
              isSelected={currentEvaluation?.id === evaluation.id}
              onSelect={selectEvaluation}
              onDelete={deleteEvaluation}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};
