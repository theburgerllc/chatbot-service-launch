# 🤖 Chatbot Service Launch

A complete, production-ready Next.js TypeScript web application for launching an AI chatbot service. Features a modern landing page, onboarding form, payment integration with Square, and contact form with Airtable integration.

## ✨ Features

- **Modern Landing Page**: Animated hero section with compelling copy and benefits
- **Onboarding Form**: Beautiful form with validation using react-hook-form
- **Contact Form**: Airtable-integrated contact form with automated email notifications
- **Payment Integration**: Square subscription link integration
- **API Routes**: Form submission, contact handling, and Square webhook handling
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
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your actual API keys and configuration. See the [Environment Variables](#-environment-variables) section below for detailed setup instructions.

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
│   ├── forms/
│   │   ├── ContactForm.tsx # Contact form component
│   │   ├── Form.tsx        # Onboarding form component
│   │   └── LeadCaptureForm.tsx # Lead capture form
│   └── layout/
│       └── Layout.tsx      # Shared layout component
├── pages/
│   ├── api/
│   │   ├── contact.js      # Contact form API (Airtable integration)
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

## 📞 Contact Form Setup

The application includes a fully-featured contact form that saves submissions to Airtable and triggers automated email notifications.

### 🗃️ Airtable Setup

1. **Create an Airtable Base**
   - Go to [Airtable.com](https://airtable.com) and create a new base
   - Create a table called "Contact Submissions" (or your preferred name)
   - Add the following columns:
     - `Name` (Single line text)
     - `Email` (Email)
     - `Company` (Single line text)
     - `Message` (Long text)
     - `Submitted At` (Date and time)
     - `Source` (Single line text)

2. **Get Your Personal Access Token**
   - Go to [https://airtable.com/create/tokens](https://airtable.com/create/tokens)
   - Click "Create new token"
   - Give it a name like "Contact Form Integration"
   - Add these scopes:
     - `data.records:read`
     - `data.records:write`
   - Select your base under "Access"
   - Click "Create token" and copy the token (starts with `pat`)

3. **Find Your Base ID**
   - Go to [https://airtable.com/developers/web/api/introduction](https://airtable.com/developers/web/api/introduction)
   - Select your base
   - Copy the Base ID (starts with `app`) from the URL or documentation

4. **Set Up Email Automation (Optional but Recommended)**
   - In your Airtable base, click "Automations"
   - Create a new automation
   - Trigger: "When record is created"
   - Action: "Send email"
   - Configure the email to notify you of new contact form submissions

### 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Contact Form Integration (Required for contact form)
AIRTABLE_PERSONAL_ACCESS_TOKEN=pat_xxxxxxxxxxxxxxxxxx
AIRTABLE_BASE_ID=appxxxxxxxxxxxxxxxxxx
AIRTABLE_TABLE_NAME=Contact Submissions

# Existing Variables (Keep these for other features)
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
SQUARE_ENVIRONMENT=sandbox
SQUARE_WEBHOOK_SECRET=your_square_webhook_secret_here
SQUARE_CHECKOUT_URL=your_square_checkout_url_here
SQUARE_CHECKOUT_URL_PREMIUM=your_square_checkout_url_premium_here
EMAILJS_SERVICE_ID=your_emailjs_service_id_here
EMAILJS_TEMPLATE_ID=your_emailjs_template_id_here
```

### 💻 Using the Contact Form

1. **Import the Component**
   ```tsx
   import ContactForm from '../components/forms/ContactForm';
   ```

2. **Add to Your Page**
   ```tsx
   export default function ContactPage() {
     return (
       <div className="min-h-screen bg-gray-50 py-12">
         <div className="max-w-4xl mx-auto px-4">
           <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
           <ContactForm />
         </div>
       </div>
     );
   }
   ```

3. **Testing the Integration**
   - Start your development server: `npm run dev`
   - Fill out the contact form
   - Check your Airtable base for the new record
   - Verify email automation triggers (if configured)

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
   - Go to your project settings → Environment Variables
   - Add all environment variables from `.env.local`
   - **Required for contact form:**
     - `AIRTABLE_PERSONAL_ACCESS_TOKEN`
     - `AIRTABLE_BASE_ID` 
     - `AIRTABLE_TABLE_NAME`
   - **Required for other features:**
     - `SQUARE_ENVIRONMENT`
     - `SQUARE_WEBHOOK_SECRET`
     - `SQUARE_CHECKOUT_URL`
     - All other variables from your `.env.local`

4. **Test the deployment**
   - Submit a test contact form
   - Verify data appears in Airtable
   - Check that email automation triggers

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
