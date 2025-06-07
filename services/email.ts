import { EmailTemplateData } from '@/types';

export class EmailService {
  private serviceId: string;
  private templateId: string;

  constructor() {
    this.serviceId = process.env.EMAILJS_SERVICE_ID || '';
    this.templateId = process.env.EMAILJS_TEMPLATE_ID || '';
  }

  async sendWelcomeEmail(data: EmailTemplateData): Promise<{ success: boolean; error?: string }> {
    try {
      // Implement EmailJS integration
      const emailData = {
        service_id: this.serviceId,
        template_id: this.templateId,
        user_id: process.env.EMAILJS_USER_ID,
        template_params: {
          business_name: data.businessName,
          email: data.email,
          website_url: data.websiteUrl,
          phone_number: data.phoneNumber,
          business_hours: data.businessHours,
          faqs: data.faqs.join('\n\n'),
          brand_color: data.brandColor
        }
      };

      // This would typically use EmailJS SDK in client-side code
      // For server-side, we'd use their REST API
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async sendNotificationEmail(subject: string, message: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Implement notification email logic
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}

export const emailService = new EmailService();