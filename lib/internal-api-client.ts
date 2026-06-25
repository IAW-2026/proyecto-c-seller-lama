import 'server-only';

type InternalApiService = 'shipping' | 'payments' | 'buyer';

type InternalApiConfig = {
  label: string;
  baseUrlEnvVars: string[];
  apiKeyEnvVar: string;
};

type InternalApiRequestInit = RequestInit & {
  expectedStatuses?: number[];
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 10000;

const internalApiConfigs: Record<InternalApiService, InternalApiConfig> = {
  shipping: {
    label: 'Shipping App',
    baseUrlEnvVars: ['SHIPPING_API_URL', 'SHIPPING_APP_URL'],
    apiKeyEnvVar: 'SHIPPING_API_KEY',
  },
  payments: {
    label: 'Payments App',
    baseUrlEnvVars: ['PAYMENTS_API_URL'],
    apiKeyEnvVar: 'PAYMENTS_API_KEY',
  },
  buyer: {
    label: 'Buyer App',
    baseUrlEnvVars: ['BUYER_API_URL'],
    apiKeyEnvVar: 'BUYER_API_KEY',
  },
};

export class InternalApiConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InternalApiConfigError';
  }
}

export class InternalApiRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InternalApiRequestError';
  }
}

const getFirstConfiguredEnv = (envVars: string[]) => {
  for (const envVar of envVars) {
    const value = process.env[envVar]?.trim();
    if (value) return { envVar, value };
  }

  return null;
};

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, '');

const buildEndpoint = (baseUrl: string, path: string) => {
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizeBaseUrl(baseUrl)}${normalizedPath}`;
};

const readErrorMessage = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const json = (await response
      .clone()
      .json()
      .catch(() => null)) as { error?: unknown; message?: unknown } | null;

    if (typeof json?.error === 'string') return json.error;
    if (typeof json?.message === 'string') return json.message;
  }

  return response
    .clone()
    .text()
    .then((body) => body.slice(0, 1000))
    .catch(() => '');
};

const getInternalApiConfig = (service: InternalApiService) => {
  const config = internalApiConfigs[service];
  const baseUrl = getFirstConfiguredEnv(config.baseUrlEnvVars);
  const apiKey = process.env[config.apiKeyEnvVar]?.trim();

  if (!baseUrl) {
    const message = `${config.baseUrlEnvVars.join(' o ')} no configurada`;
    console.error('Internal API config missing', {
      service,
      missing: config.baseUrlEnvVars,
    });
    throw new InternalApiConfigError(message);
  }

  if (!apiKey) {
    const message = `${config.apiKeyEnvVar} no configurada`;
    console.error('Internal API config missing', {
      service,
      missing: config.apiKeyEnvVar,
    });
    throw new InternalApiConfigError(message);
  }

  return {
    ...config,
    baseUrl: baseUrl.value,
    baseUrlEnvVar: baseUrl.envVar,
    apiKey,
  };
};

export async function callInternalApi(
  service: InternalApiService,
  path: string,
  init: InternalApiRequestInit = {}
) {
  const config = getInternalApiConfig(service);
  const endpoint = buildEndpoint(config.baseUrl, path);
  const headers = new Headers(init.headers);

  headers.set('x-api-key', config.apiKey);

  if (init.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  const controller = init.signal ? null : new AbortController();
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), init.timeoutMs ?? DEFAULT_TIMEOUT_MS)
    : null;

  try {
    const response = await fetch(endpoint, {
      ...init,
      headers,
      signal: init.signal ?? controller?.signal,
    });

    const expectedStatuses = init.expectedStatuses || [];
    const isExpectedStatus = expectedStatuses.includes(response.status);

    if (!response.ok && !isExpectedStatus) {
      const message = await readErrorMessage(response);
      console.error('Internal API response not ok', {
        service,
        endpoint,
        status: response.status,
        statusText: response.statusText,
        message,
      });
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const name = error instanceof Error ? error.name : 'UnknownError';

    console.error('Internal API request failed', {
      service,
      endpoint,
      name,
      message,
    });

    throw new InternalApiRequestError(`${config.label} request failed`);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export const callShippingApi = (path: string, init?: InternalApiRequestInit) =>
  callInternalApi('shipping', path, init);

export const callPaymentsApi = (path: string, init?: InternalApiRequestInit) =>
  callInternalApi('payments', path, init);

export const callBuyerApi = (path: string, init?: InternalApiRequestInit) =>
  callInternalApi('buyer', path, init);
