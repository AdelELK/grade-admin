import React from 'react';
import { useAppStore } from '../store';
import { CollectionList } from './CollectionList';
import { FileUploader } from './FileUploader';
import { DocumentList } from './DocumentList';

export const App: React.FC = () => {
  const collections = useAppStore((state) => state.collections);
  const currentCollection = useAppStore((state) => state.currentCollection);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestionnaire de Documents
          </h1>
          <p className="text-gray-500 mt-1">
            Organisez vos fichiers PDF et images en collections
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Collections */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <CollectionList
                collections={collections}
                currentCollection={currentCollection}
              />
            </div>
          </div>

          {/* Right Content - Upload and Documents */}
          <div className="lg:col-span-3 space-y-6">
            {/* File Upload Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {currentCollection && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {currentCollection.name}
                  </h2>
                  {currentCollection.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {currentCollection.description}
                    </p>
                  )}
                </div>
              )}
              <FileUploader />
            </div>

            {/* Documents Section */}
            {currentCollection && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <DocumentList documents={currentCollection.documents} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
