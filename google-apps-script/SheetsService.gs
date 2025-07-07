/**
 * Google Sheets integration service
 */

/**
 * Read data from Google Sheet
 */
function readSheetData(sheetId, sheetName = null, range = null) {
  try {
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = sheetName ? spreadsheet.getSheetByName(sheetName) : spreadsheet.getActiveSheet();
    
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }
    
    // Get data range
    const dataRange = range ? sheet.getRange(range) : sheet.getDataRange();
    const values = dataRange.getValues();
    
    if (values.length === 0) {
      return [];
    }
    
    // Convert to objects using first row as headers
    const headers = values[0];
    const data = values.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
    
    return data;
    
  } catch (error) {
    console.error('Error reading sheet data:', error);
    throw error;
  }
}

/**
 * Write data to Google Sheet
 */
function writeSheetData(sheetId, sheetName, data, startRow = null) {
  try {
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }
    
    if (data.length === 0) return;
    
    // Convert objects to array format
    const headers = Object.keys(data[0]);
    const values = [headers, ...data.map(item => headers.map(header => item[header] || ''))];
    
    // Determine start position
    const startRowNum = startRow || (sheet.getLastRow() + 1);
    const range = sheet.getRange(startRowNum, 1, values.length, headers.length);
    
    range.setValues(values);
    
    return { success: true, rowsWritten: values.length };
    
  } catch (error) {
    console.error('Error writing sheet data:', error);
    throw error;
  }
}

/**
 * Update specific row in Google Sheet
 */
function updateSheetRow(sheetId, sheetName, rowData, idColumn = 'ID') {
  try {
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf(idColumn);
    
    if (idIndex === -1) {
      throw new Error(`ID column "${idColumn}" not found`);
    }
    
    // Find row to update
    const targetId = rowData[idColumn];
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex] === targetId) {
        rowIndex = i;
        break;
      }
    }
    
    if (rowIndex === -1) {
      throw new Error(`Row with ${idColumn} "${targetId}" not found`);
    }
    
    // Update row data
    const updatedRow = headers.map(header => rowData[header] || data[rowIndex][headers.indexOf(header)]);
    const range = sheet.getRange(rowIndex + 1, 1, 1, headers.length);
    range.setValues([updatedRow]);
    
    return { success: true, rowUpdated: rowIndex + 1 };
    
  } catch (error) {
    console.error('Error updating sheet row:', error);
    throw error;
  }
}

/**
 * Delete row from Google Sheet (soft delete by marking status)
 */
function deleteSheetRow(sheetId, sheetName, id, idColumn = 'ID') {
  try {
    const rowData = {};
    rowData[idColumn] = id;
    rowData['Status'] = 'DELETED';
    rowData['Data_stergere'] = new Date().toISOString();
    
    return updateSheetRow(sheetId, sheetName, rowData, idColumn);
    
  } catch (error) {
    console.error('Error deleting sheet row:', error);
    throw error;
  }
}

/**
 * Add new row to Google Sheet
 */
function addSheetRow(sheetId, sheetName, rowData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const newRow = headers.map(header => rowData[header] || '');
    
    // Add timestamp fields
    const timestamp = new Date().toISOString();
    const timestampIndex = headers.indexOf('Data_creare');
    if (timestampIndex !== -1) {
      newRow[timestampIndex] = timestamp;
    }
    
    // Add to sheet
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow + 1, 1, 1, headers.length);
    range.setValues([newRow]);
    
    return { success: true, rowAdded: lastRow + 1 };
    
  } catch (error) {
    console.error('Error adding sheet row:', error);
    throw error;
  }
}

/**
 * Get filtered data with pagination
 */
function getFilteredData(sheetId, sheetName, filters = {}, page = 1, limit = 100) {
  try {
    const data = readSheetData(sheetId, sheetName);
    
    // Apply filters
    let filteredData = data.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        const rowValue = row[key];
        if (typeof value === 'string') {
          return rowValue.toString().toLowerCase().includes(value.toLowerCase());
        }
        return rowValue === value;
      });
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      total: filteredData.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(filteredData.length / limit)
    };
    
  } catch (error) {
    console.error('Error getting filtered data:', error);
    throw error;
  }
}