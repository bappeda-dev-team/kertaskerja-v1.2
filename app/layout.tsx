import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const font = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const logo = process.env.NEXT_PUBLIC_LOGO_URL;
const pemda = process.env.NEXT_PUBLIC_NAMA_PEMDA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>KAK {pemda || "kertas kerja"}</title>
        <meta name="description" content="Aplikasi KAK" />
        <link
          rel="icon"
          href={logo}
        />
      </head>
      <body
        className={`${font} antialiased custom-scrollbar bg-white`}
      >
        <NextTopLoader />
        {children}
      </body>
    </html>
  );
}
