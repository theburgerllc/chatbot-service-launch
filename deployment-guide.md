# Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Deploy to Vercel
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your personal account
- **Link to existing project?** → No
- **Project name?** → chatbot-service-launch (or your preferred name)
- **Directory?** → ./ (current directory)
- **Override settings?** → No

### 2. Set Environment Variables

After deployment, go to your Vercel dashboard:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `AIRTABLE_API_KEY` | `pat_your_token_here` | Production |
| `AIRTABLE_BASE_ID` | `app_your_base_id_here` | Production |
| `AIRTABLE_TABLE_NAME` | `Chatbot_Requests` | Production |
| `EMAILJS_SERVICE_ID` | `your_service_id_here` | Production |
| `EMAILJS_TEMPLATE_ID` | `your_template_id_here` | Production |
| `EMAILJS_USER_ID` | `your_user_id_here` | Production |
| `SQUARE_WEBHOOK_SECRET` | `your_webhook_secret_here` | Production |

### 3. Redeploy with Environment Variables
```bash
vercel --prod
```

### 4. Custom Domain (Optional)

1. In Vercel dashboard → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed

## 🔧 Post-Deployment Checklist

- [ ] Test the form submission
- [ ] Verify Airtable integration
- [ ] Update Square subscription links
- [ ] Test API endpoints
- [ ] Check mobile responsiveness
- [ ] Set up monitoring/analytics

## 🌐 Your Live URLs

After deployment, you'll get:
- **Production URL**: `https://your-project-name.vercel.app`
- **Custom Domain**: `https://yourdomain.com` (if configured)

## 📊 Monitoring

Consider adding:
- Vercel Analytics
- Google Analytics
- Sentry for error tracking
- Uptime monitoring

## 🔄 Future Deployments

For future updates:
```bash
git add .
git commit -m "Your update message"
git push
vercel --prod
```

Or simply push to your connected Git repository for automatic deployments.
