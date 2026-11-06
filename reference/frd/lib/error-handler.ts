export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'DATABASE_ERROR'
  | 'UNKNOWN_ERROR';

export interface DetailedError {
  code: ErrorCode;
  message: string;
  details?: string;
  field?: string;
  timestamp: string;
}

const errorMessages = {
  fr: {
    VALIDATION_ERROR: "Les données saisies ne sont pas valides",
    NETWORK_ERROR: "Erreur de connexion réseau",
    SERVER_ERROR: "Une erreur serveur est survenue",
    UNAUTHORIZED: "Vous n'êtes pas autorisé à accéder à cette ressource",
    NOT_FOUND: "La ressource demandée n'existe pas",
    CONFLICT: "Un conflit s'est produit lors de l'opération",
    DATABASE_ERROR: "Une erreur base de données est survenue",
    UNKNOWN_ERROR: "Une erreur inattendue s'est produite",
  },
  en: {
    VALIDATION_ERROR: "The submitted data is invalid",
    NETWORK_ERROR: "Network connection error",
    SERVER_ERROR: "A server error occurred",
    UNAUTHORIZED: "You are not authorized to access this resource",
    NOT_FOUND: "The requested resource was not found",
    CONFLICT: "A conflict occurred during the operation",
    DATABASE_ERROR: "A database error occurred",
    UNKNOWN_ERROR: "An unexpected error occurred",
  },
};

const errorDetails = {
  fr: {
    VALIDATION_ERROR: "Veuillez vérifier que tous les champs obligatoires sont correctement remplis",
    NETWORK_ERROR: "Vérifiez votre connexion Internet et réessayez",
    SERVER_ERROR: "Veuillez réessayer plus tard ou contacter le support",
    UNAUTHORIZED: "Veuillez vous connecter et essayer à nouveau",
    NOT_FOUND: "Vérifiez l'adresse ou l'identifiant et réessayez",
    CONFLICT: "Une ressource avec les mêmes données existe déjà",
    DATABASE_ERROR: "Une erreur technique est survenue. Veuillez réessayer",
    UNKNOWN_ERROR: "Une erreur technique inattendue s'est produite",
  },
  en: {
    VALIDATION_ERROR: "Please check that all required fields are correctly filled",
    NETWORK_ERROR: "Check your internet connection and try again",
    SERVER_ERROR: "Please try again later or contact support",
    UNAUTHORIZED: "Please log in and try again",
    NOT_FOUND: "Check the address or ID and try again",
    CONFLICT: "A resource with the same data already exists",
    DATABASE_ERROR: "A technical error occurred. Please try again",
    UNKNOWN_ERROR: "An unexpected technical error occurred",
  },
};

export function createDetailedError(
  code: ErrorCode,
  lang: 'fr' | 'en' = 'en',
  overrides?: {
    message?: string;
    details?: string;
    field?: string;
  }
): DetailedError {
  const messages = errorMessages[lang];
  const details = errorDetails[lang];

  return {
    code,
    message: overrides?.message || messages[code],
    details: overrides?.details || details[code],
    field: overrides?.field,
    timestamp: new Date().toISOString(),
  };
}

export function formatErrorForDisplay(error: DetailedError): string {
  let formatted = error.message;

  if (error.field) {
    formatted += ` (${error.field})`;
  }

  if (error.details) {
    formatted += ` - ${error.details}`;
  }

  return formatted;
}

export function parseApiError(
  response: Response,
  data: any,
  lang: 'fr' | 'en' = 'en'
): DetailedError {
  // Handle validation errors
  if (response.status === 400) {
    if (data.errors && Array.isArray(data.errors)) {
      const firstError = data.errors[0];
      return createDetailedError('VALIDATION_ERROR', lang, {
        message: firstError.message || errorMessages[lang].VALIDATION_ERROR,
        field: firstError.field || firstError.path?.[0],
        details: data.message || errorDetails[lang].VALIDATION_ERROR,
      });
    }
    return createDetailedError('VALIDATION_ERROR', lang, {
      message: data.message,
      details: data.details,
    });
  }

  // Handle unauthorized
  if (response.status === 401) {
    return createDetailedError('UNAUTHORIZED', lang);
  }

  // Handle not found
  if (response.status === 404) {
    return createDetailedError('NOT_FOUND', lang, {
      details: data.message,
    });
  }

  // Handle conflict
  if (response.status === 409) {
    return createDetailedError('CONFLICT', lang, {
      details: data.message,
    });
  }

  // Handle server errors
  if (response.status >= 500) {
    return createDetailedError('SERVER_ERROR', lang, {
      details: data.message || data.error,
    });
  }

  // Handle other errors
  return createDetailedError('UNKNOWN_ERROR', lang, {
    message: data.message,
    details: data.details,
  });
}

export function parseNetworkError(
  error: Error,
  lang: 'fr' | 'en' = 'en'
): DetailedError {
  return createDetailedError('NETWORK_ERROR', lang, {
    details: error.message,
  });
}
