import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SEOSIRI CORE | Ultimate AI Sales Engine & Notion Integration',
  description: 'Global SaaS/PaaS/IaaS bridging Notion CRM with Market Intelligence (GA4/GSC). Architected by Momenul Ahmad.',
  keywords: 'Notion AI CRM, Sales Intelligence, Momenul Ahmad, seosiri, Global Lead Generation, GA4 Sales Integration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SEOSIRI AI CRM CORE",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "description": "Integrated AI Sales Agent and Notion CRM Synchronization System.",
    "creator": {
      "@type": "Person",
      "name": "Momenul Ahmad",
      "url": "https://www.seosiri.com"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </head>
      <body className={`${inter.className} bg-[#050505] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}