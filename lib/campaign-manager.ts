export interface Campaign {
  id: string;
  name: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  priority: number;
}

export class CampaignManager {
  private campaigns: Campaign[] = [];

  constructor() {
    this.initializeCampaigns();
  }

  private initializeCampaigns() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    this.campaigns = [
      {
        id: 'first_month_special',
        name: 'First Month 50% Off',
        planId: 'first_month_special',
        startDate: now,
        endDate: new Date('2024-12-31'),
        isActive: process.env.NEXT_PUBLIC_ENABLE_FIRST_MONTH_PROMO === 'true',
        priority: 2
      },
      {
        id: 'today_only_special', 
        name: 'Today Only Special',
        planId: 'today_only_special',
        startDate: now,
        endDate: tomorrow,
        isActive: process.env.NEXT_PUBLIC_ENABLE_TODAY_ONLY_PROMO === 'true',
        priority: 1
      }
    ];
  }

  getActiveCampaigns(): Campaign[] {
    const now = new Date();
    return this.campaigns
      .filter(campaign => 
        campaign.isActive && 
        campaign.startDate <= now && 
        campaign.endDate >= now
      )
      .sort((a, b) => a.priority - b.priority);
  }

  getHighestPriorityCampaign(): Campaign | null {
    const active = this.getActiveCampaigns();
    return active.length > 0 ? active[0] : null;
  }

  isCampaignActive(campaignId: string): boolean {
    return this.getActiveCampaigns().some(c => c.id === campaignId);
  }

  trackCampaignInteraction(campaignId: string, action: string): void {
    // Track campaign interactions for analytics
    if (typeof window !== 'undefined') {
      // Client-side tracking
      console.log(`Campaign interaction: ${campaignId} - ${action}`);
      
      // Store interaction in session storage for analytics
      const interactions = JSON.parse(
        sessionStorage.getItem('campaignInteractions') || '[]'
      );
      
      interactions.push({
        campaignId,
        action,
        timestamp: new Date().toISOString()
      });
      
      sessionStorage.setItem('campaignInteractions', JSON.stringify(interactions));
    }
  }
}