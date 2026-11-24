# Publish the NAU IDEA Lab website from the lab PC

**For Sam or the lab staff member with write access to the NAU website folder.** GitHub holds the source, Google Apps Script runs the order queue and email service, and the NAU web share serves the exported website. Complete the Google setup before building the public release. Budget time to test one order with a staff-controlled mailbox.

## 1. Get the release

Use a Windows PC with Git, Node.js 22.12 or newer with npm, access to the lab Google account, and write access to the NAU destination below. Open Command Prompt. For a first installation, run:

```bat
cd /d "%USERPROFILE%\Documents"
git clone https://github.com/GustavoYup2005/idea-lab-site.git
cd idea-lab-site
```

For an existing checkout, open Command Prompt in that checkout and run:

```bat
git status --short
git pull --ff-only
```

Preserve local changes if Git reports a conflict. Record the output of `git rev-parse --short HEAD` with the launch date.

## 2. Connect Google Sheets and email

1. Sign in as the lab Google account that will own the triggers and send mail. Open the **existing private order queue spreadsheet** and choose **Extensions → Apps Script**. For a first installation, create a private queue spreadsheet under that account. It needs edit access to all eight printer response workbooks and the Material Costs workbook. Keep the private queue and its script restricted to authorized staff.
2. In that bound project, copy the complete contents of **Code.gs**, **Rates.gs**, **Worksheets.gs**, and **PriceEmail.gs** from `backend/apps-script/` into files of the same names. Update existing files in place. Preserve unrelated scripts. For an existing deployment, record its current version before the update.
3. For a first installation, obtain the private `StaffSetup.local.gs` from the setup PC through the lab's approved private channel. It is deliberately excluded from GitHub. Copy it into the private script project and run `configureStaffPassword` and `configureWorkbooks`. On an existing installation, verify the properties below and preserve current credentials and workbook mappings unless a change is intended.
4. Alternatively, enter the following under **Project Settings → Script properties**. Obtain the password and actual workbook IDs from the lab manager. A workbook ID is the segment between `/d/` and `/edit` in its Google Sheets URL.

   | Property | Value |
   | --- | --- |
   | `STAFF_PASSWORD` | The lab manager's current password |
   | `PRICE_BOOK` | ID of the Material Costs workbook containing **Team print pricing** |
   | `SOURCE_BOOKS` | A JSON object mapping each printer's response workbook ID to its exact machine name, as shown below |
   | `TRACKING_URL` | `https://ce.nau.edu/me/idealab/orders/` |

   Replace every placeholder key in this example with a distinct workbook ID.

   ```json
   {
     "X1C_WORKBOOK_ID": "X1C Bambu Lab",
     "H2D_WORKBOOK_ID": "H2D Bambu Lab",
     "H2S_WORKBOOK_ID": "H2S Bambu Lab",
     "LASER_WORKBOOK_ID": "Xtool P3",
     "J35_WORKBOOK_ID": "Stratasys J35",
     "FORMLABS_WORKBOOK_ID": "Formlabs",
     "FORTUS_WORKBOOK_ID": "Fortus 450mc",
     "MARKFORGED_WORKBOOK_ID": "Markforged II"
   }
   ```

   The **Bambu Lab A1 is exclusively for student take-home checkout**. Its loan form stays outside the print queue.
5. Save the project and run **setup** while the queue spreadsheet is bound. Review and authorize its Sheets, triggers, and mail permissions using the lab account. Confirm the queue contains **IDEA Orders**, including the worksheet quote and email receipt columns. In **Triggers**, confirm each source workbook has one `recordSubmission` form-submit trigger and one `intakeEditedRows` edit trigger. Existing material tables, semester tabs, and form destinations stay in place.
6. For an existing web app, choose **Deploy → Manage deployments → Edit → New version → Deploy** to keep its URL. For a first deployment, choose **Deploy → New deployment → Web app**. Execute as the lab account. The public student tracker requires a deployment that accepts requests from signed-out visitors. Use **Anyone** if allowed by campus policy. If it is unavailable, have the campus Google Workspace administrator resolve access before launch.
7. Copy the deployed web app URL ending in **/exec**. The website bundles this URL at build time. In the repository root beside `package.json`, create or update **.env.local** with this single setting, preserving any unrelated settings:

   ```dotenv
   NEXT_PUBLIC_ORDERS_API_URL=https://script.google.com/macros/s/REPLACE_WITH_DEPLOYMENT_ID/exec
   ```

   On Windows, `notepad .env.local` from the repository folder opens the correct file. Use `dir /a .env.local` to check its name. Keep the staff password and private setup script outside the website export.

