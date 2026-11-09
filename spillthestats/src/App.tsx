import { useState } from "react";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Marquee Bar */}
      <div className="w-full border-b border-black overflow-hidden h-8 flex items-center">
        <div className="animate-marquee whitespace-nowrap text-sm tracking-widest font-mono">
          NEXT DATA
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="w-full border-b border-black px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo space */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-dashed border-black flex items-center justify-center text-xs font-mono">
            LOGO
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-mono">
          <a href="#" className="border-b border-transparent hover:border-black transition-none">Home</a>
          <a href="#" className="border-b border-transparent hover:border-black transition-none">Análisis</a>
          <a href="#" className="border-b border-transparent hover:border-black transition-none">Champions</a>
          <div className="flex items-center gap-2 border-l border-black pl-4">
            <div className="w-7 h-7 border border-dashed border-black rounded-full flex items-center justify-center text-[10px]">
              👤
            </div>
            <span>Perfil</span>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden w-9 h-9 border border-black flex flex-col items-center justify-center gap-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`w-4 h-0.5 bg-black transition-transform ${menuOpen ? "rotate-45 translate-y-[3px]" : ""}`}></span>
          <span className={`w-4 h-0.5 bg-black transition-opacity ${menuOpen ? "opacity-0" : ""}`}></span>
          <span className={`w-4 h-0.5 bg-black transition-transform ${menuOpen ? "-rotate-45 -translate-y-[3px]" : ""}`}></span>
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden border-b border-black bg-white">
          <div className="flex flex-col px-4 py-3 gap-3 font-mono text-sm">
            <a href="#" className="border-b border-dashed border-gray-300 pb-2">Home</a>
            <a href="#" className="border-b border-dashed border-gray-300 pb-2">Análisis</a>
            <a href="#" className="border-b border-dashed border-gray-300 pb-2">Champions</a>
            <a href="#" className="flex items-center gap-2">
              <div className="w-6 h-6 border border-dashed border-black rounded-full flex items-center justify-center text-[10px]">
                👤
              </div>
              Perfil
            </a>
          </div>
        </div>
      )}

      {/* Hero Section - Two halves */}
      <section className="w-full flex flex-col sm:flex-row flex-1 min-h-[500px]">
        {/* Left half - Image placeholder */}
        <div className="w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-black flex items-center justify-center bg-gray-100 min-h-[250px] sm:min-h-0">
          <div className="w-[80%] h-[70%] border-2 border-dashed border-black flex flex-col items-center justify-center gap-2">
            <span className="text-4xl">🖼️</span>
            <span className="font-mono text-sm">[ HERO IMAGE ]</span>
            <span className="font-mono text-xs text-gray-500">placeholder</span>
          </div>
        </div>

        {/* Right half - Title + Description + Button */}
        <div className="w-full sm:w-1/2 flex flex-col items-center justify-center px-6 sm:px-12 py-10">
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight text-center border-b-2 border-black pb-4 mb-6">
            ¡Bienvenido a<br />Spill the Stats!
          </h1>

          <p className="max-w-lg text-center text-sm sm:text-base leading-relaxed font-mono border border-dashed border-gray-400 p-4 sm:p-6">
            En nuestra página encontrarás los datos más recientes de League of Legends LAN, para buscar los mejores campeones y builds, counters, winrates y mucho más. Crea una cuenta para recomendaciones personalizadas con nuestro algoritmo personal de SpillTheStats.
          </p>

          <div className="mt-6">
            <button className="border-2 border-black px-8 py-3 font-mono text-sm tracking-wide hover:bg-black hover:text-white transition-none">
              Crea una Cuenta
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t-2 border-black mt-auto">
        <div className="flex flex-col sm:flex-row px-8 py-6">
          {/* Left side */}
          <div className="flex-1 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-black pb-4 sm:pb-0 pr-0 sm:pr-6">
            {/* Made with love */}
            <div className="font-mono text-sm">
              <p>Made with ❤ by CocoaTeaDevs</p>
            </div>

            {/* Logo + Social icons */}
            <div className="flex items-center gap-4 mt-4">
              <div className="w-8 h-8 border border-dashed border-black flex items-center justify-center text-[10px] font-mono">
                LOGO
              </div>
              <div className="flex items-center gap-3 ml-4">
                <a href="#" className="w-8 h-8 border border-black flex items-center justify-center" title="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 border border-black flex items-center justify-center" title="Inbox">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right side - Two columns */}
          <div className="flex-1 flex justify-end gap-16 pt-4 sm:pt-0 pl-0 sm:pl-6">
            {/* Ayuda column */}
            <div className="flex flex-col gap-2">
              <h4 className="font-mono text-sm font-bold border-b border-black pb-1">Ayuda</h4>
              <a href="#" className="font-mono text-xs hover:underline">FAQ</a>
              <a href="#" className="font-mono text-xs hover:underline">Contact Us</a>
            </div>

            {/* Otros column */}
            <div className="flex flex-col gap-2">
              <h4 className="font-mono text-sm font-bold border-b border-black pb-1">Otros</h4>
              <a href="#" className="font-mono text-xs hover:underline">Política de Privacidad</a>
            </div>
          </div>
        </div>

        {/* Bottom border line */}
        <div className="h-1 bg-black"></div>
      </footer>
    </div>
  );
}
