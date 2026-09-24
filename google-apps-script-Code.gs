/**
 * GUDDA FARM Website Ratings -> Google Sheets
 *
 * 1. Upload GUDDA_FARM_Website_Ratings.xlsx to Google Drive and open it with Google Sheets.
 * 2. Extensions -> Apps Script.
 * 3. Replace the default Code.gs with this file.
 * 4. Deploy -> New deployment -> Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 5. Copy the Web app URL into RATING_ENDPOINT in script.js.
 */

const SHEET_NAME = 'Ratings';

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  const headers = ['Timestamp','Rating','Name','Feedback','Page','Source','Status','Follow-up Needed','Admin Notes'];
  if (sheet.getLastRow() === 0) sheet.getRange(1,1,1,headers.length).setValues([headers]);
  return 'GUDDA FARM ratings sheet is ready.';
}

function doGet() {
  return ContentService.createTextOutput('GUDDA FARM rating endpoint is active.');
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    const headers = ['Timestamp','Rating','Name','Feedback','Page','Source','Status','Follow-up Needed','Admin Notes'];
    if (sheet.getLastRow() === 0) sheet.getRange(1,1,1,headers.length).setValues([headers]);

    const p = e && e.parameter ? e.parameter : {};
    const rating = Number(p.rating || 0);
    if (rating < 1 || rating > 5) throw new Error('Invalid rating');

    sheet.appendRow([
      new Date(),
      rating,
      String(p.name || '').slice(0,60),
      String(p.feedback || '').slice(0,500),
      String(p.page || '').slice(0,300),
      String(p.source || '').slice(0,120),
      'New',
      'No',
      ''
    ]);

    return ContentService.createTextOutput('OK');
  } catch (err) {
    return ContentService.createTextOutput('ERROR');
  }
}
