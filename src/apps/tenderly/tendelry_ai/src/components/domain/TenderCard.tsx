import { format } from 'date-fns'
import { Calendar, MapPin, Building, ExternalLink, Clock, Tag } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Tender } from '@/types'

interface TenderCardProps {
  tender: Tender
  onViewDetails: (tenderId: string) => void
  onSaveTender?: (tenderId: string) => void
  isSaved?: boolean
  compact?: boolean
}

export function TenderCard({ tender, onViewDetails, onSaveTender, isSaved = false, compact = false }: TenderCardProps) {
  const isUrgent = new Date(tender.closing_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const isExpired = new Date(tender.closing_date) < new Date()

  const getDeadlineColor = () => {
    if (isExpired) return 'destructive'
    if (isUrgent) return 'secondary'
    return 'outline'
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

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

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer dark:bg-dark-card dark:border-dark-border" onClick={() => onViewDetails(tender.tender_id)}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-sm line-clamp-2 flex-1 mr-2 dark:text-dark-text">{tender.title}</h3>
            <Badge variant={isExpired ? 'destructive' : isUrgent ? 'secondary' : 'outline'} className="shrink-0 dark:border-dark-border dark:text-dark-text">
              {isExpired ? 'Expired' : isUrgent ? 'Urgent' : 'Open'}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-dark-textSecondary">
            <span>{tender.buyer}</span>
            <span>{formatDate(tender.closing_date)}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group dark:bg-dark-card dark:border-dark-border">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors dark:text-dark-text">
              {tender.title}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2 dark:text-dark-textSecondary">
              {tender.description}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Badge variant={getDeadlineColor()} className="whitespace-nowrap dark:border-dark-border dark:text-dark-text">
              {isExpired ? 'Expired' : isUrgent ? 'Urgent' : 'Open'}
            </Badge>
            <Badge variant="outline" className="whitespace-nowrap dark:border-dark-border dark:text-dark-text">
              {tender.industry_category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm">
            <Building className="h-4 w-4 text-muted-foreground dark:text-dark-textSecondary" />
            <span className="text-muted-foreground dark:text-dark-textSecondary">Buyer:</span>
            <span className="font-medium truncate dark:text-dark-text">{tender.buyer}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground dark:text-dark-textSecondary" />
            <span className="text-muted-foreground dark:text-dark-textSecondary">Province:</span>
            <span className="font-medium dark:text-dark-text">{getProvinceName(tender.province)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground dark:text-dark-textSecondary" />
            <span className="text-muted-foreground dark:text-dark-textSecondary">Published:</span>
            <span className="font-medium dark:text-dark-text">{formatDate(tender.published_date)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Clock className={`h-4 w-4 text-muted-foreground dark:text-dark-textSecondary ${isExpired ? 'text-destructive' : isUrgent ? 'text-orange-600' : ''}`} />
            <span className="text-muted-foreground dark:text-dark-textSecondary">Closing:</span>
            <span className={`font-medium ${isExpired ? 'text-destructive' : isUrgent ? 'text-orange-600' : ''} dark:text-dark-text`}>
              {formatDate(tender.closing_date)}
            </span>
          </div>
        </div>

        {/* Source and Documents */}
        <div className="flex items-center justify-between pt-3 border-t dark:border-dark-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground dark:text-dark-textSecondary">
            <Tag className="h-4 w-4" />
            <span className="dark:text-dark-text">Source: {tender.source}</span>
            {tender.document_links.length > 0 && (
              <span className="dark:text-dark-text">• {tender.document_links.length} documents</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {onSaveTender && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  onSaveTender(tender.tender_id)
                }}
                className="shrink-0 dark:border-dark-border dark:text-dark-text"
              >
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            )}
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation()
                onViewDetails(tender.tender_id)
              }}
              className="shrink-0 dark:border-dark-border dark:text-dark-text"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
