/**
 * Google Analytics utility functions for tracking events and conversions
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

class Analytics {
  private isEnabled(): boolean {
    return typeof window !== 'undefined' && typeof window.gtag === 'function';
  }

  /**
   * Track page views
   */
  public trackPageView(page_title: string, page_location: string): void {
    if (!this.isEnabled()) return;

    window.gtag('config', 'G-TCGBSDRS1K', {
      page_title,
      page_location,
      custom_map: {
        'dimension1': 'user_type',
        'dimension2': 'service_category',
        'dimension3': 'city'
      }
    });
  }

  /**
   * Track custom events
   */
  public trackEvent(event: AnalyticsEvent): void {
    if (!this.isEnabled()) return;

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters
    });
  }

  /**
   * Track user registration
   */
  public trackRegistration(userType: 'client' | 'cg', method: string = 'email'): void {
    this.trackEvent({
      action: 'sign_up',
      category: 'engagement',
      label: userType,
      custom_parameters: {
        method,
        user_type: userType
      }
    });
  }

  /**
   * Track user login
   */
  public trackLogin(userType: 'client' | 'cg', method: string = 'email'): void {
    this.trackEvent({
      action: 'login',
      category: 'engagement',
      label: userType,
      custom_parameters: {
        method,
        user_type: userType
      }
    });
  }

  /**
   * Track service search
   */
  public trackServiceSearch(category: string, city: string, resultsCount: number): void {
    this.trackEvent({
      action: 'search',
      category: 'services',
      label: `${category}_${city}`,
      value: resultsCount,
      custom_parameters: {
        search_term: category,
        city: city,
        results_count: resultsCount,
        service_category: category
      }
    });
  }

  /**
   * Track CG contact
   */
  public trackCGContact(cgId: string, cgName: string, contactMethod: 'chat' | 'phone'): void {
    this.trackEvent({
      action: 'contact_cg',
      category: 'conversion',
      label: contactMethod,
      custom_parameters: {
        cg_id: cgId,
        cg_name: cgName,
        contact_method: contactMethod
      }
    });
  }

  /**
   * Track service request creation
   */
  public trackServiceRequestCreated(category: string, city: string): void {
    this.trackEvent({
      action: 'create_service_request',
      category: 'conversion',
      label: category,
      custom_parameters: {
        service_category: category,
        city: city
      }
    });
  }

  /**
   * Track job assignment (for CGs)
   */
  public trackJobAssignment(requestId: string, category: string): void {
    this.trackEvent({
      action: 'job_assigned',
      category: 'cg_engagement',
      label: category,
      custom_parameters: {
        request_id: requestId,
        service_category: category
      }
    });
  }

  /**
   * Track job completion
   */
  public trackJobCompletion(requestId: string, category: string): void {
    this.trackEvent({
      action: 'job_completed',
      category: 'conversion',
      label: category,
      custom_parameters: {
        request_id: requestId,
        service_category: category
      }
    });
  }

  /**
   * Track profile views
   */
  public trackProfileView(cgId: string, viewerType: 'client' | 'cg' | 'anonymous'): void {
    this.trackEvent({
      action: 'view_profile',
      category: 'engagement',
      label: viewerType,
      custom_parameters: {
        cg_id: cgId,
        viewer_type: viewerType
      }
    });
  }

  /**
   * Track chat messages
   */
  public trackChatMessage(chatId: string, messageType: 'text' | 'image'): void {
    this.trackEvent({
      action: 'send_message',
      category: 'communication',
      label: messageType,
      custom_parameters: {
        chat_id: chatId,
        message_type: messageType
      }
    });
  }

  /**
   * Track SEO page visits
   */
  public trackSEOPageVisit(service: string, city: string, source: 'direct' | 'search' | 'footer'): void {
    this.trackEvent({
      action: 'seo_page_visit',
      category: 'seo',
      label: `${service}_${city}`,
      custom_parameters: {
        service_category: service,
        city: city,
        traffic_source: source
      }
    });
  }

  /**
   * Track conversions (when user contacts CG from SEO page)
   */
  public trackSEOConversion(service: string, city: string, cgId: string): void {
    this.trackEvent({
      action: 'seo_conversion',
      category: 'conversion',
      label: `${service}_${city}`,
      custom_parameters: {
        service_category: service,
        city: city,
        cg_id: cgId
      }
    });
  }

  /**
   * Set user properties
   */
  public setUserProperties(userId: string, userType: 'client' | 'cg', city?: string): void {
    if (!this.isEnabled()) return;

    window.gtag('config', 'G-TCGBSDRS1K', {
      user_id: userId,
      custom_map: {
        'dimension1': 'user_type',
        'dimension2': 'user_city'
      }
    });

    window.gtag('event', 'set_user_properties', {
      user_type: userType,
      user_city: city || 'unknown'
    });
  }
}

export const analytics = new Analytics();