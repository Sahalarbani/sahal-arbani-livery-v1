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
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    // PARENT WRAPPER
    // Default flow so the whole page can scroll natively if needed on mobile, but on desktop we lock it to h-[calc(100vh-navbar)]
    <div className="flex flex-col md:flex-row w-full bg-brand-dark text-gray-100 font-sans min-h-screen md:h-[calc(100vh-80px)] overflow-hidden">
      
      {/* DESKTOP SIDEBAR SECTION */}
      <aside className="hidden md:flex flex-shrink-0 w-80 z-50 p-4 h-full">
        <div className="w-full h-full bg-brand-onyx border border-white/5 rounded-[32px] flex flex-col p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-accent/5 to-transparent pointer-events-none opacity-50"/>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-[10px] font-bold uppercase tracking-widest mb-1 group">
                        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Mainframe
                    </Link>
                    <h1 className="text-2xl font-black text-gray-100 leading-none">
                        ARB<span className="text-brand-accent">ADMIN</span>
                    </h1>
                </div>
            </div>

            <nav className="flex flex-col gap-3 flex-1 overflow-y-auto relative z-10">
                <Link href="/dashboard" className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-brand-dark/50 border border-white/5 text-gray-400 font-bold uppercase text-sm tracking-wide hover:bg-brand-dark hover:text-gray-200 transition-all hover:scale-[1.02]">
                    <LayoutDashboard size={18} />
                    <span>Overview</span>
                </Link>
                <Link href="/dashboard/create" className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-brand-dark/50 border border-white/5 text-gray-400 font-bold uppercase text-sm tracking-wide hover:bg-brand-dark hover:text-gray-200 transition-all hover:scale-[1.02]">
                    <PackagePlus size={18} />
                    <span>Deploy</span>
                </Link>
                <Link href="/dashboard/ads" className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-brand-dark/50 border border-white/5 text-gray-400 font-bold uppercase text-sm tracking-wide hover:bg-brand-dark hover:text-gray-200 transition-all hover:scale-[1.02]">
                    <Layers size={18} />
                    <span>Ads Manager</span>
                </Link>
                <Link href="/dashboard/comments" className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-brand-dark/50 border border-white/5 text-gray-400 font-bold uppercase text-sm tracking-wide hover:bg-brand-dark hover:text-gray-200 transition-all hover:scale-[1.02]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                    <span>Comments</span>
                </Link>
                <Link href="/dashboard/logs" className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-brand-dark/50 border border-white/5 text-gray-400 font-bold uppercase text-sm tracking-wide hover:bg-brand-dark hover:text-gray-200 transition-all hover:scale-[1.02]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    <span>Activity Logs</span>
                </Link>
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full border border-brand-accent/50 p-[1px]">
                         <div className="w-full h-full rounded-full bg-brand-dark overflow-hidden">
                            {session.user.image && <img src={session.user.image} alt="User" className="w-full h-full object-cover" />}
                         </div>
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-100 truncate max-w-[120px]">{session.user.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-brand-sage animate-pulse"/>
                           <p className="text-[9px] text-gray-500 uppercase tracking-widest font-medium">Level 5 Access</p>
                        </div>
                    </div>
                </div>
                
                <form action={async () => {
                    "use server"
                    await signOut({ redirectTo: '/' });
                }}>
                      <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest group border border-red-500/20">
                         <LogOut size={14} className="group-hover:-translate-x-1 transition-transform"/> Terminate Session
                      </button>
                </form>
            </div>
        </div>
      </aside>

      {/* MOBILE HEADER COMPACT */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-brand-dark border-b border-white/5 z-40 relative w-full shadow-md">
         <div>
            <h1 className="text-lg font-black text-gray-100 leading-none flex items-center gap-2">
                ARB<span className="text-brand-accent">ADMIN</span>
            </h1>
         </div>
         <div className="flex items-center gap-2">
             <div className="w-7 h-7 rounded-full border border-brand-accent/50 p-[1px]">
                 <div className="w-full h-full rounded-full bg-brand-dark overflow-hidden">
                    {session.user.image && <img src={session.user.image} alt="User" className="w-full h-full object-cover" />}
                 </div>
             </div>
         </div>
      </div>
      
      {/* MAIN CONTENT SECTION */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden p-2 pb-[100px] md:pb-0 md:p-4 md:pl-0 w-full">
        <div className="flex-1 bg-brand-dark/40 md:bg-brand-dark/40 border border-white/5 md:rounded-[40px] rounded-2xl relative overflow-hidden flex flex-col w-full h-full">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-10 w-full relative z-10">
                 <div className="absolute top-[-20%] right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-brand-accent/5 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" />
                 <div className="relative z-10 pb-20 md:pb-10">
                    {children}
                 </div>
            </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-brand-onyx border-t border-white/5 px-2 sm:px-6 pt-3 pb-[env(safe-area-inset-bottom,1rem)] flex items-center justify-between z-50 shadow-2xl backdrop-blur-xl bg-opacity-95">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-brand-accent transition-colors flex-1">
              <LayoutDashboard size={20} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Overview</span>
          </Link>
          <Link href="/dashboard/comments" className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-brand-accent transition-colors flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
              <span className="text-[9px] font-bold uppercase tracking-wider">Chats</span>
          </Link>
          <Link href="/dashboard/create" className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-brand-accent transition-colors relative flex-1">
              <div className="absolute -top-6 bg-brand-accent text-brand-dark p-3 rounded-full shadow-[0_0_20px_rgba(205,255,100,0.3)]">
                 <PackagePlus size={22} className="stroke-[2.5px]"/>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider mt-5">Deploy</span>
          </Link>
          <Link href="/dashboard/ads" className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-brand-accent transition-colors flex-1">
              <Layers size={20} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Ads</span>
          </Link>
          <Link href="/dashboard/logs" className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-brand-accent transition-colors flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span className="text-[9px] font-bold uppercase tracking-wider">Logs</span>
          </Link>
      </nav>

    </div>
  );
}
