import { useState } from 'react'
import { Filter, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface SidebarProps {
  selectedIndustries: string[]
  selectedProvince: string
  searchQuery: string
  onIndustriesChange: (industries: string[]) => void
  onProvinceChange: (province: string) => void
  onSearchChange: (query: string) => void
  onClearFilters: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({
  selectedIndustries,
  selectedProvince,
  searchQuery,
  onIndustriesChange,
  onProvinceChange,
  onSearchChange,
  onClearFilters,
  isCollapsed = false,
  onToggleCollapse
}: SidebarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const industries = [
    'Construction',
    'ICT & Software',
    'Security Services',
    'Cleaning & Hygiene',
    'Transport & Fleet',
    'Catering & Hospitality',
    'Agriculture',
    'Printing & Branding',
    'Consulting & Professional Services',
    'Supply & Delivery',
    'Mechanical & Engineering',
    'Health & Medical Supplies',
    'Education & Training',
    'Energy & Electrical Services'
  ] as const

  const provinces = [
    { value: 'all', label: 'All Provinces' },
    { value: 'GP', label: 'Gauteng' },
    { value: 'WC', label: 'Western Cape' },
    { value: 'KZN', label: 'KwaZulu-Natal' },
    { value: 'EC', label: 'Eastern Cape' },
    { value: 'FS', label: 'Free State' },
    { value: 'MP', label: 'Mpumalanga' },
    { value: 'NW', label: 'North West' },
    { value: 'LP', label: 'Limpopo' },
    { value: 'NC', label: 'Northern Cape' }
  ]

  const activeFiltersCount = selectedIndustries.length + (selectedProvince !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0)

  if (isCollapsed) {
    return (
      <div className="w-16 bg-white border-r border-gray-200 p-4 flex flex-col items-center dark:bg-dark-card dark:border-dark-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4 dark:text-dark-text"
        >
          <Filter className="h-4 w-4" />
        </Button>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="text-xs dark:bg-dark-accent dark:text-dark-text">
            {activeFiltersCount}
          </Badge>
        )}
      </div>
    )
  }
  return (
    <div className={`fixed left-0 top-16 h-full bg-white border-r transition-all duration-300 z-10 dark:bg-dark-card dark:border-dark-border ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      <div className="p-4 h-full overflow-y-auto">
        {!isCollapsed && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Filters</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  onClearFilters()
                  if (onToggleCollapse) {
                    onToggleCollapse()
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="sidebar-search" className="text-sm font-medium dark:text-dark-text">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-textSecondary h-4 w-4" />
                <Input
                  id="sidebar-search"
                  type="text"
                  placeholder="Search tenders..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSearchChange(localSearch)}
                  className="pl-10 dark:bg-dark-accent dark:border-dark-border dark:text-dark-text dark:placeholder-dark-textSecondary"
                />
              </div>
            </div>

            {/* Industries */}
            <div className="space-y-3">
              <Label className="text-sm font-medium dark:text-dark-text">Industries</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {industries.map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <Checkbox
                      id={`industry-${industry}`}
                      checked={selectedIndustries.includes(industry)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onIndustriesChange([...selectedIndustries, industry])
                        } else {
                          onIndustriesChange(selectedIndustries.filter(i => i !== industry))
                        }
                      }}
                    />
                    <Label 
                      htmlFor={`industry-${industry}`} 
                      className="text-sm cursor-pointer dark:text-dark-text"
                    >
                      {industry}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedIndustries.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedIndustries.map((industry) => (
                    <Badge key={industry} variant="secondary" className="text-xs dark:bg-dark-accent dark:text-dark-text">
                      {industry}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                        onClick={() => onIndustriesChange(selectedIndustries.filter(i => i !== industry))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Province */}
            <div className="space-y-3">
              <Label htmlFor="province-select" className="text-sm font-medium dark:text-dark-text">Province</Label>
              <Select value={selectedProvince} onValueChange={onProvinceChange}>
                <SelectTrigger id="province-select" className="dark:bg-dark-accent dark:border-dark-border dark:text-dark-text">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent className="dark:bg-dark-card dark:border-dark-border" position="popper">
                  <SelectItem value="all">All Provinces</SelectItem>
                  {provinces.map((province) => (
                    <SelectItem key={province.value} value={province.value} className="dark:text-dark-text">
                      {province.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {(selectedIndustries.length > 0 || selectedProvince !== 'all' || localSearch) && (
              <Button 
                onClick={onClearFilters} 
                variant="outline" 
                className="w-full dark:border-dark-border dark:text-dark-text"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        {/* Collapsed State - Toggle Button */}
        {isCollapsed && (
          <div className="flex flex-col items-center space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="p-2 dark:text-dark-text"
              title="Expand filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
            {(selectedIndustries.length > 0 || selectedProvince !== 'all' || localSearch) && (
              <Badge variant="secondary" className="px-2 py-1 text-xs dark:bg-dark-accent dark:text-dark-text">
                Active
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
