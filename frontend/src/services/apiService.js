const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3007';

const AUTH_401_EVENT = 'auth:unauthorized';

const unpackResponse = (result) => {
  if (result && typeof result === 'object' && 'status' in result && 'data' in result) {
    return result;
  }
  return { status: 'success', message: 'Operacion realizada con exito.', data: result, meta: {} };
};

const resolveToken = (token) => token || localStorage.getItem('token') || null;

const buildHeaders = (token, isJson = true) => {
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  const authToken = resolveToken(token);
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  return headers;
};

const handleUnauthorized = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('isRoleVerified');
  window.dispatchEvent(new Event(AUTH_401_EVENT));
};

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, { ...options, credentials: 'include' });
  const raw = await response.json().catch(() => ({}));
  const result = unpackResponse(raw);

  if (response.status === 401) {
    handleUnauthorized();
  }

  if (!response.ok) {
    throw new Error(result.message || 'Error en la solicitud.');
  }

  return result;
};

export const apiService = {
  AUTH_401_EVENT,

  async getAll(endpoint, params = {}, token) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key]);
      }
    });

    return requestJson(url.toString(), {
      method: 'GET',
      headers: buildHeaders(token)
    });
  },

  async getOne(endpoint, token) {
    return requestJson(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: buildHeaders(token)
    });
  },

  async create(endpoint, data, token) {
    return requestJson(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: buildHeaders(token),
      body: JSON.stringify(data)
    });
  },

  async update(endpoint, id, data, token) {
    return requestJson(`${API_BASE_URL}${endpoint}/${id}`, {
      method: 'PUT',
      headers: buildHeaders(token),
      body: JSON.stringify(data)
    });
  },

  async delete(endpoint, id, token) {
    return requestJson(`${API_BASE_URL}${endpoint}/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(token, false)
    });
  }
};
