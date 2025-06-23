export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN_CLIENT: '/auth/login/client',
    LOGIN_CG: '/auth/login/cg',
    REGISTER_CLIENT: '/auth/register/client',
    REGISTER_CG: '/auth/register/cg',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },
  CG: {
    IN_RANGE: '/cg/inRange',
    AVAILABLE_REQUESTS: '/cg/available-requests',
    MY_REQUESTS: '/cg/my-requests',
    ASSIGN_REQUEST: '/cg/assign-request',
  },
  REQUESTS: {
    CREATE: '/requests',
    LIST: '/requests',
    UPDATE: '/requests',
    DELETE: '/requests',
    ASSIGN_CG: '/requests/assign-cg',
    UPDATE_STATUS: '/requests/update-status',
  },
} as const;