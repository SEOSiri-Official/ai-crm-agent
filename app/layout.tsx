import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SEOSIRI CORE | Integrated AI Sales Engine for Notion',
  description: 'Global SaaS/PaaS/IaaS bridging Notion CRM with GSC/GA4 Market Intelligence. Architected by Momenul Ahmad.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SEOSIRI AI CRM",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "creator": { "@type": "Person", "name": "Momenul Ahmad", "url": "https://www.seosiri.com" },
    "featureList": ["Notion Sync", "AI Lead Scoring", "GA4 Market Intel", "GSC Gap Analysis", "Voice Search Optimization"]
  };

  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </head>
      <body className={`${inter.className} bg-[#050505] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}