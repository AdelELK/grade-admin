import React from 'react';
// Note: AssessmentList/FileUploader/DocumentList imports removed because page now shows single form
import MultiStepAssessmentForm from './MultiStepAssessmentForm';

export const App: React.FC = () => {
  // assessments and currentAssessment not needed on this view

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestionnaire de Documents
          </h1>
          <p className="text-gray-500 mt-1">
            Ajoutez un fichier PDF ou une image à votre assessment
          </p>
        </div>
      </header>

      {/* Main Content: centered single form */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="min-h-[60vh] flex items-start justify-center">
          <div className="w-full">
            <MultiStepAssessmentForm />
          </div>
        </div>
      </main>
    </div>
  );
};
