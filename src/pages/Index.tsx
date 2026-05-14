import { Navbar } from "@/components/Navbar"
import { RustMapApp } from "@/components/RustMapApp"

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-[#09090B] overflow-hidden">
      <Navbar />
      <div className="flex-1 pt-[49px] overflow-hidden">
        <RustMapApp />
      </div>
    </div>
  )
}

export default Index
