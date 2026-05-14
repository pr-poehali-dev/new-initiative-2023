import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"
import { ANIMALS, TEAM_TYPES } from "@/components/rustMapData"

interface MapSidebarProps {
  serverIp: string
  setServerIp: (val: string) => void
  mapLoading: boolean
  mapLoaded: boolean
  mapError: string
  onLoadMap: () => void
  activeFilters: string[]
  toggleFilter: (id: string) => void
  selectedTeam: string | null
  setSelectedTeam: (id: string | null) => void
  showFindHome: boolean
  setShowFindHome: (val: boolean) => void
}

export function MapSidebar({
  serverIp,
  setServerIp,
  mapLoading,
  mapLoaded,
  mapError,
  onLoadMap,
  activeFilters,
  toggleFilter,
  selectedTeam,
  setSelectedTeam,
  showFindHome,
  setShowFindHome,
}: MapSidebarProps) {
  const teamInfo = selectedTeam ? TEAM_TYPES.find((t) => t.id === selectedTeam) : null

  return (
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
            onKeyDown={(e) => e.key === "Enter" && onLoadMap()}
            placeholder="Введите IP сервера..."
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
          />
          <button
            onClick={onLoadMap}
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
  )
}
