import Icon from "@/components/ui/icon"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-[#09090B]/90 backdrop-blur-md">
      <div className="w-full flex justify-center px-6 py-3">
        <div className="w-full max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Map" className="w-5 h-5 text-orange-400" />
            <span className="text-white font-bold tracking-tight">Rust<span className="text-orange-400">_maper</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <span className="text-zinc-500">v2.0</span>
            <span className="text-zinc-600">|</span>
            <span>Интерактивная карта серверов Rust</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Icon name="MessageCircle" size={14} />
              Discord
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
