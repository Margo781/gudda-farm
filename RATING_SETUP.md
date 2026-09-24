# GUDDA FARM Website Rating → Google Sheets

The website rating form is included on all HTML pages and is ready to write to the `Ratings` sheet.

## One-time Google Sheets setup
1. Upload `GUDDA_FARM_Website_Ratings.xlsx` to Google Drive.
2. Open it with Google Sheets.
3. Open **Extensions → Apps Script**.
4. Replace the default `Code.gs` with `google-apps-script-Code.gs` from this package.
5. Run `setup` once and authorize the script.
6. Click **Deploy → New deployment → Web app**.
7. Execute as **Me**.
8. Set **Who has access** to **Anyone**.
9. Copy the Web app URL.
10. Open `script.js` and replace:
   `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`
   with your Web app URL.
11. The website package now has the deployed Web App URL already inserted in `script.js`. Upload/commit the updated website files to GitHub. Vercel will redeploy from the connected repository.

**Connected Web App:** `https://script.google.com/macros/s/AKfycbyJAUVRIWOHdLvUxCOyxj0YY7MjhdvCE1BeNYxcb6Sfywf9RNgPVm3qq2cka-qMtLWH/exec`

## Data captured
- Timestamp
- Rating (1–5)
- Name
- Feedback
- Page
- Source / UTM attribution
- Status (starts as New)
- Follow-up Needed (starts as No)
- Admin Notes

The website does not store ratings locally; the form posts them to the Google Apps Script endpoint, which appends them to the `Ratings` sheet.
