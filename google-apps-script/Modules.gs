/**
 * Module-specific request handlers
 */

/**
 * Handle generic module operations
 */
function handleModule(method, moduleName, params, user) {
  try {
    // Check permissions
    const operation = method === 'GET' ? 'read' : 'write';
    if (!checkPermission(user, moduleName, operation)) {
      return { data: { error: 'Insufficient permissions' }, status: 403 };
    }
    
    const sheetId = SHEET_IDS[moduleName];
    if (!sheetId) {
      return { data: { error: 'Module not configured' }, status: 404 };
    }
    
    switch (method) {
      case 'GET':
        return getModuleData(sheetId, moduleName, params);
      case 'POST':
        return createModuleData(sheetId, moduleName, params, user);
      case 'PUT':
        return updateModuleData(sheetId, moduleName, params, user);
      case 'DELETE':
        return deleteModuleData(sheetId, moduleName, params, user);
      default:
        return { data: { error: 'Method not allowed' }, status: 405 };
    }
    
  } catch (error) {
    console.error(`Module ${moduleName} error:`, error);
    return { data: { error: error.toString() }, status: 500 };
  }
}

/**
 * Get module data with filtering and pagination
 */
function getModuleData(sheetId, moduleName, params) {
  const page = parseInt(params.page || '1');
  const limit = parseInt(params.limit || '50');
  const filters = {};
  
  // Extract filter parameters
  Object.keys(params).forEach(key => {
    if (!['page', 'limit', 'path', 'token', '_method'].includes(key)) {
      filters[key] = params[key];
    }
  });
  
  const result = getFilteredData(sheetId, getSheetName(moduleName), filters, page, limit);
  return { data: result, status: 200 };
}

/**
 * Create new module data
 */
function createModuleData(sheetId, moduleName, params, user) {
  // Add audit fields
  params.Data_creare = new Date().toISOString();
  params.Creat_de = user.email;
  
  // Generate ID if needed
  if (!params.ID && !params[`ID_${moduleName}`]) {
    params[`ID_${moduleName.slice(0, -1)}`] = generateId(moduleName);
  }
  
  const result = addSheetRow(sheetId, getSheetName(moduleName), params);
  return { data: result, status: 201 };
}

/**
 * Update existing module data
 */
function updateModuleData(sheetId, moduleName, params, user) {
  // Add audit fields
  params.Data_modificare = new Date().toISOString();
  params.Modificat_de = user.email;
  
  const idField = getIdField(moduleName);
  const result = updateSheetRow(sheetId, getSheetName(moduleName), params, idField);
  return { data: result, status: 200 };
}

/**
 * Delete module data (soft delete)
 */
function deleteModuleData(sheetId, moduleName, params, user) {
  const id = params.id;
  const idField = getIdField(moduleName);
  
  const result = deleteSheetRow(sheetId, getSheetName(moduleName), id, idField);
  return { data: result, status: 200 };
}

/**
 * Handle dashboard requests
 */
function handleDashboard(method, subPath, params, user) {
  if (method !== 'GET') {
    return { data: { error: 'Method not allowed' }, status: 405 };
  }
  
  switch (subPath) {
    case 'kpi':
      return getDashboardKPIs(user);
    case 'activities':
      return getRecentActivities(user, params.limit || 10);
    default:
      return { data: { error: 'Dashboard endpoint not found' }, status: 404 };
  }
}

/**
 * Get dashboard KPIs
 */
function getDashboardKPIs(user) {
  try {
    const kpis = {
      totalRevenue: calculateTotalRevenue(),
      totalInvoices: getTotalInvoices(),
      activeEmployees: getActiveEmployees(),
      inventoryValue: getInventoryValue(),
      activeProjects: getActiveProjects(),
      pendingOrders: getPendingOrders(),
      revenueChange: 12.5, // Mock data
      invoicesChange: -2.3 // Mock data
    };
    
    return { data: kpis, status: 200 };
    
  } catch (error) {
    console.error('Dashboard KPIs error:', error);
    return { data: { error: error.toString() }, status: 500 };
  }
}

/**
 * Handle special depot module with sub-sheets
 */
