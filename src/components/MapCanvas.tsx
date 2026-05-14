import { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"
import { LOCATIONS, TEAM_TYPES, DANGER_LABELS, DANGER_COLORS } from "@/components/rustMapData"

interface MapCanvasProps {
  mapLoading: boolean
  mapLoaded: boolean
  serverIp: string
  highlightedLocations: string[]
  hoveredLocation: string | null
  tooltip: { x: number; y: number } | null
  selectedTeam: string | null
  onLocationEnter: (id: string, e: React.MouseEvent, rect: DOMRect | undefined) => void
  onLocationMove: (e: React.MouseEvent, rect: DOMRect | undefined) => void
  onLocationLeave: () => void
  mapRef: React.RefObject<HTMLDivElement>
}

export function MapCanvas({
  mapLoading,
  mapLoaded,
  serverIp,
  highlightedLocations,
  hoveredLocation,
  tooltip,
  selectedTeam,
  onLocationEnter,
  onLocationMove,
  onLocationLeave,
  mapRef,
}: MapCanvasProps) {
  const hoveredLoc = LOCATIONS.find((l) => l.id === hoveredLocation)
  const teamInfo = selectedTeam ? TEAM_TYPES.find((t) => t.id === selectedTeam) : null

  return (
    <div className="flex-1 relative overflow-hidden bg-zinc-950" ref={mapRef}>
      {!mapLoaded ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            {mapLoading ? (
              <>
                <Icon name="Loader" size={32} className="text-orange-400 animate-spin mx-auto mb-3" />
                <p className="text-zinc-400 text-sm">Загружаю карту сервера...</p>
                <p className="text-zinc-600 text-xs mt-1">{serverIp}</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-2xl bg-zinc-800/60 border border-zinc-700 flex items-center justify-center mx-auto mb-4">
                  <Icon name="Map" size={36} className="text-zinc-600" />
                </div>
                <p className="text-zinc-400 text-sm font-medium">Введите IP сервера</p>
                <p className="text-zinc-600 text-xs mt-1">и нажмите кнопку загрузки</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 40%, rgba(34,85,34,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(20,50,80,0.3) 0%, transparent 50%), linear-gradient(135deg, #0a1a0a 0%, #0d1a2a 50%, #0a1208 100%)",
            }}
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Terrain blobs */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <ellipse cx="25" cy="60" rx="18" ry="12" fill="#1a4a1a" />
              <ellipse cx="60" cy="40" rx="22" ry="15" fill="#1a3a10" />
              <ellipse cx="80" cy="70" rx="12" ry="8" fill="#0d2a3a" />
              <ellipse cx="40" cy="80" rx="15" ry="8" fill="#1a4a1a" />
              <ellipse cx="15" cy="25" rx="10" ry="6" fill="#1a3a10" />
            </svg>

            {/* Location markers */}
            {LOCATIONS.map((loc) => {
              const isHighlighted = highlightedLocations.length === 0 || highlightedLocations.includes(loc.id)
              const isDimmed = highlightedLocations.length > 0 && !highlightedLocations.includes(loc.id)

              return (
                <div
                  key={loc.id}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${loc.x}%`,
                    top: `${loc.y}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: isDimmed ? 0.2 : 1,
                    transition: "opacity 0.3s",
                    zIndex: hoveredLocation === loc.id ? 50 : 10,
                  }}
                  onMouseEnter={(e) => onLocationEnter(loc.id, e, mapRef.current?.getBoundingClientRect())}
                  onMouseMove={(e) => onLocationMove(e, mapRef.current?.getBoundingClientRect())}
                  onMouseLeave={onLocationLeave}
                >
                  {isHighlighted && highlightedLocations.includes(loc.id) && (
                    <div className={`absolute inset-0 rounded-full animate-ping ${loc.dot} opacity-40 scale-150`} />
                  )}
                  <div
                    className={`w-3 h-3 rounded-full ${loc.dot} border-2 border-zinc-900 shadow-lg transition-transform group-hover:scale-150`}
                  />
                  <div
                    className={`absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-900/80 border border-zinc-700/50 ${loc.color} pointer-events-none`}
                  >
                    {loc.name}
                  </div>
                </div>
              )
            })}

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredLocation && hoveredLoc && tooltip && (
                <motion.div
                  key={hoveredLocation}
                  initial={{ opacity: 0, scale: 0.95, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-[100] pointer-events-none"
                  style={{
                    left: Math.min(tooltip.x + 12, (mapRef.current?.offsetWidth ?? 800) - 240),
                    top: tooltip.y - 10,
                  }}
                >
                  <div className="w-56 bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${hoveredLoc.dot}`} />
                      <span className={`text-sm font-semibold ${hoveredLoc.color}`}>{hoveredLoc.name}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mb-2 leading-relaxed">{hoveredLoc.desc}</p>
                    <div className="border-t border-zinc-800 pt-2 mb-2">
                      <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-1">Лут</p>
                      <div className="flex flex-col gap-0.5">
                        {hoveredLoc.loot.map((item, i) => (
                          <span key={i} className="text-[11px] text-zinc-300 flex items-center gap-1">
                            <span className="text-zinc-600">·</span> {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 border-t border-zinc-800 pt-2">
                      <Icon name="AlertTriangle" size={10} className={DANGER_COLORS[hoveredLoc.danger]} />
                      <span className={`text-[10px] font-medium ${DANGER_COLORS[hoveredLoc.danger]}`}>
                        {DANGER_LABELS[hoveredLoc.danger]}
                      </span>
                      <div className="flex gap-0.5 ml-auto">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-1.5 rounded-sm ${i < hoveredLoc.danger ? DANGER_COLORS[hoveredLoc.danger].replace("text-", "bg-") : "bg-zinc-700"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Map info */}
          <div className="absolute bottom-3 left-3 bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 backdrop-blur-sm">
            <span className="text-orange-400 font-medium">{serverIp}</span>
            <span className="mx-2 text-zinc-600">·</span>
            {LOCATIONS.length} локаций
          </div>

          {/* Team highlight badge */}
          <AnimatePresence>
            {teamInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-3 left-1/2 -translate-x-1/2 bg-zinc-900/90 border border-zinc-700 rounded-full px-4 py-1.5 text-xs text-zinc-300 backdrop-blur-sm flex items-center gap-2"
              >
                <Icon name={teamInfo.icon} size={12} className={teamInfo.color} />
                Лучшие места для <span className={`font-semibold ${teamInfo.color}`}>{teamInfo.name}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
