const DEFAULT_ADMIN_SECRET_DASHBOARD_PATH = '/dashboard/ops-core-7f3a9k';

const normalizePath = (rawPath) => {
  const value = String(rawPath || '').trim();
  if (!value) return DEFAULT_ADMIN_SECRET_DASHBOARD_PATH;
  return value.startsWith('/') ? value : `/${value}`;
};

export const ADMIN_SECRET_DASHBOARD_PATH = normalizePath(
  import.meta.env.VITE_ADMIN_SECRET_DASHBOARD_PATH
);

