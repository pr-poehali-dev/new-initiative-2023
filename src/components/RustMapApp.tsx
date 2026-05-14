import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"

const LOCATIONS = [
  {
    id: "launch_site",
    name: "Ракетная шахта",
    type: "clan",
    x: 72,
    y: 18,
    icon: "Rocket",
    color: "text-red-400",
    dot: "bg-red-500",
    loot: ["Военные ящики", "Элитные ящики", "Научный ящик"],
    desc: "Крупная военная локация. Много лута, часто посещается.",
    danger: 5,
  },
  {
    id: "excavator",
    name: "Гигантский экскаватор",
    type: "clan",
    x: 58,
    y: 30,
    icon: "Cog",
    color: "text-yellow-400",
    dot: "bg-yellow-500",
    loot: ["Дизельное топливо", "Серный металл", "Компоненты"],
    desc: "Пассивная добыча ресурсов. Нужна защита от рейдов.",
    danger: 5,
  },
  {
    id: "military_tunnels",
    name: "Военные тоннели",
    type: "clan",
    x: 40,
    y: 22,
    icon: "Shield",
    color: "text-red-500",
    dot: "bg-red-600",
    loot: ["Военные ящики", "Оружие", "Бронежилеты"],
    desc: "Сложные тоннели с учёными. Элитный лут.",
    danger: 5,
  },
  {
    id: "airfield",
    name: "Аэродром",
    type: "squad",
    x: 25,
    y: 35,
    icon: "Plane",
    color: "text-blue-400",
    dot: "bg-blue-500",
    loot: ["Военные ящики", "Оружие", "Топливо"],
    desc: "Большая открытая локация. Хороший лут, много PvP.",
    danger: 4,
  },
  {
    id: "dome",
    name: "Купол (Сфера)",
    type: "squad",
    x: 65,
    y: 55,
    icon: "Globe",
    color: "text-purple-400",
    dot: "bg-purple-500",
    loot: ["Военные ящики", "Синие карты", "Оружие"],
    desc: "Опасная сфера с хорошим лутом. Требует паркура.",
    danger: 4,
  },
  {
    id: "water_treatment",
    name: "Очистные сооружения",
    type: "squad",
    x: 48,
    y: 68,
    icon: "Droplets",
    color: "text-cyan-400",
    dot: "bg-cyan-500",
    loot: ["Синие карты", "Военный лут", "Компоненты"],
    desc: "Большая открытая локация с синими картами доступа.",
    danger: 4,
  },
  {
    id: "gas_station",
    name: "Заправка",
    type: "duo",
    x: 30,
    y: 60,
    icon: "Fuel",
    color: "text-green-400",
    dot: "bg-green-500",
    loot: ["Зелёные ящики", "Баррели", "Компоненты"],
    desc: "Небольшая безопасная локация для старта. Хороша для дуо.",
    danger: 2,
  },
  {
    id: "supermarket",
    name: "Супермаркет",
    type: "duo",
    x: 55,
    y: 78,
    icon: "ShoppingCart",
    color: "text-green-300",
    dot: "bg-green-400",
    loot: ["Зелёные ящики", "Еда", "Базовые ресурсы"],
    desc: "Популярное место для дуо. Быстрый лут на старте.",
    danger: 2,
  },
  {
    id: "warehouse",
    name: "Склад",
    type: "duo",
    x: 78,
    y: 48,
    icon: "Warehouse",
    color: "text-amber-400",
    dot: "bg-amber-500",
    loot: ["Синие ящики", "Промышленные компоненты", "Металл"],
    desc: "Средняя локация с хорошим промышленным лутом.",
    danger: 3,
  },
  {
    id: "outpost",
    name: "Аванпост",
    type: "solo",
    x: 20,
    y: 75,
    icon: "Home",
    color: "text-zinc-400",
    dot: "bg-zinc-500",
    loot: ["Безопасная зона", "Магазины", "Верстаки"],
    desc: "Нейтральная безопасная зона. Идеальна для соло-торговли.",
    danger: 0,
  },
  {
    id: "bandit_camp",
    name: "Лагерь бандитов",
    type: "solo",
    x: 82,
    y: 72,
    icon: "Skull",
    color: "text-zinc-400",
    dot: "bg-zinc-500",
    loot: ["Казино", "Магазины", "Лечение"],
    desc: "Нейтральная зона. Можно продать/купить ресурсы.",
    danger: 0,
  },
]

