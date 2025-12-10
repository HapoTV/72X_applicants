import { useState, useEffect } from 'react'
import { Loader2, TrendingUp, Calendar, Building, MapPin } from 'lucide-react'
import { Header, Sidebar, TenderCard } from '@/components/domain'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { tenderService } from '@/services/tenders'
import type { Tender } from '@/types'

export function DashboardPage() {
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

  useEffect(() => {
    loadTenders()
  }, [currentPage, selectedIndustries, selectedProvince, searchQuery, showUrgentOnly, showSavedOnly])

  const loadTenders = async () => {
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
  }

  const handleSignOut = () => {
    // No auth needed, just redirect to home
    window.location.href = '/'
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
    window.location.href = `/tender/${tenderId}`
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
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">
                Welcome to TenderlyAI!
              </h1>
              <p className="text-gray-600 dark:text-dark-textSecondary">
                Here's what's happening in the tender marketplace today
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="dark:bg-dark-card dark:border-dark-border cursor-pointer hover:shadow-md transition-shadow" onClick={handleShowAllTenders}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-dark-text">Total Tenders</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground dark:text-dark-textSecondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-dark-text">{stats.totalTenders}</div>
                  <p className="text-xs text-muted-foreground dark:text-dark-textSecondary">
                    {!showUrgentOnly && !showSavedOnly ? 'Showing all' : 'Click to show all'}
                  </p>
                </CardContent>
              </Card>

              <Card className="dark:bg-dark-card dark:border-dark-border cursor-pointer hover:shadow-md transition-shadow" onClick={handleShowSavedOnly}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-dark-text">Saved Tenders</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground dark:text-dark-textSecondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-dark-text">{stats.savedCount}</div>
                  <p className="text-xs text-muted-foreground dark:text-dark-textSecondary">
                    {showSavedOnly ? 'Showing saved' : 'Click to view saved'}
                  </p>
                </CardContent>
              </Card>

              <Card className="dark:bg-dark-card dark:border-dark-border cursor-pointer hover:shadow-md transition-shadow" onClick={handleShowUrgentOnly}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-dark-text">Urgent</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground dark:text-dark-textSecondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600 dark:text-dark-text">{stats.urgentTenders}</div>
                  <p className="text-xs text-muted-foreground dark:text-dark-textSecondary">
                    {showUrgentOnly ? 'Showing urgent' : 'Closing within 7 days'}
                  </p>
                </CardContent>
              </Card>

              <Card className="dark:bg-dark-card dark:border-dark-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-dark-text">Categories</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground dark:text-dark-textSecondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-dark-text">14</div>
                  <p className="text-xs text-muted-foreground dark:text-dark-textSecondary">
                    Industry categories
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tender Feed */}
            <Card className="dark:bg-dark-card dark:border-dark-border">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="dark:text-dark-text">Tender Feed</CardTitle>
                    <CardDescription className="dark:text-dark-textSecondary">
                      Latest opportunities matching your criteria
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {totalCount > 0 && (
                      <Badge variant="secondary" className="dark:bg-dark-accent dark:text-dark-text">
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
                      <Loader2 className="h-8 w-8 animate-spin dark:text-dark-text" />
                    </div>
                  ) : tenders.length === 0 ? (
                    <div className="text-center py-12">
                      <Building className="h-12 w-12 text-gray-400 dark:text-dark-textSecondary mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">No tenders found</h3>
                      <p className="text-gray-500 dark:text-dark-textSecondary mb-4">
                        Try adjusting your filters or check back later for new opportunities.
                      </p>
                      <Button onClick={handleClearFilters} variant="outline" className="dark:border-dark-border dark:text-dark-text">
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
                            className="dark:border-dark-border dark:text-dark-text"
                          >
                            Previous
                          </Button>
                          <span className="text-sm text-gray-600 dark:text-dark-textSecondary">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="dark:border-dark-border dark:text-dark-text"
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
