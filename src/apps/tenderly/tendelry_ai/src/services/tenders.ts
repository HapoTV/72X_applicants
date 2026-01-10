import { mockTenders } from './mockData'
import type { Tender } from '@/types'

export interface TendersResponse {
  tenders: Tender[]
  error: string | null
  count?: number
}

export const tenderService = {
  async getTenders(
    page: number = 1,
    limit: number = 20,
    industries?: string[],
    province?: string,
    search?: string
  ): Promise<TendersResponse> {
    try {
      // Use mock data for demo purposes
      let filteredTenders = [...mockTenders]

      // Apply industry filters - support multiple industries
      if (industries && industries.length > 0) {
        filteredTenders = filteredTenders.filter(t => 
          industries.includes(t.industry_category)
        )
      }

      if (province && province !== 'all') {
        filteredTenders = filteredTenders.filter(t => t.province === province)
      }

      if (search) {
        const searchLower = search.toLowerCase()
        filteredTenders = filteredTenders.filter(t => 
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.buyer.toLowerCase().includes(searchLower)
        )
      }

      // Sort by urgency first, then by published date (newest first)
      filteredTenders.sort((a, b) => {
        const today = new Date()
        const aUrgent = new Date(a.closing_date) <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        const bUrgent = new Date(b.closing_date) <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        
        // If both are urgent or both are not urgent, sort by published date
        if (aUrgent === bUrgent) {
          return new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
        }
        
        // Urgent tenders come first
        return aUrgent ? -1 : 1
      })

      // Apply pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedTenders = filteredTenders.slice(startIndex, endIndex)

      return { 
        tenders: paginatedTenders, 
        error: null,
        count: filteredTenders.length
      }
    } catch (error) {
      return { 
        tenders: [], 
        error: error instanceof Error ? error.message : 'An error occurred' 
      }
    }
  },

  async getTenderById(tenderId: string): Promise<{ tender: Tender | null; error: string | null }> {
    try {
      // Use mock data for demo purposes
      const tender = mockTenders.find(t => t.tender_id === tenderId)
      
      if (!tender) {
        return { tender: null, error: 'Tender not found' }
      }

      return { tender, error: null }
    } catch (error) {
      return { 
        tender: null, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      }
    }
  },

  async getTendersByUserIndustries(
    page: number = 1,
    limit: number = 20
  ): Promise<TendersResponse> {
    try {
      // For demo purposes, return all tenders
      // In a real app, this would filter by user's selected industries
      return this.getTenders(page, limit)
    } catch (error) {
      return { 
        tenders: [], 
        error: error instanceof Error ? error.message : 'An error occurred' 
      }
    }
  },

  async subscribeToNotifications(userId: string): Promise<{ error: string | null }> {
    try {
      // Mock implementation
      console.log(`User ${userId} subscribed to notifications`)
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'An error occurred' }
    }
  }
}
