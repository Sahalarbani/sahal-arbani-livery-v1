import React from 'react';
import { Youtube, Instagram, MessageSquare, Terminal, Shield, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-white/5 bg-brand-dark/60 backdrop-blur-2xl">
      {/* Top Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/5 pb-12">
          
          {/* Brand Column (Span 5) */}
          <div className="md:col-span-5 space-y-6">
            <div className="group cursor-default">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                SAHAL ARBANI <span className="text-brand-accent text-sm md:text-lg">/ LIVERY</span>
              </h2>
              <p className="mt-4 text-gray-400 text-sm font-medium leading-relaxed max-w-sm">
                Premium digital assets for the simulation racing ecosystem. 
                Forging the gap between virtual performance and visual dominance.
              </p>
            </div>
            
            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/5 border border-brand-accent/10">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
              <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider">All Systems Operational</span>
            </div>
          </div>

          {/* Links Column (Span 3) */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Terminal size={14} className="text-brand-accent" /> Navigation
            </h3>
            <ul className="space-y-3">
              {['Home', 'Blog', 'Gallery', 'About', 'Dashboard'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Home' ? '/' : item === 'Blog' ? '/blog' : `/#${item.toLowerCase()}`}
                    className="text-gray-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-brand-accent transition-colors" />
                    {item === 'Blog' ? 'Insight' : item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials Column (Span 4) */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Shield size={14} className="text-brand-accent" /> Network
            </h3>
            <div className="flex gap-4">
              {[
                { icon: MessageSquare, label: 'TikTok', href: 'https://www.tiktok.com/@sahal.arbani' },
                { icon: Youtube, label: 'Youtube', href: '#' },
                { icon: Instagram, label: 'Instagram', href: '#' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-brand-dark hover:bg-brand-accent hover:border-brand-accent transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  {social.label === 'TikTok' ? (
                    <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.67.45-1.12 1.25-1.13 2.05-.01 1.15.6 2.27 1.62 2.79.36.19.75.28 1.14.28 1.05.01 2.05-.6 2.5-1.54.25-.52.28-1.11.27-1.68-.01-5.69.01-11.37-.01-17.06z" />
                    </svg>
                  ) : (
                    <social.icon size={18} />
                  )}
                </a>
              ))}
            </div>
            <p className="mt-6 text-xs text-gray-600 font-medium leading-relaxed">
              Official Hub for <span className="text-gray-400">Sahal Arbani</span> (TikTok: <span className="text-gray-400">@sahal.arbani</span>). 
              Premium Livery designer for the Wanda Software simulation community.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 opacity-60">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
             &copy; {currentYear} SAHAL ARBANI LIVERY.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-[10px] font-bold text-gray-500 hover:text-brand-accent uppercase tracking-wider transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="text-[10px] font-bold text-gray-500 hover:text-brand-accent uppercase tracking-wider transition-colors">Terms</Link>
            <Link href="/contact" className="text-[10px] font-bold text-gray-500 hover:text-brand-accent uppercase tracking-wider transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
