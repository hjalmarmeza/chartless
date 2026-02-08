// CHART LESS: SISTEMA DE ACCESO PRIVADO
// ID de la Hoja de Google Sheets CORRECTA
const SHEET_ID = "16ieJnTt7pwJsJ61fHbj6CIUbfJlZg7zjtTMzTv9AaEo"; 

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  const params = e.parameter || {};
  const action = params.action;
  const accessKey = params.key;
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // Acción para validar acceso
  if (action === "validate_access") {
    let sheet = ss.getSheetByName("Acceso_ChartLess");
    if (!sheet) {
      // Si la hoja no existe, la creamos con un valor por defecto
      sheet = ss.insertSheet("Acceso_ChartLess");
      sheet.appendRow(["Key", "Status"]);
      sheet.appendRow(["PAZ2025", "Activo"]); // Código de ejemplo inicial
    }
    
    const data = sheet.getDataRange().getValues();
    let isValid = false;
    
    // Buscamos la llave en la columna A
    for (let i = 1; i < data.length; i++) {
      const rowKey = String(data[i][0]).trim();
      const rowStatus = String(data[i][1]).trim().toLowerCase();
      
      // Solo validamos si la fila tiene datos reales
      if (rowKey !== "" && accessKey && accessKey !== "") {
        if (rowKey.toUpperCase() === accessKey.toUpperCase() && rowStatus === "activo") {
          isValid = true;
          break;
        }
      }
    }
    
    return response({ status: isValid ? "success" : "denied" });
  }

  return response({ status: "error", message: "Acción no reconocida" });
}

function response(d) {
  return ContentService.createTextOutput(JSON.stringify(d)).setMimeType(ContentService.MimeType.JSON);
}
