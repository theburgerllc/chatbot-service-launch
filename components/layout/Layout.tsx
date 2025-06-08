import React from 'react';
import Head from 'next/head';
import Image from 'next/image';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'AI Chatbot Solutions - 24/7 AI Assistant Service',
  description = 'Get a 24/7 AI Assistant That Converts Visitors into Paying Clients. Launch your AI chatbot in under 24 hours.'
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aichatbotsolutions.io" />
        <meta property="og:site_name" content="AI Chatbot Solutions" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AI Chatbot Solutions" />

        {/* Favicon and App Icons */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <link rel="canonical" href="https://aichatbotsolutions.io" />
      </Head>

      <div className="min-h-screen bg-background font-sans">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-3">
                <Image
                  src="/ai_chatbot_solutions_logo.png"
                  alt="AI Chatbot Solutions Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain logo-header"
                  priority
                />
                <h1 className="text-2xl font-bold text-foreground font-serif">
                  AI Chatbot Solutions
                </h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Features
                </a>
                <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Pricing
                </a>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border text-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <Image
                    src="/ai_chatbot_solutions_logo.png"
                    alt="AI Chatbot Solutions Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain logo-footer"
                  />
                  <h3 className="text-xl font-bold font-serif">AI Chatbot Solutions</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Transform your business with AI-powered customer service that works 24/7.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 font-serif">Quick Links</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                  <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 font-serif">Support</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="mailto:burger@theburgerllc.com" className="hover:text-primary transition-colors">Email Support</a></li>
                  <li><a href="tel:+13329994484" className="hover:text-primary transition-colors">Phone Support</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
              <p>&copy; 2024 AI Chatbot Solutions. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
