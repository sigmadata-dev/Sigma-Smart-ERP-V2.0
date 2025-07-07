import { getAuthToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SheetConfig {
  id: string;
  name: string;
  range?: string;
}

export const SHEET_CONFIGS: Record<string, SheetConfig> = {
  facturi: {
    id: '1tuXSfn1oBygYGBE6K-_xxRey4fT6tjCuU6qsoYrrv1A',
    name: 'facturi_raw',
  },
  tva: {
    id: '1milALf9FugbSc7q5f1ljoET8eNSlL0I8AUPagSt4Zyg',
    name: 'TVA_raw',
  },
  depozit: {
    id: '1V4S9O2rl1hGedFVREYkSwR7Q2lOMg7EJrwjxNis0eSQ',
    name: 'depozit',
  },
  comenzi: {
    id: '1DWaDV6ep8ZvjslK19ItQNYv0zUxpr2xzAV-6npkgBJI',
    name: 'comenzi_raw',
  },
  lucrari: {
    id: '18wwm4PURy3iMCksv7zVzcX5Kw2z97jUpU_KMIiiSe9M',
    name: 'lucrari_master',
  },
  manopera: {
    id: '1yMuIj8M66ZaW0mDy21IlJX8tb9x9v8coBIbWIRZFLU8',
    name: 'manopera_raw',
  },
  contracte: {
    id: '1dhEAVUC3NJar4pNpdFoVt_BR3lhYnmilULa8U2XWXw4',
    name: 'contracte_raw',
  },
  pontaj: {
    id: '1VUM97oen8jOF7BZuL-Nl-1M-98SmBSzPv8EIj_nYkCY',
    name: 'pontaj_log',
  },
  clienti: {
    id: '1x0_BxwtMVw1iGxXUzu5sdgqqriXkA1VPe105Rh0egJw',
    name: 'clienti_raw',
  },
  furnizori: {
    id: '1iyb-O8E8U8cMiEfNarkCdPvOt7BHRyQpVIEZCYYkeBE',
    name: 'furnizori_raw',
  },
  centre_cost: {
    id: '1qlG5b9HDgFIwWx0RR7moixXEuqse-ryzobjdgMggtvE',
    name: 'centre_cost_master',
  },
  angajati: {
    id: '1dhEAVUC3NJar4pNpdFoVt_BR3lhYnmilULa8U2XWXw4',
    name: 'angajati_raw',
  },
};

export const apiRequest = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API request failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Module-specific API functions
export const getModuleData = async (module: string, filters?: Record<string, unknown>) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      params.append(key, String(value));
    });
  }
  
  const endpoint = `/api/${module}?${params.toString()}`;
  return apiRequest(endpoint);
};

export const getDashboardKPIs = async () => {
  return apiRequest('/api/dashboard/kpi');
};

export const getRecentActivities = async (limit: number = 10) => {
  return apiRequest(`/api/dashboard/activities?limit=${limit}`);
};

// Specific module functions
export const getFacturi = () => getModuleData('facturi');
export const getTVA = () => getModuleData('tva');
export const getDepozit = () => getModuleData('depozit');
export const getComenzi = () => getModuleData('comenzi');
export const getLucrari = () => getModuleData('lucrari');
export const getManopera = () => getModuleData('manopera');
export const getContracte = () => getModuleData('contracte');
export const getPontaj = () => getModuleData('pontaj');
export const getClienti = () => getModuleData('clienti');
export const getFurnizori = () => getModuleData('furnizori');
export const getCentreCost = () => getModuleData('centre-cost');
export const getAngajati = () => getModuleData('angajati');