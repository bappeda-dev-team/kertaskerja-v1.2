import Link from 'next/link';

export default function NotFound() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Halaman Tidak Ditemukan</h2>
      <p className="text-lg text-center mb-8">
        Maaf, halaman yang Anda cari tidak ada. Terdapat kesalahan URL pada alamatnya,
        atau halaman tersebut telah dihapus.
      </p>
      <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
        Kembali ke Halaman Utama
      </Link>
    </div>
  );
}