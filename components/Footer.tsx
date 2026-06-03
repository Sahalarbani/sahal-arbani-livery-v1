import React from 'react';
import { Youtube, Instagram, MessageSquare, Terminal, Shield, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-brand-onyx/80 backdrop-blur-2xl">
      {/* Top Glow Accent */}
      <div className="absolute top-0 left-1/2 h-[1px] w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-12 md:grid-cols-12">

          {/* Brand Column (Span 5) */}
          <div className="md:col-span-5 space-y-6">
            <div className="group cursor-default">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-zinc-50 uppercase flex items-center gap-2">
                SAHAL ARBANI <span className="text-brand-accent text-sm md:text-lg">/ LIVERY</span>
              </h2>
              <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-zinc-500">
                Premium digital assets for the simulation racing ecosystem.
                Forging the gap between virtual performance and visual dominance.
              </p>
            </div>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-sage/20 bg-brand-sage/5 px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
              <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider">All Systems Operational</span>
            </div>
          </div>

          {/* Links Column (Span 3) */}
          <div className="md:col-span-3">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-50">
              <Terminal size={14} className="text-brand-accent" /> Navigation
            </h3>
            <ul className="space-y-3">
              {['Home', 'Blog', 'Gallery', 'About', 'Dashboard'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : item === 'Blog' ? '/blog' : `/#${item.toLowerCase()}`}
                    className="flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-50 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-zinc-300 group-hover:bg-brand-accent transition-colors" />
                    {item === 'Blog' ? 'Insight' : item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials Column (Span 4) */}
          <div className="md:col-span-4">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-50">
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-brand-onyx text-zinc-500 transition-all duration-300 hover:scale-110 hover:border-zinc-950 hover:bg-brand-cyan hover:text-black"
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
            <p className="mt-6 text-xs font-medium leading-relaxed text-zinc-500">
              Official Hub for <span className="text-zinc-300">Sahal Arbani</span> (TikTok: <span className="text-zinc-300">@sahal.arbani</span>).
              Premium Livery designer for the Wanda Software simulation community.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 opacity-60">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
             &copy; {currentYear} SAHAL ARBANI LIVERY.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-[10px] font-bold text-zinc-500 hover:text-zinc-50 uppercase tracking-wider transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="text-[10px] font-bold text-zinc-500 hover:text-zinc-50 uppercase tracking-wider transition-colors">Terms</Link>
            <Link href="/contact" className="text-[10px] font-bold text-zinc-500 hover:text-zinc-50 uppercase tracking-wider transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
