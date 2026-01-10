import { useState } from 'react'
import { Filter, Search, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { INDUSTRY_CATEGORIES, PROVINCES } from '../../types/tenderly'

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
      <div className="w-16 bg-white border-r border-gray-200 p-4 flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <Filter className="h-4 w-4" />
        </Button>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {activeFiltersCount}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className={`fixed left-0 top-16 h-full bg-white border-r transition-all duration-300 z-10 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      <div className="p-4 h-full overflow-y-auto">
        {!isCollapsed && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
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
              <Label htmlFor="sidebar-search" className="text-sm font-medium">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="sidebar-search"
                  type="text"
                  placeholder="Search tenders..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSearchChange(localSearch)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Industries */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Industries</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {INDUSTRY_CATEGORIES.map((industry) => (
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
                      className="text-sm cursor-pointer"
                    >
                      {industry}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedIndustries.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedIndustries.map((industry) => (
                    <Badge key={industry} variant="secondary" className="text-xs">
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
              <Label htmlFor="province-select" className="text-sm font-medium">Province</Label>
              <Select value={selectedProvince} onValueChange={onProvinceChange}>
                <SelectTrigger id="province-select">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">All Provinces</SelectItem>
                  {provinces.map((province) => (
                    <SelectItem key={province.value} value={province.value}>
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
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
