import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Icon Gembok / Lock */}
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-red-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
        </div>

        {/* Teks Utama */}
        <div>
          <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">
            403
          </h1>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Akses Ditolak
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. 
            Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
          >
            Kembali ke Beranda
          </Link>
        </div>

      </div>
    </div>
  );
}