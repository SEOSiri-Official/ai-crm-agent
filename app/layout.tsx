import './globals.css';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SEOSIRI CORE | Integrated AI Sales Engine',
  description: 'Industrial SaaS/PaaS/IaaS bridging Notion CRM with Market Intelligence. Architected by Momenul Ahmad.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemaData = {
    "@context": "https://schema.org", "@type": "SoftwareApplication", "name": "SEOSIRI AI CRM",
    "operatingSystem": "Web", "applicationCategory": "BusinessApplication",
    "creator": { "@type": "Person", "name": "Momenul Ahmad", "url": "https://seosiri.com" }
  };
  return (
    <html lang="en" className="dark">
      <head><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} /></head>
      <body className={`${inter.className} bg-black text-white antialiased`}>{children}</body>
    </html>
  );
}