import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context/AppContext";
import Script from "next/script"; // 👈 importá esto
import localFont from "next/font/local";

import { initMercadoPago } from '@mercadopago/sdk-react';
initMercadoPago('EST-73f12ddd-3882-4d6a-a34a-887fb09119f1');

const inter = localFont({
  src: "../public/fonts/Inter.ttf",
  variable: "--font-inter",
  display: "swap",
});

const moderniz = localFont({
  src: "../public/fonts/Moderniz.ttf",
  variable: "--font-moderniz",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Stream Lab - El laboratorio de streaming",
  description: "Stream Lab es un estudio de alta calidad diseñado para creadores de contenido que buscan un resultado excepcional en sus proyectos audiovisuales. Combinamos experiencia e innovación para brindar no solo excelencia técnica, sino también una atención cercana y personalizada.",
  openGraph: {
    title: "Stream Lab - El laboratorio de streaming",
    description: "Somos un estudio de streaming en Palermo Hollywood. Vos traé tu proyecto, nosotros nos ocupamos de lo demás!",
    url: "https://streamlab.com.ar",
    siteName: "Stream Lab - El laboratorio de streaming",
    images: [
      {
        url: "https://streamlab.com.ar/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stream Lab - El laboratorio de streaming",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stream Lab - El laboratorio de streaming",
    description: "Somos un estudio de streaming en Palermo Hollywood. Vos traé tu proyecto, nosotros nos ocupamos de lo demás!",
    images: ["https://streamlab.com.ar/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1355597289574841');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JRLGJ162RK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JRLGJ162RK');
          `}
        </Script>
        
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),
              dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-T59TX5G6');
          `}
        </Script>			
        <link
          rel="preload"
          href="/fonts/Moderniz.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <Script
          src="https://sdk.mercadopago.com/js/v2"
          strategy="beforeInteractive" // 👈 lo carga antes de que React monte
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${moderniz.variable}`}>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1355597289574841&ev=PageView&noscript=1"
          />
        </noscript>
        	<noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-T59TX5G6"
    height="0"
    width="0"
    style={{ display: "none", visibility: "hidden" }}
  ></iframe></noscript>					
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
