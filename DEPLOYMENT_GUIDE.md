# Deployment Guide - Ordering System with AI Chatbot

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free)
- OpenAI API key

### Step 1: Prepare Your Code

1. **Update API Key for Production**
   - Edit `app/api/chat/route.ts`
   - Replace the hardcoded API key with environment variable:
   ```typescript
   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   })
   ```

2. **Create Environment Variables**
   - Create `.env.local` file locally for testing
   - We'll add these to Vercel later

### Step 2: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit with AI chatbot"
   ```

2. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com)
   - Create a new repository
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/ordering-system.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy to Vercel

1. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

3. **Add Environment Variables**:
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add these variables:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)

### Step 4: Test Your Deployment

1. **Visit your Vercel URL** (e.g., `https://your-project.vercel.app`)
2. **Test the chatbot** - click the blue chat bubble
3. **Verify all features** work correctly

## 🌐 Alternative Deployment Options

### Netlify (Free Tier)

1. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"

2. **Configure Build**:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18 (or latest LTS)

3. **Add Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add the same variables as Vercel

### Railway (Free Tier)

1. **Connect to Railway**:
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub
   - Create new project from GitHub repo

2. **Configure**:
   - Auto-detects Next.js
   - Add environment variables in dashboard

## 🔧 Environment Variables Setup

### Required Variables:
```env
# OpenAI API Key (Required for AI chatbot)
OPENAI_API_KEY=sk-your-actual-openai-api-key

# Supabase (Required for database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Optional Variables:
```env
# Vercel (auto-added)
NEXT_PUBLIC_VERCEL_URL=https://your-project.vercel.app

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 📝 Pre-Deployment Checklist

- [ ] Update API key to use environment variables
- [ ] Test chatbot functionality locally
- [ ] Ensure all dependencies are in package.json
- [ ] Check that build works: `npm run build`
- [ ] Verify environment variables are ready
- [ ] Push code to GitHub

## 🚨 Important Notes

### API Key Security
- **Never commit API keys** to Git
- Use environment variables in production
- Consider using Vercel's built-in secrets management

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month, 100 serverless function executions/day
- **Netlify**: 100GB bandwidth/month, 125K function calls/month
- **Railway**: $5 credit/month (usually enough for small projects)

### Performance Optimization
- Enable Vercel's edge caching
- Use Next.js Image optimization
- Consider CDN for static assets

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables Not Working**:
   - Ensure variables are added to deployment platform
   - Restart deployment after adding variables
   - Check variable names match exactly

3. **Chatbot Not Working**:
   - Verify OpenAI API key is correct
   - Check API quota and billing
   - Test with fallback responses

4. **Database Connection Issues**:
   - Verify Supabase credentials
   - Check database permissions
   - Ensure tables are created

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **OpenAI API**: https://platform.openai.com/docs

## 🎉 Success!

Once deployed, your ordering system with AI chatbot will be available at:
- **Vercel**: `https://your-project.vercel.app`
- **Netlify**: `https://your-project.netlify.app`
- **Railway**: `https://your-project.railway.app`

Your AI chatbot will work seamlessly in production with the same fallback system for reliability! 