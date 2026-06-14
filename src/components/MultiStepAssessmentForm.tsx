import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import {
  createAssessment as createAssessmentOnApi,
  uploadAssessmentFile,
} from '../api';

interface Props {
  onClose?: () => void;
}

const steps = ['Renseignements', 'Système de notation', 'Finaliser'];

export const MultiStepAssessmentForm: React.FC<Props> = ({ onClose }) => {
  const addAssessment = useAppStore((s) => s.addAssessment);

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleFile = (f?: File) => {
    if (!f) return;
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(f.type)) {
      setError('Format non supporté — PDF ou image (jpg, png, webp) uniquement');
      return;
    }
    setError(null);
    setFile(f);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }

    if (!file) {
      setError('Le modèle est requis pour créer l\'assessment.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const assessmentName = title.trim();
      const assessmentDescription = description.trim() || undefined;

      const assessment = await createAssessmentOnApi(
        assessmentName,
        assessmentDescription,
      );
      const s3Key = await uploadAssessmentFile(file);

      addAssessment({
        ...assessment,
        document: {
          id: s3Key,
          name: file.name,
          file,
          s3Key,
          type: file.type === 'application/pdf' ? 'pdf' : 'image',
          uploadedAt: new Date(),
          preview: preview ?? undefined,
        },
      });
      setTitle('');
      setDescription('');
      setFile(null);
      setPreview(null);
      if (onClose) onClose();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Une erreur est survenue pendant la création de l'assessment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-md">
      <div className="max-w-2xl mx-auto">
        {/* Step bar */}
        <div className="bg-white rounded-t-md px-6 py-4 border border-b-0 border-gray-200">
          <div className="flex items-center gap-4">
            {steps.map((s, idx) => {
              const index = idx + 1;
              const active = index === step;
              const completed = index < step;
              return (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${
                      completed ? 'bg-blue-500 text-white' : active ? 'border-2 border-blue-500 text-blue-600' : 'bg-white text-gray-600 border'
                    }`}
                    onClick={() => setStep(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {index}
                  </div>
                  <div className={`text-sm ${active ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                    {s}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white p-6 rounded-b-md border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Créer une nouvelle assessment</h3>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de l'assessment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnelle)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modèle (PDF ou image) — obligatoire</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                    className="text-sm"
                    aria-required
                  />
                  {preview && (
                    <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded" />
                  )}
                  {!preview && file && <span className="text-sm text-gray-600">{file.name}</span>}
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => {
                    if (!file) {
                      setError('Vous devez télécharger le modèle (PDF ou image) pour continuer.');
                      return;
                    }
                    setError(null);
                    setStep(2);
                  }}
                  className="px-4 py-2 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200"
                  disabled={!title.trim() || isSubmitting}
                >
                  Suivant
                </button>

                <div className="flex-1" />

                <button
                  onClick={handleCreate}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60 text-sm"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Créer (étape 1)'}
                </button>

                <button
                  onClick={() => { if (onClose) onClose(); }}
                  disabled={isSubmitting}
                  className="px-3 py-2 border border-gray-300 disabled:cursor-not-allowed disabled:opacity-60 text-sm rounded-md"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-sm text-gray-600">Système de notation — à implémenter</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setStep(1)} className="px-3 py-2 border rounded">Retour</button>
                <button
                  onClick={handleCreate}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white disabled:cursor-not-allowed disabled:opacity-60 rounded"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Créer'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepAssessmentForm;
