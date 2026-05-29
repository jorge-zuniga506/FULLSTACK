const DEFAULT_ADMIN_SECRET_DASHBOARD_PATH = '/dashboard/ops-core-7f3a9k';

const normalizeDashboardPath = (rawPath) => {
  const value = String(rawPath || '').trim();
  if (!value) return DEFAULT_ADMIN_SECRET_DASHBOARD_PATH;
  return value.startsWith('/') ? value : `/${value}`;
};

const ADMIN_SECRET_DASHBOARD_PATH = normalizeDashboardPath(
  process.env.ADMIN_SECRET_DASHBOARD_PATH
);

module.exports = {
  ADMIN_SECRET_DASHBOARD_PATH,
  DEFAULT_ADMIN_SECRET_DASHBOARD_PATH
};

