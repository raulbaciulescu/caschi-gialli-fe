export const API_CONFIG = {
  // BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://caschigialli-e9bccpd4eafxewb7.westeurope-01.azurewebsites.net',
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
    PROFILE: '/auth/session',
    UPDATE_PROFILE: '/profile',
    DELETE_ACCOUNT: '/delete-account',
  },
  CG: {
    IN_RANGE: '/cg/inRange',
    PROFILE: '/cg/profile',
  },
  REQUESTS: {
    CREATE: '/requests',
    LIST: '/requests',
    UPDATE: '/requests',
    DELETE: '/requests',
    ASSIGN_CG: '/requests/assign-cg',
    UPDATE_STATUS: '/requests/update-status',
    AVAILABLE_FOR_CG: '/requests/available-for-cg',
    MY_CG_REQUESTS: '/requests/my-cg-requests',
    ASSIGN_TO_REQUEST: '/requests/assign-to-request',
  },
  CHAT: {
    LIST: '/chat',
    MESSAGES: '/chat/{chatId}/messages',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/{notificationId}/read',
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: '/notifications/{notificationId}',
    PREFERENCES: '/notifications/preferences',
    PUSH_SUBSCRIBE: '/notifications/push-subscribe',
    PUSH_UNSUBSCRIBE: '/notifications/push-unsubscribe',
  },
} as const;