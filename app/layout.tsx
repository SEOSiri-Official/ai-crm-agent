import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SEOSIRI CORE | Unified AI CRM & Market Intelligence',
  description: 'Industrial SaaS/PaaS/IaaS bridging Notion CRM with GSC/GA4. Architected by Momenul Ahmad.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SEOSIRI AI CRM",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "creator": { "@type": "Person", "name": "Momenul Ahmad", "url": "https://seosiri.com" },
    "keywords": "AI CRM, Notion Integration, GSC Data Sync, Voice Search Optimized Sales"
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}