const ANIMALS = [
  { id: "wolf", name: "Волки", icon: "🐺", color: "text-zinc-300", desc: "Агрессивны. Дают мясо и шкуру." },
  { id: "bear", name: "Медведи", icon: "🐻", color: "text-amber-700", desc: "Очень опасны. Много мяса и жира." },
  { id: "boar", name: "Кабаны", icon: "🐗", color: "text-amber-600", desc: "Умеренно опасны. Мясо и кости." },
  { id: "cloth", name: "Ткань (конопля)", icon: "🌿", color: "text-green-400", desc: "Растёт на полях. Нужна для одежды." },
  { id: "ore", name: "Руда", icon: "⛏️", color: "text-stone-400", desc: "Металлические и серные узлы руды." },
]

const TEAM_TYPES = [
  {
    id: "solo",
    name: "Соло",
    icon: "User",
    color: "text-zinc-400",
    border: "border-zinc-600",
    bg: "bg-zinc-800/50",
    activeBg: "bg-zinc-700",
    desc: "Тихие места вдали от крупных локаций",
    locations: ["outpost", "bandit_camp"],
    tip: "Держись подальше от крупных точек. Ищи тихий лес или берег у края карты.",
  },
  {
    id: "duo",
    name: "Дуо",
    icon: "Users",
    color: "text-green-400",
    border: "border-green-700",
    bg: "bg-green-950/30",
    activeBg: "bg-green-900/50",
    desc: "Возле заправки, супермаркета, склада",
    locations: ["gas_station", "supermarket", "warehouse"],
    tip: "Селись у средних монументов. Быстрый лут и неплохая защита от набегов.",
  },
  {
    id: "squad",
    name: "Сквад",
    icon: "Users",
    color: "text-blue-400",
    border: "border-blue-700",
    bg: "bg-blue-950/30",
    activeBg: "bg-blue-900/50",
    desc: "Аэродром, купол, очистные сооружения",
    locations: ["airfield", "dome", "water_treatment"],
    tip: "Выбирай сильные монументы с военным лутом. Контролируй зону вместе.",
  },
  {
    id: "clan",
    name: "Клан",
    icon: "Crown",
    color: "text-orange-400",
    border: "border-orange-700",
    bg: "bg-orange-950/30",
    activeBg: "bg-orange-900/50",
    desc: "Космодром, экскаватор, военные тоннели",
    locations: ["launch_site", "excavator", "military_tunnels"],
    tip: "Занимай топовые монументы. Только клан способен удержать Ракетную шахту.",
  },
]

