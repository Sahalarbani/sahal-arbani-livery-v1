import { getLogsAction } from "@/app/lib/admin-actions";
import { Activity, Terminal, Clock, ShieldAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LogsPage() {
  const logs = await getLogsAction();

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-80px)]">
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-2xl font-black uppercase tracking-tight text-zinc-950 md:text-3xl">
            <Terminal className="text-brand-accent" size={28} /> Activity Logs
        </h1>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 md:text-xs">
          Sistem pemantauan rekaman aktivitas real-time
        </p>
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white">
          <div className="absolute top-0 right-0 p-4">
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Logging Active</span>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 mt-8">
             <div className="space-y-4">
                 {logs.length === 0 ? (
                      <div className="flex flex-col items-center gap-3 py-20 text-center text-xs font-bold uppercase tracking-widest text-zinc-500">
                         <ShieldAlert size={32} className="opacity-20"/>
                         Log aktivitas kosong
                      </div>
                 ) : logs.map(log => (
                     <div key={log.id} className="group flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-950">
                        <div className="mt-1">
                           <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 transition-colors group-hover:border-brand-accent/50 group-hover:text-brand-accent">
                              <Activity size={14} />
                           </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-md inline-block w-max">
                                    {log.action}
                                </span>
                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                                    <Clock size={10}/> {formatDistanceToNow(new Date(log.createdAt), {addSuffix:true})}
                                </span>
                            </div>
                            <p className="mb-1 text-sm text-zinc-700">{log.description}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                BY: <span className="text-zinc-700">{log.userName}</span>
                            </p>
                        </div>
                     </div>
                 ))}
             </div>
          </div>
      </div>
    </div>
  );
}
