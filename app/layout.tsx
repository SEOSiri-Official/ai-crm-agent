import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SEOSIRI AI Agent | Architected by Momenul Ahmad',
  description: 'Integrated CRM, ESP, and Social Messaging Agent for Global Sales Lead Generation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <nav className="border-b border-white/10 py-4 px-8 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="text-xl font-bold tracking-tighter text-blue-500">
            SEOSIRI <span className="text-white font-light text-sm">AI-CRM</span>
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-widest">
            Architect: Momenul Ahmad
          </div>
        </nav>
        {children}
        <footer className="py-10 border-t border-white/10 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} seosiri.com | Global Intelligent Sales Systems
        </footer>
      </body>
    </html>
  );
}