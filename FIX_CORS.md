# Fix Firebase Storage CORS Issue

The error you are seeing (`Access to XMLHttpRequest ... blocked by CORS policy`) is because Firebase Storage blocks cross-origin uploads by default.

To fix this, you need to configure CORS for your storage bucket.

## Option 1: Using Google Cloud Console (Web) - RECOMMENDED

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Select your Firebase project (`attendance-portal-b13ee`).
3.  Open the **Cloud Shell** (icon in the top right toolbar, looks like `>_`).
4.  Run the following command to create the configuration file:
    ```bash
    echo '[{"origin": ["*"],"method": ["GET", "PUT", "POST", "DELETE", "HEAD", "OPTIONS"],"maxAgeSeconds": 3600}]' > cors.json
    ```
5.  Run the following command to apply it to your bucket:
    ```bash
    gsutil cors set cors.json gs://attendance-portal-b13ee.firebasestorage.app
    ```

## Option 2: Using GSUtil locally

If you have `gsutil` or Firebase CLI installed on your computer:

1.  Open your terminal in this project folder.
2.  Run:
    ```bash
    gsutil cors set cors.json gs://attendance-portal-b13ee.firebasestorage.app
    ```

## Immediate Solution Implemented

I have updated the `EmployeeDashboard.tsx` code to **automatically skip** the image upload if it fails (due to CORS or network issues) or takes longer than 5 seconds.

**Result:**

- Attendance will **ALWAYS** be marked.
- If image upload fails, you will see a toast: "Image upload failed. Marking attendance without photo."
- You will not be blocked.
