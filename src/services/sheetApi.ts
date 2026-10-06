import { SheetResponse } from '../types';

const BASE_API_URL = 'https://script.google.com/macros/s/AKfycbxk6lpb3kDEq3xp9HdLekqwkF0uJ5cimOmd0iYjZP0g8KakzYrT38E_-LnHKPC-r_OW/exec';

// Cache to prevent repetitive requests on pagination switches
const responseCache = new Map<string, SheetResponse>();
let categoriesCache: string[] | null = null;

export async function fetchCategories(forceRefresh = false): Promise<string[]> {
  if (!forceRefresh && categoriesCache && categoriesCache.length > 0) {
    return categoriesCache;
  }

  const url = `${BASE_API_URL}?sheet=tweets&action=sheets`;
  const response = await fetch(url, { redirect: 'follow' });

  if (!response.ok) {
    throw new Error(`Failed to load categories: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Unexpected format received for sheet categories.');
  }

  categoriesCache = data;
  return data;
}

export async function fetchMessages(
  sheet: string,
  page: number = 1,
  limit: number = 12,
  forceRefresh = false
): Promise<SheetResponse> {
  const cacheKey = `${sheet}_${page}_${limit}`;

  if (!forceRefresh && responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey)!;
  }

  const url = `${BASE_API_URL}?sheet=${encodeURIComponent(sheet)}&page=${page}&limit=${limit}`;
  const response = await fetch(url, { redirect: 'follow' });

  if (!response.ok) {
    throw new Error(`Failed to load messages for "${sheet}": ${response.status} ${response.statusText}`);
  }

  const data: SheetResponse = await response.json();

  if (typeof data === 'object' && data !== null && 'data' in data) {
    // Normalise fields
    const safeData: SheetResponse = {
      success: data.success ?? true,
      total: Number(data.total) || (Array.isArray(data.data) ? data.data.length : 0),
      page: Number(data.page) || page,
      limit: Number(data.limit) || limit,
      data: Array.isArray(data.data) ? data.data : []
    };
    responseCache.set(cacheKey, safeData);
    return safeData;
  }

  throw new Error('Malformed API response format from Google Apps Script.');
}

export function clearSheetCache() {
  responseCache.clear();
  categoriesCache = null;
}
