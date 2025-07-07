/**
 * Configuration file for Sigma Smart ERP Google Apps Script
 * Contains all Google Sheets IDs and application settings
 */

// Main configuration object
const CONFIG = {
  // CORS configuration - UPDATE THIS with your actual Vercel URL
  CORS_ORIGIN: 'https://your-vercel-app.vercel.app',
  
  // Cache duration in seconds (6 hours)
  CACHE_DURATION: 21600,
  
  // API version
  API_VERSION: 'v1.0.0',
  
  // Default pagination
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 1000
};

// Google Sheets IDs for each ERP module
// These are the actual existing Google Sheets with real data
const SHEET_IDS = {
  // Financial modules
  facturi: '1tuXSfn1oBygYGBE6K-_xxRey4fT6tjCuU6qsoYrrv1A',   // Sistem_facturi
  tva: '1milALf9FugbSc7q5f1ljoET8eNSlL0I8AUPagSt4Zyg',       // Sistem_TVA
  
  // Inventory & Orders
  depozit: '1V4S9O2rl1hGedFVREYkSwR7Q2lOMg7EJrwjxNis0eSQ',    // Sistem_depozit
  comenzi: '1DWaDV6ep8ZvjslK19ItQNYv0zUxpr2xzAV-6npkgBJI',    // Sistem_comenzi
  
  // Projects & Work
  lucrari: '18wwm4PURy3iMCksv7zVzcX5Kw2z97jUpU_KMIiiSe9M',    // Sistem_lucrari
  manopera: '1yMuIj8M66ZaW0mDy21IlJX8tb9x9v8coBIbWIRZFLU8',   // Sistem_manopera
  contracte: '1dhEAVUC3NJar4pNpdFoVt_BR3lhYnmilULa8U2XWXw4',  // Sistem_HR (contracte sheet)
  
  // Contacts
  clienti: '1x0_BxwtMVw1iGxXUzu5sdgqqriXkA1VPe105Rh0egJw',     // Sistem_clienti
  furnizori: '1iyb-O8E8U8cMiEfNarkCdPvOt7BHRyQpVIEZCYYkeBE',   // Sistem_furnizori
  
  // HR & Time tracking
  angajati: '1dhEAVUC3NJar4pNpdFoVt_BR3lhYnmilULa8U2XWXw4',   // Sistem_HR (angajati sheet)
  pontaj: '1VUM97oen8jOF7BZuL-Nl-1M-98SmBSzPv8EIj_nYkCY',     // Sistem_pontaj
  
  // Cost centers
  centre_cost: '1qlG5b9HDgFIwWx0RR7moixXEuqse-ryzobjdgMggtvE'  // Sistem_centre_cost
};

// Sheet names mapping for each module
const SHEET_NAMES = {
  facturi: 'facturi_raw',
  tva: 'TVA_raw',
  depozit: 'intrari', // default tab for warehouse
  comenzi: 'comenzi_raw',
  lucrari: 'lucrari_master',
  manopera: 'manopera_raw',
  contracte: 'contracte_raw',
  pontaj: 'pontaj_log',
  clienti: 'clienti_raw',
  furnizori: 'furnizori_raw',
  centre_cost: 'centre_cost_master',
  angajati: 'angajati_raw'
};

// Module permissions configuration
const MODULE_PERMISSIONS = {
  admin: {
    all: ['read', 'write', 'delete']
  },
  manager: {
    facturi: ['read', 'write'],
    tva: ['read', 'write'],
    comenzi: ['read', 'write'],
    lucrari: ['read', 'write'],
    clienti: ['read', 'write'],
    furnizori: ['read', 'write'],
    angajati: ['read'],
    pontaj: ['read', 'write'],
    depozit: ['read', 'write'],
    manopera: ['read', 'write'],
    contracte: ['read'],
    centre_cost: ['read']
  },
  user: {
    pontaj: ['read', 'write'],
    profile: ['read', 'write']
  }
};

// Admin and manager email lists - UPDATE THESE with actual emails
const ADMIN_EMAILS = [
  'admin@sigmaerp.com',
  'manager@sigmaerp.com'
];

const MANAGER_EMAILS = [
  'manager@company.com',
  'supervisor@company.com'
];

/**
 * Get configuration value
 */
function getConfig(key) {
  return CONFIG[key];
}

/**
 * Get sheet ID for module
 */
function getSheetId(moduleName) {
  return SHEET_IDS[moduleName];
}

/**
 * Get sheet name for module
 */
function getSheetName(moduleName) {
  return SHEET_NAMES[moduleName];
}

/**
 * Check if email is admin
 */
function isAdmin(email) {
  return ADMIN_EMAILS.includes(email);
}

/**
 * Check if email is manager
 */
function isManager(email) {
  return MANAGER_EMAILS.includes(email);
}