const DANGER_LABELS = ["Мирно", "Спокойно", "Умеренно", "Опасно", "Очень опасно", "Экстремально"]
const DANGER_COLORS = ["text-zinc-400", "text-green-400", "text-yellow-400", "text-orange-400", "text-red-400", "text-red-600"]

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

  const visibleLocations = LOCATIONS.filter((loc) => {
    if (highlightedLocations.length > 0) return highlightedLocations.includes(loc.id)
    return true
  })

  const hoveredLoc = LOCATIONS.find((l) => l.id === hoveredLocation)
  const teamInfo = selectedTeam ? TEAM_TYPES.find((t) => t.id === selectedTeam) : null

  return (
    <div className="flex h-full w-full gap-0">
      {/* Left Panel */}
      <div className="w-[300px] shrink-0 flex flex-col gap-3 p-4 border-r border-zinc-800 bg-zinc-900/60 overflow-y-auto">
        {/* Server IP Input */}
        <div>
          <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2 block">
            Сервер
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={serverIp}
              onChange={(e) => setServerIp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLoadMap()}
              placeholder="Введите IP сервера..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button
              onClick={handleLoadMap}
              disabled={mapLoading || !serverIp.trim()}
              className="px-3 py-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
            >
              {mapLoading ? (
                <Icon name="Loader" size={14} className="animate-spin" />
              ) : (
                <Icon name="Download" size={14} />
              )}
            </button>
          </div>
          {mapError && <p className="text-red-400 text-xs mt-1">{mapError}</p>}
          {mapLoaded && (
            <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
              <Icon name="CheckCircle" size={12} /> Карта загружена: {serverIp}
            </p>
          )}
        </div>

        <div className="border-t border-zinc-800" />

        {/* Animals & Resources */}
        <div>
          <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2 block">
            Ресурсы и животные
          </label>
          <div className="flex flex-col gap-1.5">
            {ANIMALS.map((a) => (
              <button
                key={a.id}
                onClick={() => toggleFilter(a.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm transition-all text-left ${
                  activeFilters.includes(a.id)
                    ? "border-orange-500 bg-orange-500/10 text-white"
                    : "border-zinc-700 bg-zinc-800/40 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                }`}
              >
                <span className="text-base leading-none">{a.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-xs">{a.name}</div>
                  <div className="text-[10px] text-zinc-600 leading-tight">{a.desc}</div>
                </div>
                {activeFilters.includes(a.id) && (
                  <Icon name="Check" size={12} className="text-orange-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-800" />

        {/* Find Home */}
        <div>
          <button
            onClick={() => setShowFindHome(!showFindHome)}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              showFindHome
                ? "border-orange-500 bg-orange-500/15 text-orange-300"
                : "border-zinc-700 bg-zinc-800/40 text-zinc-300 hover:border-orange-600 hover:text-orange-300"
            }`}
          >
            <Icon name="HomeIcon" fallback="Home" size={15} className={showFindHome ? "text-orange-400" : "text-zinc-500"} />
            <span>Найти дом</span>
            <Icon name={showFindHome ? "ChevronUp" : "ChevronDown"} size={14} className="ml-auto text-zinc-500" />
          </button>

          <AnimatePresence>
            {showFindHome && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2 flex flex-col gap-1.5">
                  {TEAM_TYPES.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}
                      className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all ${
                        selectedTeam === team.id
                          ? `${team.border} ${team.activeBg} text-white`
                          : `border-zinc-700 ${team.bg} text-zinc-400 hover:border-zinc-600`
                      }`}
                    >
                      <Icon name={team.icon} size={14} className={`mt-0.5 ${team.color}`} />
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${selectedTeam === team.id ? "text-white" : "text-zinc-300"}`}>
                          {team.name}
                        </div>
                        <div className="text-[10px] text-zinc-500 leading-tight mt-0.5">{team.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {teamInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 px-3 py-2.5 bg-zinc-800/80 rounded-lg border border-zinc-700"
                  >
                    <p className="text-[11px] text-zinc-300 leading-relaxed">{teamInfo.tip}</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="border-t border-zinc-800 pt-3">
          <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2 block">
            Тип команды на карте
          </label>
          <div className="flex flex-col gap-1">
            {TEAM_TYPES.map((t) => (
              <div key={t.id} className="flex items-center gap-2 text-xs text-zinc-500">
                <div className={`w-2 h-2 rounded-full ${t.border.replace("border-", "bg-")}`} />
                {t.name} — {t.desc.split(" ")[0]} {t.desc.split(" ")[1]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden bg-zinc-950" ref={mapRef}>
        {/* Map placeholder / loaded state */}
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
            {/* Fake map background */}
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
                    onMouseEnter={(e) => {
                      setHoveredLocation(loc.id)
                      const rect = mapRef.current?.getBoundingClientRect()
                      if (rect) {
                        setTooltip({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        })
                      }
                    }}
                    onMouseMove={(e) => {
                      const rect = mapRef.current?.getBoundingClientRect()
                      if (rect) {
                        setTooltip({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        })
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredLocation(null)
                      setTooltip(null)
                    }}
                  >
                    {/* Pulse ring for highlighted */}
                    {isHighlighted && highlightedLocations.includes(loc.id) && (
                      <div className={`absolute inset-0 rounded-full animate-ping ${loc.dot} opacity-40 scale-150`} />
                    )}

                    {/* Marker dot */}
                    <div
                      className={`w-3 h-3 rounded-full ${loc.dot} border-2 border-zinc-900 shadow-lg transition-transform group-hover:scale-150`}
                    />

                    {/* Label */}
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
    </div>
  )
}
