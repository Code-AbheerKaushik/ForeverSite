const rawUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
export const API_BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
