# Sarthi AI - Healthcare Companion

Sarthi AI is an AI-enabled healthcare assistant designed for triage, doctor matching, EHR management, and emergency protocols.

## 🚀 How to Host on Vercel (Recommended)

This is the easiest way to get your app online for free.

### Prerequisite: Get your Code on GitHub
1.  Create a new **Private Repository** on GitHub (Private is better to protect your code).
2.  Upload/Push all these project files to that repository.
    *   *Note: Do not upload a `.env` file containing your real keys. The included `.gitignore` prevents this.*

### Step 1: Connect to Vercel
1.  Go to [Vercel.com](https://vercel.com) and Sign Up/Log In.
2.  On the dashboard, click **"Add New..."** -> **"Project"**.
3.  Select **"Continue with GitHub"** and choose the repository you just created.

### Step 2: Configure Project
1.  **Framework Preset:** Vercel should automatically detect **Vite**. If not, select it.
2.  **Root Directory:** Leave as `./`

### Step 3: Add API Key (Crucial)
1.  Expand the **"Environment Variables"** section.
2.  Add the variable used by the Gemini SDK:
    *   **Key:** `API_KEY`
    *   **Value:** `your_actual_google_gemini_api_key_starting_with_AIza...`
3.  Click **Add**.

### Step 4: Deploy
1.  Click **"Deploy"**.
2.  Wait about 1 minute.
3.  Vercel will give you a live URL (e.g., `https://sarthi-ai.vercel.app`).

---

## 🛠 Local Development

To run the app on your computer:

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    API_KEY=your_actual_api_key_here
    ```

3.  **Run**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173).
