# AgroPulse

A production-grade, highly polished web application designed to empower farmers with real-time crop prices, meteorological forecasting, professional expert advisory, peer-to-peer discussion lounges, and intelligent crop scheduling calculators.

## 🚀 Technology Stack
*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Tailwind CSS & Vanilla CSS
*   **Database/Auth**: Supabase (PostgreSQL & GoTrue Auth)
*   **Meteorology API**: OpenWeather API
*   **Analytics/Data Vis**: Recharts
*   **Internationalization**: i18next & react-i18next (English, Hindi, Marathi, Punjabi, Tamil, Telugu, Bengali, Gujarati)

---

## 🛠️ Local Setup Instructions

1. Install Dependencies:
```bash
npm install
```

2. Configure Environment Variables:
Duplicate `.env.local.example` to `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start Development Server:
```bash
npm run dev
```

---

## 🔒 Production Deployment (Vercel & Supabase)

If deploying to Vercel, the authentication system **requires** manual configuration in the dashboards. Code changes alone are not enough.

### 1. Vercel Environment Variables
You must add the Supabase URL and Anon Key to your Vercel project, otherwise the Edge Middleware will crash with a 500 Server Error.
1. Go to **Vercel Dashboard -> Project Settings -> Environment Variables**.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Redeploy the project for the changes to take effect in the Edge Runtime.

### 2. Supabase URL Configuration (CRITICAL for Google OAuth)
For Google OAuth and Email Verification links to work in production, Supabase must know your deployed Vercel URL.
1. Go to **Supabase Dashboard -> Authentication -> URL Configuration**.
2. Set the **Site URL** to your Vercel production URL (e.g., `https://agropulse-project-1.vercel.app`).
3. Add `https://agropulse-project-1.vercel.app/*` to the **Redirect URLs** list. 
   *(Failure to do this will result in Google OAuth silently failing or redirecting to localhost).*

### 3. Supabase Email Confirmation
If you disabled "Confirm Email" in Supabase for testing, you can re-enable it in **Authentication -> Providers -> Email** once your Redirect URLs are configured correctly.
