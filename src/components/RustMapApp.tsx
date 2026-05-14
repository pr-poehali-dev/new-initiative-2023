import { useState, useRef } from "react"
import { TEAM_TYPES } from "@/components/rustMapData"
import { MapSidebar } from "@/components/MapSidebar"
import { MapCanvas } from "@/components/MapCanvas"

export function RustMapApp() {
  const [serverIp, setServerIp] = useState("")
  const [mapLoading, setMapLoading] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)
  const [showFindHome, setShowFindHome] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const handleLoadMap = () => {
    if (!serverIp.trim()) return
    setMapLoading(true)
    setMapError("")
    setMapLoaded(false)
    setTimeout(() => {
      setMapLoading(false)
      setMapLoaded(true)
    }, 1800)
  }

  const highlightedLocations =
    selectedTeam ? TEAM_TYPES.find((t) => t.id === selectedTeam)?.locations ?? [] : []

  const handleLocationEnter = (id: string, e: React.MouseEvent, rect: DOMRect | undefined) => {
    setHoveredLocation(id)
    if (rect) {
      setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
  }

  const handleLocationMove = (e: React.MouseEvent, rect: DOMRect | undefined) => {
    if (rect) {
      setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
  }

  const handleLocationLeave = () => {
    setHoveredLocation(null)
    setTooltip(null)
  }

  return (
    <div className="flex h-full w-full gap-0">
      <MapSidebar
        serverIp={serverIp}
        setServerIp={setServerIp}
        mapLoading={mapLoading}
        mapLoaded={mapLoaded}
        mapError={mapError}
        onLoadMap={handleLoadMap}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        showFindHome={showFindHome}
        setShowFindHome={setShowFindHome}
      />
      <MapCanvas
        mapLoading={mapLoading}
        mapLoaded={mapLoaded}
        serverIp={serverIp}
        highlightedLocations={highlightedLocations}
        hoveredLocation={hoveredLocation}
        tooltip={tooltip}
        selectedTeam={selectedTeam}
        onLocationEnter={handleLocationEnter}
        onLocationMove={handleLocationMove}
        onLocationLeave={handleLocationLeave}
        mapRef={mapRef}
      />
    </div>
  )
}
