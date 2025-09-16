# Finish Authority Revenue Toolkit (No-Coding Steps)

This folder contains ready-to-use files that replace Manus with Netlify Functions.

## 1) Add Files to Your GitHub Repo (Web UI)

1. Open your GitHub repo for the site (the one Netlify deploys).
2. Click **Add file → Upload files**.
3. Upload these files (preserving folders):
   - `netlify/functions/generate-copy.js`
   - `netlify/functions/gap-analysis.js`
   - `src/components/MarketingCopyGenerator.jsx` (replace existing)
   - `src/components/Dashboard.jsx` (replace existing)
4. Commit to the branch Netlify deploys (usually `main`).

## 2) Add Your OpenAI Key in Netlify

1. Netlify → **Site settings → Environment variables**.
2. Add variable:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** your OpenAI API key
3. Save.

## 3) Test On Your Live Site

- In **Marketing Copy**, click **Generate AI-Powered Copy** → should produce content.
- In **Gap Analysis**, click **Run Gap Analysis** → should show modal.

If errors:
- Check **Netlify → Deploys → Logs** for messages.
- Verify `OPENAI_API_KEY` spelling and value.

## What Changed

- The app now calls secure **Netlify Functions** instead of Manus to talk to GPT and analyze content.
- No servers to manage; all lives with your site code.
