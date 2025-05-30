# 🤖 Chatbot Service Launch

A complete, production-ready Next.js TypeScript web application for launching an AI chatbot service. Features a modern landing page, onboarding form, and payment integration with Square.

## ✨ Features

- **Modern Landing Page**: Animated hero section with compelling copy and benefits
- **Onboarding Form**: Beautiful form with validation using react-hook-form
- **Payment Integration**: Square subscription link integration
- **API Routes**: Form submission and Square webhook handling
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **SEO Optimized**: Meta tags and structured data for search engines

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chatbot-service-launch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your actual API keys and configuration.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
chatbot-service-launch/
├── components/
│   ├── Layout.tsx          # Shared layout component
│   └── Form.tsx            # Onboarding form component
├── pages/
│   ├── api/
│   │   ├── submit.ts       # Form submission API
│   │   └── square.ts       # Square webhook handler
│   ├── _app.tsx            # App wrapper
│   ├── _document.tsx       # Custom document
│   ├── index.tsx           # Landing page
│   └── success.tsx         # Success confirmation page
├── styles/
│   └── globals.css         # Global styles with Tailwind
├── types/
│   └── index.ts            # TypeScript interfaces
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── next.config.js          # Next.js configuration
└── vercel.json            # Vercel deployment config
```

## 🎨 Customization

### Update Square Subscription Link

1. Replace `https://square.link/u/YOUR-LINK` in `pages/index.tsx` with your actual Square subscription link
2. Update the pricing information in the pricing section

### Customize Branding

1. Update the business name and logo in `components/Layout.tsx`
2. Modify colors in `tailwind.config.js`
3. Update meta tags and SEO information in `components/Layout.tsx`

### Configure Integrations

1. **Airtable**: Uncomment and configure the Airtable integration in `pages/api/submit.ts`
2. **EmailJS**: Set up email notifications for form submissions
3. **Square Webhooks**: Configure webhook signature verification in `pages/api/square.ts`

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
AIRTABLE_TABLE_NAME=Chatbot_Requests

# EmailJS Configuration
EMAILJS_SERVICE_ID=your_emailjs_service_id_here
EMAILJS_TEMPLATE_ID=your_emailjs_template_id_here
EMAILJS_USER_ID=your_emailjs_user_id_here

# Square Configuration
SQUARE_WEBHOOK_SECRET=your_square_webhook_secret_here
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard**
   - Go to your project settings
   - Add all environment variables from `.env.local`

### Deploy to Other Platforms

The application can also be deployed to:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 📊 Analytics & Monitoring

Consider adding:
- Google Analytics
- Hotjar for user behavior
- Sentry for error monitoring
- Vercel Analytics

## 🔒 Security

- Environment variables are properly configured
- API routes include input validation
- CORS headers are configured
- Webhook signature verification is ready to implement

## 🧪 Testing

To run tests (when implemented):
```bash
npm run test
```

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, email support@chatbotlaunch.com or create an issue in this repository.
# chatbot-service-launch
