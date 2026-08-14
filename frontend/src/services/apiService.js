import { localApi } from './localStorageAdapter';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3007';

const AUTH_401_EVENT = 'auth:unauthorized';

const unwrapNestedData = (value) => {
  let current = value;

  while (
    current &&
    typeof current === 'object' &&
    !Array.isArray(current) &&
    Object.prototype.hasOwnProperty.call(current, 'data') &&
    Object.keys(current).length === 1
  ) {
    current = current.data;
  }

  return current;
};

const unpackResponse = (result) => {
  if (result && typeof result === 'object' && 'status' in result && 'data' in result) {
    return { ...result, data: unwrapNestedData(result.data) };
  }
  return { status: 'success', message: 'Operación realizada con éxito.', data: unwrapNestedData(result), meta: {} };
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

const requestJson = async (endpoint, method = 'GET', data = null, params = {}, options = {}) => {
  try {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params && typeof params === 'object') {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          url.searchParams.append(key, params[key]);
        }
      });
    }

    const init = {
      ...options,
      method,
      credentials: 'include',
      headers: buildHeaders(options.token, method !== 'GET' && !(data instanceof FormData))
    };

    if (data && method !== 'GET') {
      init.body = data instanceof FormData ? data : JSON.stringify(data);
    }

    const response = await fetch(url.toString(), init);
    const raw = await response.json().catch(() => ({}));
    const result = unpackResponse(raw);

    if (response.status === 401) {
      handleUnauthorized();
    }

    if (!response.ok) {
      throw new Error(result.message || 'Error en la solicitud.');
    }

    return result;
  } catch (err) {
    console.warn(`Petición API a ${endpoint} falló (${err.message}). Ejecutando consulta en localStorageAdapter:`);
    const localResult = localApi.dispatch(method, endpoint, data, params);
    return unpackResponse(localResult);
  }
};

export const apiService = {
  AUTH_401_EVENT,

  async getAll(endpoint, params = {}, token) {
    return requestJson(endpoint, 'GET', null, params, { token });
  },

  async getOne(endpoint, token) {
    return requestJson(endpoint, 'GET', null, {}, { token });
  },

  async create(endpoint, data, token) {
    return requestJson(endpoint, 'POST', data, {}, { token });
  },

  async update(endpoint, id, data, token) {
    const fullEndpoint = id ? `${endpoint}/${id}` : endpoint;
    return requestJson(fullEndpoint, 'PUT', data, {}, { token });
  },

  async patch(endpoint, id, data, token) {
    const fullEndpoint = id ? `${endpoint}/${id}` : endpoint;
    return requestJson(fullEndpoint, 'PATCH', data, {}, { token });
  },

  async delete(endpoint, id, token) {
    const fullEndpoint = id ? `${endpoint}/${id}` : endpoint;
    return requestJson(fullEndpoint, 'DELETE', null, {}, { token });
  }
};
