import type { Assessment } from './store';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
}

interface CreateAssessmentResponse {
  assessment: {
    id: string | number;
    title: string;
    description?: string | null;
    metadata?: Record<string, unknown> | null;
    status?: string;
    created_at?: string | null;
    updated_at?: string | null;
  };
}

const getApiUrl = () => {
  if (!apiUrl) {
    throw new Error("La variable VITE_API_URL n'est pas configurée.");
  }

  return apiUrl;
};

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload
        ? String(payload.error)
        : `Erreur API (${response.status})`;
    throw new Error(message);
  }

  return payload as T;
};

export const createAssessment = async (name: string, description?: string) => {
  const response = await fetch(`${getApiUrl()}/assessment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description: description ?? '',
    }),
  });

  const payload = await parseJsonResponse<CreateAssessmentResponse>(response);
  const apiAssessment = payload.assessment;

  if (
    !apiAssessment ||
    apiAssessment.id === undefined ||
    apiAssessment.id === null ||
    !apiAssessment.title
  ) {
    throw new Error("L'API n'a pas retourné un assessment valide.");
  }

  const assessment: Assessment = {
    id: String(apiAssessment.id),
    title: apiAssessment.title,
    description: apiAssessment.description ?? undefined,
    metadata: apiAssessment.metadata ?? undefined,
    status: apiAssessment.status,
    createdAt: apiAssessment.created_at
      ? new Date(apiAssessment.created_at)
      : undefined,
    updatedAt: apiAssessment.updated_at
      ? new Date(apiAssessment.updated_at)
      : undefined,
  };

  return assessment;
};

export const uploadAssessmentFile = async (file: File) => {
  const contentType = file.type || 'application/octet-stream';
  const query = new URLSearchParams({
    filename: file.name,
    contentType,
  });
  const response = await fetch(`${getApiUrl()}/presigned-url?${query.toString()}`);
  const { uploadUrl, key } = await parseJsonResponse<PresignedUrlResponse>(response);

  if (!uploadUrl) {
    throw new Error("L'API n'a pas retourné d'URL présignée.");
  }

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Échec de l'envoi du fichier vers S3 (${uploadResponse.status}).`);
  }

  return key;
};
