import { motion } from "framer-motion"
import { Sparkles, Zap, Globe, Hexagon, Diamond, Star, Circle, Square } from "lucide-react"

const companies = [
  { name: "TechFlow", icon: Zap },
  { name: "Quantum", icon: Hexagon },
  { name: "Alpine", icon: Diamond },
  { name: "Stellar", icon: Star },
  { name: "Nova", icon: Sparkles },
  { name: "Nimbus", icon: Globe },
  { name: "Prism", icon: Circle },
  { name: "Vertex", icon: Square },
]

export function LogoCloud() {
  return (
    <div className="relative z-20 pb-24 pt-8" style={{ backgroundColor: "#09090B" }}>
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg text-zinc-300 mb-2"
          >
            Выбор лучших продуктовых команд мира.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-zinc-500 mb-16"
          >
            От амбициозных стартапов до крупных корпораций.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group cursor-pointer"
          >
            {/* Logo grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-10 items-center justify-items-center transition-all duration-300 group-hover:blur-[2.5px] group-hover:opacity-50">
              {companies.map((company) => (
                <div key={company.name} className="text-white font-semibold text-xl flex items-center gap-2">
                  <company.icon className="w-5 h-5" />
                  {company.name}
                </div>
              ))}
            </div>

            {/* Hover overlay button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="px-5 py-2.5 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 rounded-full text-sm text-zinc-300 flex items-center gap-2">
                Наши клиенты
                <span aria-hidden="true">&gt;</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