## 3. Build and copy to NAU

1. Open the authorized NAU folder in File Explorer before building. If Windows cannot open it, use the lab PC/account with access or contact campus IT.
2. Double-click **launch-nau.bat** in the checkout. It pulls the site, installs locked dependencies with `npm ci`, and runs `npm run build:nau`. Wait for **Build finished**. A failed build can leave an older export on disk.
3. The launcher opens the **out** folder and the destination. Confirm the new export contains `index.html`, `_next`, and the folders `lab-admin`, `orders`, `submit`, and `borrow`, each with an `index.html`.
4. Save a copy of the currently deployed site outside the served folder for rollback. Select **everything inside out** and copy it into:

   ```text
   \\arshares.ucc.nau.edu\Web\ce.nau.edu\me\idealab
   ```

   Replace the corresponding website files. The destination must contain `idealab\index.html` directly. Leave unrelated campus files intact. Only the contents of the static export belong on the web share.
5. Open the [public homepage](https://ce.nau.edu/me/idealab/) in a fresh browser window. Confirm the layout, images, and links load. Follow the acceptance check below before announcing the launch.

## 4. Verify on the actual public site

Use a staff-controlled test email and an identifiable test order. Manual creation and form submission can send a tracking email immediately.

| Check | Expected result |
| --- | --- |
| Open the [manager queue](https://ce.nau.edu/me/idealab/lab-admin/) and sign in | The private queue loads. Choose a printer and semester. **Open the live Google Sheet** opens the matching tab. |
| Add a test order for the X1C and the staff test email | A tracking code appears. The order is recorded in the queue and its printer worksheet. |
| Enter PLA, a model weight such as 18.5 g, and a cost such as $12.50 in the website worksheet editor | The corresponding Google Sheet cells update. Change the weight in Sheets and click **Refresh worksheet** on the website to verify the return direction. Use each printer's displayed units. |
| Preview the price email on the tracked order | Verify the recipient, printer, material/usage, price, tracking code, and link. Click **Send price confirmation** for the staff test address and verify the delivered message. |
| Open the link from the email in a signed-out window | Enter the code and matching email. Verify the price and status. Change status in the manager queue and look up the order again. |
| Check the [submission page](https://ce.nau.edu/me/idealab/submit/) and [A1 checkout](https://ce.nau.edu/me/idealab/borrow/) | The A1 routes to the student take-home loan form. |
| Verify automatic intake for a printer | Submit a clearly identified test through its existing Google Form using the staff test address. Verify exactly one queue entry and its tracking email. Mark test orders Cancelled when finished. |

## Troubleshooting and updates

- **Tracking is awaiting activation** — verify `.env.local` contains the real **/exec** URL. Rebuild and copy the fresh export. Changing the file after a build has no effect on files already on the share.
- **Queue unavailable or Google sign-in redirect** — check Apps Script deployment access, execute-as account, and **Executions** for errors. Verify that the deployed version contains all four source files and that the lab account can edit each workbook.
- **Missing rows or fields** — check the printer-to-workbook map, selected semester, and actual header row. Refresh the worksheet. A row needs a student email to create a trackable order. A worksheet's explicit print cost takes priority over its calculated pricing total.
- **Email failure or uncertain delivery** — check Apps Script **Executions**, account mail quota, the test mailbox, and queue receipt columns before retrying. An unchanged confirmed price email is deduplicated. The initial tracking email and the later price confirmation have separate receipts.
- **Blank page or missing assets after copying** — verify `_next` and the route directories were copied beside `index.html`. Use the NAU build command, which exports for `/me/idealab/`.
- **Local rehearsal** — in the repository, run `npm ci` and `npm run test:lab`, then open `http://127.0.0.1:3184/lab-admin`. Use the private setup file or a local `LAB_TEST_PASSWORD`. This preview uses in-memory orders and a test email outbox. Local X1C STL slicing also requires Bambu Studio on that Windows PC. The public static site can import sliced plate weights; automatic server-side STL slicing requires a separately hosted slicer.
- **Rollback** — restore the previously saved website files. If the backend change caused the issue, edit the existing Apps Script deployment to select its previous version. Preserve queue records, student uploads, and pricing data.

For subsequent releases, pull the repository, update and redeploy Apps Script when its files change, run setup for schema or trigger updates, rebuild with the production URL, copy the new export, and repeat the acceptance check.
