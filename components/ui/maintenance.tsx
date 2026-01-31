export default function MaintenanceMode() {
  return (
    <div className="inset-0 z-9999 flex items-center justify-center bg-white w-full py-10">
      <div className="text-center px-6">
        {/* Ilustrasi atau Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="h-32 w-32 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 text-orange-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
               <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
            </div>
          </div>
        </div>

        {/* Teks Informasi */}
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Halaman Sedang Diperbaiki
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
          Kami sedang melakukan pemeliharaan rutin untuk meningkatkan layanan kami. 
        </p>

        {/* Info Tambahan */}
        <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
          <p>Terima kasih atas kesabaran Anda.</p>
          <div className="h-1 w-20 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}