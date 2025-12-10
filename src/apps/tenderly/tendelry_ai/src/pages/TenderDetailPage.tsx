import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Building, 
  ExternalLink, 
  Download, 
  Share2, 
  Bookmark,
  Clock,
  Tag,
  FileText,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { tenderService } from '@/services/tenders'
import type { Tender } from '@/types'

export function TenderDetailPage() {
  const { tenderId } = useParams<{ tenderId: string }>()
  const navigate = useNavigate()
  
  const [tender, setTender] = useState<Tender | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savedTenders, setSavedTenders] = useState<string[]>([])

  useEffect(() => {
    // Load saved tenders from localStorage
    const saved = localStorage.getItem('savedTenders')
    if (saved) {
      setSavedTenders(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (tenderId) {
      loadTender(tenderId)
    }
  }, [tenderId])

  const loadTender = async (id: string) => {
    setLoading(true)
    setError('')

    try {
      const result = await tenderService.getTenderById(id)
      
      if (result.error) {
        setError(result.error)
      } else if (result.tender) {
        setTender(result.tender)
      } else {
        setError('Tender not found')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (tender) {
      const shareUrl = window.location.href
      const shareText = `Check out this tender: ${tender.title}`
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: tender.title,
            text: shareText,
            url: shareUrl
          })
        } catch (err) {
          console.log('Error sharing:', err)
        }
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${shareText} - ${shareUrl}`)
        alert('Link copied to clipboard!')
      }
    }
  }

  const handleBookmark = () => {
    if (!tenderId) return
    
    let updatedSavedTenders: string[]
    if (savedTenders.includes(tenderId)) {
      // Remove from saved
      updatedSavedTenders = savedTenders.filter(id => id !== tenderId)
    } else {
      // Add to saved
      updatedSavedTenders = [...savedTenders, tenderId]
    }
    
    setSavedTenders(updatedSavedTenders)
    localStorage.setItem('savedTenders', JSON.stringify(updatedSavedTenders))
  }

  const isBookmarked = tenderId ? savedTenders.includes(tenderId) : false

  const getProvinceName = (province: string) => {
    const provinceNames: Record<string, string> = {
      'GP': 'Gauteng',
      'WC': 'Western Cape',
      'KZN': 'KwaZulu-Natal',
      'EC': 'Eastern Cape',
      'FS': 'Free State',
      'MP': 'Mpumalanga',
      'NW': 'North West',
      'LP': 'Limpopo',
      'NC': 'Northern Cape'
    }
    return provinceNames[province] || province
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const isUrgent = tender && new Date(tender.closing_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const isExpired = tender && new Date(tender.closing_date) < new Date()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="dark:text-dark-text">Loading tender details...</p>
        </div>
      </div>
    )
  }

  if (error || !tender) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 dark:text-dark-text">Error</h2>
          <p className="text-gray-600 dark:text-dark-text mb-4">{error || 'Tender not found'}</p>
          <Button onClick={() => navigate('/dashboard')} className="dark:border-dark-border dark:text-dark-text">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 dark:bg-dark-card dark:border-dark-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/dashboard')}
                className="dark:text-dark-text"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold dark:text-dark-text">Tender Details</h1>
                <p className="text-sm text-gray-500 dark:text-dark-text">ID: {tender.tender_id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className={isBookmarked ? 'text-primary' : ''}
              >
                <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="dark:border-dark-border dark:text-dark-text">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent className="dark:bg-dark-card dark:border-dark-border">
                  <DialogHeader>
                    <DialogTitle className="dark:text-dark-text">Share Tender</DialogTitle>
                    <DialogDescription className="dark:text-dark-textSecondary">
                      Share this tender opportunity with colleagues
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Button onClick={handleShare} className="w-full">
                      Share Link
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Tender Header */}
          <Card className="dark:bg-dark-card dark:border-dark-border">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={isExpired ? 'destructive' : isUrgent ? 'secondary' : 'outline'}>
                      {isExpired ? 'Expired' : isUrgent ? 'Urgent' : 'Open'}
                    </Badge>
                    <Badge variant="outline">{tender.industry_category}</Badge>
                  </div>
                  <CardTitle className="text-2xl mb-2 dark:text-dark-text">{tender.title}</CardTitle>
                  <CardDescription className="text-base dark:text-dark-textSecondary">
                    {tender.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-gray-400 dark:text-dark-textSecondary" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-dark-text">Buyer</p>
                    <p className="font-medium dark:text-dark-text">{tender.buyer}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 dark:text-dark-textSecondary" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-dark-text">Province</p>
                    <p className="font-medium dark:text-dark-text">{getProvinceName(tender.province)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 dark:text-dark-textSecondary" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-dark-text">Published</p>
                    <p className="font-medium dark:text-dark-text">{formatDate(tender.published_date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className={`h-5 w-5 ${isExpired ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-gray-400 dark:text-dark-textSecondary'}`} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-dark-text">Closing Date</p>
                    <p className={`font-medium ${isExpired ? 'text-red-600' : isUrgent ? 'text-orange-600' : ''} dark:text-dark-text`}>
                      {formatDate(tender.closing_date)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 dark:bg-dark-accent">
              <TabsTrigger value="details" className="dark:text-dark-text dark:data-[state=active]:bg-dark-hover">Details</TabsTrigger>
              <TabsTrigger value="documents" className="dark:text-dark-text dark:data-[state=active]:bg-dark-hover">Documents</TabsTrigger>
              <TabsTrigger value="source" className="dark:text-dark-text dark:data-[state=active]:bg-dark-hover">Source</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card className="dark:bg-dark-card dark:border-dark-border">
                <CardHeader>
                  <CardTitle className="dark:text-dark-text">Full Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed dark:text-dark-text">
                      {tender.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-dark-card dark:border-dark-border">
                <CardHeader>
                  <CardTitle className="dark:text-dark-text">Key Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-dark-text">Industry Category</p>
                        <Badge variant="outline">{tender.industry_category}</Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-dark-text">Province</p>
                        <p className="dark:text-dark-text">{getProvinceName(tender.province)}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-dark-text">Tender Reference</p>
                        <p className="font-mono text-sm dark:text-dark-text">{tender.tender_id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-dark-text">Status</p>
                        <Badge variant={isExpired ? 'destructive' : isUrgent ? 'secondary' : 'outline'}>
                          {isExpired ? 'Expired' : isUrgent ? 'Closing Soon' : 'Open'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card className="dark:bg-dark-card dark:border-dark-border">
                <CardHeader>
                  <CardTitle className="flex items-center dark:text-dark-text">
                    <FileText className="h-5 w-5 mr-2" />
                    Tender Documents
                  </CardTitle>
                  <CardDescription className="dark:text-dark-textSecondary">
                    Download and review all related tender documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tender.document_links.length > 0 ? (
                    <div className="space-y-3">
                      {tender.document_links.map((link, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg dark:border-dark-border">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-400 dark:text-dark-textSecondary" />
                            <div>
                              <p className="font-medium dark:text-dark-text">Document {index + 1}</p>
                              <p className="text-sm text-gray-500 dark:text-dark-text">{link}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="dark:border-dark-border dark:text-dark-text">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 dark:text-dark-textSecondary mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-dark-text">No documents available for this tender</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="source" className="space-y-4">
              <Card className="dark:bg-dark-card dark:border-dark-border">
                <CardHeader>
                  <CardTitle className="flex items-center dark:text-dark-text">
                    <Tag className="h-5 w-5 mr-2" />
                    Source Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-dark-text">Source Platform</p>
                      <p className="font-medium dark:text-dark-text">{tender.source}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-dark-text">Original URL</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-blue-600 truncate flex-1">{tender.source_url}</p>
                        <Button size="sm" variant="outline" className="dark:border-dark-border dark:text-dark-text">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-dark-text">Last Updated</p>
                      <p className="dark:text-dark-text">{formatDate(tender.created_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
