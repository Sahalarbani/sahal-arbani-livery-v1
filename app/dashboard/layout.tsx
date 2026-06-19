import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import { LayoutDashboard, PackagePlus, LogOut, ArrowLeft, Layers } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    // PARENT WRAPPER
    // Default flow so the whole page can scroll natively if needed on mobile, but on desktop we lock it to h-[calc(100vh-navbar)]
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-black font-sans text-zinc-50 md:h-[calc(100vh-80px)] md:flex-row">
      
      {/* DESKTOP SIDEBAR SECTION */}
      <aside className="hidden md:flex flex-shrink-0 w-80 z-50 p-4 h-full">
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-brand-onyx p-6 shadow-sm">
            <div className="pointer-events-none absolute left-0 top-0 h-32 w-full bg-gradient-to-b from-zinc-100 to-transparent opacity-80"/>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <Link href="/" className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-zinc-50 group">
                        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Mainframe
                    </Link>
                    <h1 className="text-2xl font-black leading-none text-zinc-50">
                        ARB<span className="text-brand-accent">ADMIN</span>
                    </h1>
                </div>
            </div>

            <nav className="flex flex-col gap-3 flex-1 overflow-y-auto relative z-10">
                <Link href="/dashboard" className="flex items-center gap-4 rounded-2xl border border-white/10 bg-brand-onyx/5 px-5 py-4 text-sm font-bold uppercase tracking-wide text-zinc-400 transition-all hover:bg-brand-cyan hover:text-black">
                    <LayoutDashboard size={18} />
                    <span>Overview</span>
                </Link>
                <Link href="/dashboard/create" className="flex items-center gap-4 rounded-2xl border border-white/10 bg-brand-onyx/5 px-5 py-4 text-sm font-bold uppercase tracking-wide text-zinc-400 transition-all hover:bg-brand-cyan hover:text-black">
                    <PackagePlus size={18} />
                    <span>Deploy</span>
                </Link>
                <Link href="/dashboard/ads" className="flex items-center gap-4 rounded-2xl border border-white/10 bg-brand-onyx/5 px-5 py-4 text-sm font-bold uppercase tracking-wide text-zinc-400 transition-all hover:bg-brand-cyan hover:text-black">
                    <Layers size={18} />
                    <span>Ads Manager</span>
                </Link>
                <Link href="/dashboard/comments" className="flex items-center gap-4 rounded-2xl border border-white/10 bg-brand-onyx/5 px-5 py-4 text-sm font-bold uppercase tracking-wide text-zinc-400 transition-all hover:bg-brand-cyan hover:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                    <span>Comments</span>
                </Link>
                <Link href="/dashboard/logs" className="flex items-center gap-4 rounded-2xl border border-white/10 bg-brand-onyx/5 px-5 py-4 text-sm font-bold uppercase tracking-wide text-zinc-400 transition-all hover:bg-brand-cyan hover:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    <span>Activity Logs</span>
                </Link>
            </nav>

            <div className="relative z-10 mt-auto border-t border-white/10 pt-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full border border-brand-accent/50 p-[1px]">
                         <div className="h-full w-full overflow-hidden rounded-full bg-brand-onyx/10">
                            {session.user.image && <img src={session.user.image} alt="User" className="w-full h-full object-cover" />}
                         </div>
                    </div>
                    <div className="overflow-hidden">
                        <p className="max-w-[120px] truncate text-sm font-bold text-zinc-50">{session.user.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-brand-sage animate-pulse"/>
                           <p className="text-[9px] font-medium uppercase tracking-widest text-zinc-500">Level 5 Access</p>
                        </div>
                    </div>
                </div>
                
                <form action={async () => {
                    "use server"
                    await signOut({ redirectTo: '/' });
                }}>
                      <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black transition-all text-[10px] font-bold uppercase tracking-widest group border border-red-500/20">
                         <LogOut size={14} className="group-hover:-translate-x-1 transition-transform"/> Terminate Session
                      </button>
                </form>
            </div>
        </div>
      </aside>

      {/* MOBILE HEADER COMPACT */}
      <div className="relative z-40 flex w-full items-center justify-between border-b border-white/10 bg-brand-onyx px-4 py-3 shadow-sm md:hidden">
         <div>
            <h1 className="flex items-center gap-2 text-lg font-black leading-none text-zinc-50">
                ARB<span className="text-brand-accent">ADMIN</span>
            </h1>
         </div>
         <div className="flex items-center gap-2">
             <div className="w-7 h-7 rounded-full border border-brand-accent/50 p-[1px]">
                 <div className="h-full w-full overflow-hidden rounded-full bg-brand-onyx/10">
                    {session.user.image && <img src={session.user.image} alt="User" className="w-full h-full object-cover" />}
                 </div>
             </div>
         </div>
      </div>
      
      {/* MAIN CONTENT SECTION */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden p-2 pb-[100px] md:pb-0 md:p-4 md:pl-0 w-full">
        <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-onyx/70 md:rounded-[32px]">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-10 w-full relative z-10">
                 <div className="relative z-10 pb-20 md:pb-10">
                    {children}
                 </div>
            </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t border-white/10 bg-brand-onyx/95 px-2 pb-[env(safe-area-inset-bottom,1rem)] pt-3 shadow-2xl backdrop-blur-xl sm:px-6 md:hidden">
          <Link href="/dashboard" className="flex flex-1 flex-col items-center gap-1 p-2 text-zinc-500 transition-colors hover:text-zinc-50">
              <LayoutDashboard size={20} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Overview</span>
          </Link>
          <Link href="/dashboard/comments" className="flex flex-1 flex-col items-center gap-1 p-2 text-zinc-500 transition-colors hover:text-zinc-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
              <span className="text-[9px] font-bold uppercase tracking-wider">Chats</span>
          </Link>
          <Link href="/dashboard/create" className="relative flex flex-1 flex-col items-center gap-1 p-2 text-zinc-500 transition-colors hover:text-zinc-50">
              <div className="absolute -top-6 rounded-full bg-brand-cyan p-3 text-black shadow-lg">
                 <PackagePlus size={22} className="stroke-[2.5px]"/>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider mt-5">Deploy</span>
          </Link>
          <Link href="/dashboard/ads" className="flex flex-1 flex-col items-center gap-1 p-2 text-zinc-500 transition-colors hover:text-zinc-50">
              <Layers size={20} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Ads</span>
          </Link>
          <Link href="/dashboard/logs" className="flex flex-1 flex-col items-center gap-1 p-2 text-zinc-500 transition-colors hover:text-zinc-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span className="text-[9px] font-bold uppercase tracking-wider">Logs</span>
          </Link>
      </nav>

    </div>
  );
}
