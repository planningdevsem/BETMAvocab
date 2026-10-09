/**
 * Nhận thông tin đăng ký từ website BETMA Vocabulary Lab và ghi vào Google Sheet.
 * Dán vào Extensions > Apps Script của CHÍNH file Google Sheet cần thu dữ liệu.
 */
var SHEET_NAME = 'Đăng ký';
var HEADERS = ['Thời gian', 'Họ và tên', 'Số điện thoại', 'Email', 'Sinh viên năm', 'Mã người dùng', 'Nguồn'];

function clean_(v, max) {
  v = String(v == null ? '' : v).trim().slice(0, max || 200);
  // Chống chèn công thức vào Sheet
  if (/^[=+\-@]/.test(v) && !/^\+?\d[\d\s.\-()]*$/.test(v)) v = "'" + v;
  return v;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var d = JSON.parse(e.postData.contents);
    var name = clean_(d.name, 100), phone = clean_(d.phone, 20), email = clean_(d.email, 100);
    if (!name || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return out_('invalid');
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#D3222B').setFontColor('#ffffff');
      sh.getRange('C:C').setNumberFormat('@'); // giữ số 0 đầu của số điện thoại
    }
    sh.appendRow([new Date(), name, phone, email, clean_(d.year, 50), clean_(d.id, 40), clean_(d.source, 100)]);
    return out_('ok');
  } catch (err) {
    return out_('error');
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out_('BETMA Vocabulary Lab endpoint is running'); }
function out_(s) { return ContentService.createTextOutput(s); }
