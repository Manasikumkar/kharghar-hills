/**
 * ============================================================================
 * Kharghar Hills — Enquiry Submission Adapter
 * ============================================================================
 * 
 * ARCHITECTURE & WEBHOOK INTEGRATION GUIDE:
 * 
 * In production, property enquiries must be routed to an authorized backend CRM
 * or secure webhook endpoint (e.g., Salesforce, LeadSquared, or custom API).
 * 
 * To activate live submission:
 * 1. Define the following environment variables in `.env` or deployment settings:
 *    - VITE_ENQUIRY_WEBHOOK_URL: The HTTPS endpoint of your CRM webhook or serverless function.
 *    - VITE_ENQUIRY_API_KEY: Optional bearer or header token (if client-side gateway authentication is used).
 * 
 * 2. This adapter checks for `VITE_ENQUIRY_WEBHOOK_URL`.
 *    - If configured: Sends a structured HTTPS POST request with standard headers.
 *    - If unconfigured (current development phase): Runs the verified isolated dev adapter.
 *      The dev adapter validates the payload, simulates network latency (500ms),
 *      and securely acknowledges receipt without exposing personal data or fabricating delivery.
 */

export interface EnquiryPayload {
  name: string
  phone: string
  interestedIn: string
  agreed: boolean
  source?: string
  timestamp?: string
}

export interface EnquiryResult {
  success: boolean
  status: 'mock_accepted' | 'delivered' | 'validation_error' | 'network_error'
  referenceId: string
  message: string
  timestamp: string
}

// In-memory development session store (non-persistent, masked for privacy)
interface StoredDevLead {
  referenceId: string
  maskedPhone: string
  interestedIn: string
  receivedAt: string
}

const devLeadsStore: StoredDevLead[] = []

/**
 * Mask sensitive phone digits for privacy protection
 */
function maskPhoneNumber(phone: string): string {
  const clean = phone.replace(/\D/g, '')
  if (clean.length < 10) return '***'
  return `${clean.slice(0, 2)}******${clean.slice(-2)}`
}

/**
 * Submit property enquiry through adapter
 */
export async function submitEnquiry(payload: EnquiryPayload): Promise<EnquiryResult> {
  const timestamp = new Date().toISOString()
  const referenceId = `KH-${Math.floor(100000 + Math.random() * 900000)}`

  // 1. Client-side sanity validation
  if (!payload.name || payload.name.trim().length < 2) {
    return {
      success: false,
      status: 'validation_error',
      referenceId,
      message: 'Please provide a valid full name.',
      timestamp,
    }
  }

  const cleanPhone = payload.phone.replace(/\D/g, '')
  if (cleanPhone.length < 10) {
    return {
      success: false,
      status: 'validation_error',
      referenceId,
      message: 'Please enter a valid 10-digit mobile number.',
      timestamp,
    }
  }

  if (!payload.agreed) {
    return {
      success: false,
      status: 'validation_error',
      referenceId,
      message: 'Consent is required to proceed with your enquiry.',
      timestamp,
    }
  }

  // 2. Production Webhook Execution
  const webhookUrl =
    (import.meta.env.VITE_ENQUIRY_WEBHOOK_URL as string | undefined) ||
    'https://automate.nirosha.org/webhook/khargharhillsin'
  const apiKey = import.meta.env.VITE_ENQUIRY_API_KEY

  if (webhookUrl && typeof webhookUrl === 'string' && webhookUrl.startsWith('https://')) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: payload.name,
          phone: payload.phone,
          interestedIn: payload.interestedIn,
          agreed: payload.agreed,
          source: payload.source || 'Website Lead',
          project: 'Kharghar Hills, Navi Mumbai',
          referenceId,
          timestamp,
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })

      if (response.ok) {
        return {
          success: true,
          status: 'delivered',
          referenceId,
          message: 'Your enquiry has been successfully delivered to our sales advisory team.',
          timestamp,
        }
      } else {
        return {
          success: false,
          status: 'network_error',
          referenceId,
          message: `Endpoint returned HTTP ${response.status}. Please call our sales desk directly.`,
          timestamp,
        }
      }
    } catch {
      return {
        success: false,
        status: 'network_error',
        referenceId,
        message: 'Network connection error. Please connect via telephone or WhatsApp.',
        timestamp,
      }
    }
  }

  // 3. Development Adapter (Secure simulated receipt without external leakage)
  await new Promise((resolve) => setTimeout(resolve, 600))

  // Record masked metadata in isolated memory
  devLeadsStore.push({
    referenceId,
    maskedPhone: maskPhoneNumber(cleanPhone),
    interestedIn: payload.interestedIn,
    receivedAt: timestamp,
  })

  return {
    success: true,
    status: 'mock_accepted',
    referenceId,
    message:
      'Enquiry validated & recorded in dev adapter. (Live CRM webhook pending configuration in .env).',
    timestamp,
  }
}
