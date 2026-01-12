import { useState, useEffect, useCallback } from 'react'
import { Loader2, TrendingUp, Calendar, Building, MapPin } from 'lucide-react'
import { Header } from '../../components/tenderly/Header'
import { Sidebar } from '../../components/tenderly/Sidebar'
import { TenderCard } from '../../components/tenderly/TenderCard'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { tenderService } from '../../services/tenderly/tenders'
import type { Tender } from '../../types/tenderly'

export default function TenderlyAI() {
  const [loading, setLoading] = useState(true)
  const [tenders, setTenders] = useState<Tender[]>([])
  const [allTenders, setAllTenders] = useState<Tender[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [savedTenders, setSavedTenders] = useState<string[]>([])
  const [showUrgentOnly, setShowUrgentOnly] = useState(false)
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  
  // Filter states
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [selectedProvince, setSelectedProvince] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Load saved tenders from localStorage
    const saved = localStorage.getItem('savedTenders')
    if (saved) {
      setSavedTenders(JSON.parse(saved))
    }
  }, [])

  const itemsPerPage = 20

  const loadTenders = useCallback(async () => {
    setLoading(true)
    
    try {
      const tendersResult = await tenderService.getTenders(
        currentPage,
        itemsPerPage,
        selectedIndustries.length > 0 ? selectedIndustries : undefined,
        selectedProvince !== 'all' ? selectedProvince : undefined,
        searchQuery
      )

      if (tendersResult.tenders) {
        // Store all tenders for stats calculation
        setAllTenders(tendersResult.tenders)
        
        let filteredTenders = tendersResult.tenders

        // Apply urgent filter if active
        if (showUrgentOnly) {
          const today = new Date()
          filteredTenders = filteredTenders.filter(t => 
            new Date(t.closing_date) <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          )
        }

        // Apply saved filter if active
        if (showSavedOnly) {
          filteredTenders = filteredTenders.filter(t => savedTenders.includes(t.tender_id))
        }

        setTenders(filteredTenders)
        setTotalCount(tendersResult.count || 0)
      }
    } catch (error) {
      console.error('Error loading tenders:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage, searchQuery, selectedIndustries, selectedProvince, showSavedOnly, showUrgentOnly, savedTenders])

  useEffect(() => {
    loadTenders()
  }, [loadTenders])

  const handleSignOut = () => {
    // No auth needed, just redirect to dashboard
    window.location.href = '/dashboard'
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedIndustries([])
    setSelectedProvince('all')
    setSearchQuery('')
    setShowUrgentOnly(false)
    setShowSavedOnly(false)
    setCurrentPage(1)
  }

  const handleViewDetails = (tenderId: string) => {
    // In a real app, this would navigate to a detail page
    console.log('View tender details:', tenderId)
  }

  const handleSaveTender = (tenderId: string) => {
    let updatedSavedTenders: string[]
    if (savedTenders.includes(tenderId)) {
      updatedSavedTenders = savedTenders.filter(id => id !== tenderId)
    } else {
      updatedSavedTenders = [...savedTenders, tenderId]
    }
    
    setSavedTenders(updatedSavedTenders)
    localStorage.setItem('savedTenders', JSON.stringify(updatedSavedTenders))
  }

  const handleShowUrgentOnly = () => {
    setShowUrgentOnly(!showUrgentOnly)
    setShowSavedOnly(false)
    setCurrentPage(1)
  }

  const handleShowSavedOnly = () => {
    setShowSavedOnly(!showSavedOnly)
    setShowUrgentOnly(false)
    setCurrentPage(1)
  }

  const handleShowAllTenders = () => {
    setShowUrgentOnly(false)
    setShowSavedOnly(false)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const getStats = () => {
    const today = new Date()
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Calculate stats from allTenders (unfiltered)
    const totalTenders = allTenders.length
    const thisWeekTenders = allTenders.filter(t => new Date(t.published_date) >= thisWeek).length
    const thisMonthTenders = allTenders.filter(t => new Date(t.published_date) >= thisMonth).length
    const urgentTenders = allTenders.filter(t => new Date(t.closing_date) <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)).length
    const savedCount = savedTenders.length

    return { totalTenders, thisWeekTenders, thisMonthTenders, urgentTenders, savedCount }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={null}
        onSearch={handleSearch}
        onSignOut={handleSignOut}
        notificationCount={0}
      />

      <div className="flex">
        <Sidebar
          selectedIndustries={selectedIndustries}
          selectedProvince={selectedProvince}
          searchQuery={searchQuery}
          onIndustriesChange={setSelectedIndustries}
          onProvinceChange={setSelectedProvince}
          onSearchChange={handleSearch}
          onClearFilters={handleClearFilters}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to TenderlyAI!
              </h1>
              <p className="text-gray-600">
                Here's what's happening in the tender marketplace today
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleShowAllTenders}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tenders</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTenders}</div>
                  <p className="text-xs text-muted-foreground">
                    {!showUrgentOnly && !showSavedOnly ? 'Showing all' : 'Click to show all'}
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleShowSavedOnly}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saved Tenders</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.savedCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {showSavedOnly ? 'Showing saved' : 'Click to view saved'}
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleShowUrgentOnly}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Urgent</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.urgentTenders}</div>
                  <p className="text-xs text-muted-foreground">
                    {showUrgentOnly ? 'Showing urgent' : 'Closing within 7 days'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">14</div>
                  <p className="text-xs text-muted-foreground">
                    Industry categories
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tender Feed */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Tender Feed</CardTitle>
                    <CardDescription>
                      Latest opportunities matching your criteria
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {totalCount > 0 && (
                      <Badge variant="secondary">
                        {totalCount} total tenders
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : tenders.length === 0 ? (
                    <div className="text-center py-12">
                      <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tenders found</h3>
                      <p className="text-gray-500 mb-4">
                        Try adjusting your filters or check back later for new opportunities.
                      </p>
                      <Button onClick={handleClearFilters} variant="outline">
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-4">
                        {tenders.map((tender) => (
                          <TenderCard
                            key={tender.tender_id}
                            tender={tender}
                            onViewDetails={handleViewDetails}
                            onSaveTender={handleSaveTender}
                            isSaved={savedTenders.includes(tender.tender_id)}
                          />
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-6">
                          <Button
                            variant="outline"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