function handleDepozit(method, subPath, params, user) {
  const operation = method === 'GET' ? 'read' : 'write';
  if (!checkPermission(user, 'depozit', operation)) {
    return { data: { error: 'Insufficient permissions' }, status: 403 };
  }
  
  const sheetId = SHEET_IDS.depozit;
  let sheetName = 'intrari'; // default
  
  if (subPath === 'iesiri') {
    sheetName = 'iesiri';
  } else if (subPath === 'sumar') {
    sheetName = 'sumar';
  }
  
  switch (method) {
    case 'GET':
      return getModuleData(sheetId, 'depozit', { ...params, _sheetName: sheetName });
    default:
      return { data: { error: 'Method not supported for depot' }, status: 405 };
  }
}

/**
 * Utility functions
 */
function getSheetName(moduleName) {
  const sheetNames = {
    facturi: 'facturi_raw',
    tva: 'TVA_raw',
    depozit: 'intrari', // default
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
  
  return sheetNames[moduleName] || moduleName + '_raw';
}

function getIdField(moduleName) {
  return `ID_${moduleName === 'centre_cost' ? 'centru_cost' : moduleName.slice(0, -1)}`;
}

function generateId(moduleName) {
  const prefix = moduleName.toUpperCase().substring(0, 3);
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  return `${prefix}-${timestamp}${random}`;
}

// KPI calculation functions (mock implementations)
function calculateTotalRevenue() {
  try {
    const factури = readSheetData(SHEET_IDS.facturi, 'facturi_raw');
    return factури.reduce((sum, invoice) => sum + (parseFloat(invoice.Valoare_RON) || 0), 0);
  } catch (error) {
    return 2450000; // Mock data
  }
}

function getTotalInvoices() {
  try {
    const factури = readSheetData(SHEET_IDS.facturi, 'facturi_raw');
    return factури.filter(invoice => invoice.Status !== 'DELETED').length;
  } catch (error) {
    return 234; // Mock data
  }
}

function getActiveEmployees() {
  try {
    const angajati = readSheetData(SHEET_IDS.angajati, 'angajati_raw');
    return angajati.filter(emp => emp.Status === 'ACTIV').length;
  } catch (error) {
    return 45; // Mock data
  }
}

function getInventoryValue() {
  try {
    const stoc = readSheetData(SHEET_IDS.depozit, 'sumar');
    return stoc.reduce((sum, item) => sum + (parseFloat(item.Valoare_stoc) || 0), 0);
  } catch (error) {
    return 180000; // Mock data
  }
}

function getActiveProjects() {
  try {
    const lucrari = readSheetData(SHEET_IDS.lucrari, 'lucrari_master');
    return lucrari.filter(project => project.Status === 'ACTIV').length;
  } catch (error) {
    return 12; // Mock data
  }
}

function getPendingOrders() {
  try {
    const comenzi = readSheetData(SHEET_IDS.comenzi, 'comenzi_raw');
    return comenzi.filter(order => order.Status_comanda === 'In asteptare').length;
  } catch (error) {
    return 28; // Mock data
  }
}

function getRecentActivities(user, limit) {
  // Mock implementation - in real scenario, read from audit logs
  const activities = [
    {
      id: '1',
      type: 'invoice',
      description: 'New invoice created',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'success'
    },
    {
      id: '2',
      type: 'order',
      description: 'Order completed',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'success'
    }
  ];
  
  return { data: activities.slice(0, limit), status: 200 };
}

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  var params = e && e.parameter ? e.parameter : {};
  var path = params.path || '';
  var user = null; // Poți adăuga validare token aici dacă vrei

  // Exemplu de rutare simplă pentru /api/clienti
  if (path.indexOf('api/clienti') === 0 || path === 'api/clienti') {
    var result = handleModule(method, 'clienti', params, user);
    return ContentService.createTextOutput(JSON.stringify(result.data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  // TODO: Adaugă și alte rute pentru celelalte module

  // Default: 404
  return ContentService.createTextOutput(JSON.stringify({ error: 'Not found' }))
    .setMimeType(ContentService.MimeType.JSON);
}