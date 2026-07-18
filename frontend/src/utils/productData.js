import { API_BASE_URL } from '../config';

const CACHE_TTL_MS = 2 * 60 * 1000;
const CACHE_PREFIX = 'foreverbuy:catalog:';
const memoryCache = new Map();
const inFlightRequests = new Map();
const prefetchedImages = new Map();

const cacheKey = (key) => `${CACHE_PREFIX}${key}`;

function readCache(key) {
  const now = Date.now();
  let entry = memoryCache.get(key);

  if (!entry && typeof window !== 'undefined') {
    try {
      entry = JSON.parse(window.sessionStorage.getItem(cacheKey(key)));
      if (entry) memoryCache.set(key, entry);
    } catch {
      // Storage is optional; the in-memory cache still works.
    }
  }

  return entry && now - entry.savedAt < CACHE_TTL_MS ? entry.data : null;
}

function indexProduct(product) {
  if (!product?._id) return;
  const entry = { data: product, savedAt: Date.now() };
  const key = `product:${product._id}`;
  memoryCache.set(key, entry);

  try {
    window.sessionStorage.setItem(cacheKey(key), JSON.stringify(entry));
  } catch {
    // Ignore unavailable or full session storage.
  }
}

function writeCache(key, data) {
  const entry = { data, savedAt: Date.now() };
  memoryCache.set(key, entry);

  try {
    window.sessionStorage.setItem(cacheKey(key), JSON.stringify(entry));
  } catch {
    // Ignore unavailable or full session storage.
  }

  (Array.isArray(data) ? data : [data]).forEach(indexProduct);
  return data;
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  const payload = await response.json();
  return payload.data;
}

function fetchCached(key, request) {
  const cached = readCache(key);
  if (cached) return Promise.resolve(cached);
  if (inFlightRequests.has(key)) return inFlightRequests.get(key);

  const requestPromise = request()
    .then((data) => writeCache(key, data))
    .finally(() => inFlightRequests.delete(key));

  inFlightRequests.set(key, requestPromise);
  return requestPromise;
}

export const getCachedProduct = (id) => readCache(`product:${id}`);
export const getCachedLatestProducts = () => readCache('latest');
export const getCachedBestSellerProducts = () => readCache('bestsellers');

function collectionCacheKey({ cat = [], sub = [], searchtxt = '' } = {}) {
  return `collection:${JSON.stringify({
    cat: [...cat].sort(),
    sub: [...sub].sort(),
    searchtxt: searchtxt.trim().toLowerCase(),
  })}`;
}

export const getCachedCollectionProducts = (filters) => readCache(collectionCacheKey(filters));

export function invalidateProductCatalog() {
  [...memoryCache.keys()].forEach((key) => {
    if (key === 'latest' || key === 'bestsellers' || key.startsWith('collection:') || key.startsWith('product:')) {
      memoryCache.delete(key);
    }
  });

  try {
    Object.keys(window.sessionStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => window.sessionStorage.removeItem(key));
  } catch {
    // Storage is optional; clearing the memory cache is sufficient.
  }
}

export function getLatestProducts() {
  return fetchCached('latest', () => fetchJson(`${API_BASE_URL}/products/getlatest`));
}

export function getBestSellerProducts() {
  return fetchCached('bestsellers', () => fetchJson(`${API_BASE_URL}/products/getbestseller`));
}

export function getCollectionProducts({ cat = [], sub = [], searchtxt = '' } = {}) {
  const normalizedFilters = {
    cat: [...cat].sort(),
    sub: [...sub].sort(),
    searchtxt: searchtxt.trim().toLowerCase(),
  };
  const key = collectionCacheKey(normalizedFilters);

  return fetchCached(key, () => fetchJson(`${API_BASE_URL}/products/filtered`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizedFilters),
  }));
}

export function getProductById(id) {
  const cached = getCachedProduct(id);
  if (cached) return Promise.resolve(cached);
  return fetchCached(`product:${id}`, () => fetchJson(`${API_BASE_URL}/products/getitem/${id}`));
}

export function preloadImages(urls, limit = 6) {
  urls.filter(Boolean).slice(0, limit).forEach((url) => {
    const src = url.trim();
    if (!src || prefetchedImages.has(src)) return;

    const image = new Image();
    image.decoding = 'async';
    image.src = src;
    prefetchedImages.set(src, image);
  });
}
