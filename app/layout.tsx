import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SEOSIRI CORE | Universal AI Sales Intelligence & Notion Integration',
  description: 'Industrial SaaS/PaaS/IaaS bridging Notion CRM with GA4/GSC Market Intelligence. Architected by Momenul Ahmad.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SEOSIRI AI CRM Agent",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "creator": { "@type": "Person", "name": "Momenul Ahmad", "url": "https://seosiri.com" },
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": ["Real-time GSC Sync", "Notion CRM Write-back", "AI Gap Analysis", "Voice Search Optimization"]
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased selection:bg-blue-600`}>
        {children}
      </body>
    </html>
  );
}