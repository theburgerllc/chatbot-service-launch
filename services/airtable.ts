import { OnboardingFormData } from '@/types';

export class AirtableService {
  private baseUrl: string;
  private apiKey: string;
  private baseId: string;

  constructor() {
    this.apiKey = process.env.AIRTABLE_API_KEY || '';
    this.baseId = process.env.AIRTABLE_BASE_ID || '';
    this.baseUrl = `https://api.airtable.com/v0/${this.baseId}`;
  }

  async createLead(formData: OnboardingFormData): Promise<{ success: boolean; recordId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/Leads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'Business Name': formData.businessName,
            'Website URL': formData.websiteUrl,
            'Email': formData.email,
            'Phone Number': formData.phoneNumber,
            'Business Hours': formData.businessHours,
            'FAQ 1': formData.faq1,
            'FAQ 2': formData.faq2,
            'FAQ 3': formData.faq3,
            'Brand Color': formData.brandColor,
            'Subscription Plan': formData.subscriptionPlan || 'standard_monthly',
            'Created At': new Date().toISOString(),
            'Status': 'New Lead'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, recordId: data.id };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error?.message || 'Failed to create lead' };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async updateLeadStatus(recordId: string, status: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/Leads/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'Status': status,
            'Updated At': new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error?.message || 'Failed to update lead' };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/Leads?maxRecords=1`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'Failed to connect to Airtable' };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}

export const airtableService = new AirtableService();