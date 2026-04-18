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
        <h1 className="text-2xl md:text-3xl font-black text-gray-100 uppercase tracking-tight flex items-center gap-3">
            <Terminal className="text-brand-accent" size={28} /> Activity Logs
        </h1>
        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
          Sistem pemantauan rekaman aktivitas real-time
        </p>
      </div>

      <div className="flex-1 bg-brand-dark/50 border border-white/5 rounded-3xl overflow-hidden flex flex-col relative">
          <div className="absolute top-0 right-0 p-4">
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Logging Active</span>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 mt-8">
             <div className="space-y-4">
                 {logs.length === 0 ? (
                      <div className="text-center py-20 text-gray-500 text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-3">
                         <ShieldAlert size={32} className="opacity-20"/>
                         Log aktivitas kosong
                      </div>
                 ) : logs.map(log => (
                     <div key={log.id} className="flex gap-4 p-4 rounded-2xl bg-brand-onyx border border-white/5 hover:border-brand-accent/30 transition-colors group">
                        <div className="mt-1">
                           <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center border border-white/10 group-hover:border-brand-accent/50 group-hover:text-brand-accent transition-colors">
                              <Activity size={14} />
                           </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-md inline-block w-max">
                                    {log.action}
                                </span>
                                <span className="text-[9px] text-gray-500 flex items-center gap-1 uppercase tracking-wider font-bold">
                                    <Clock size={10}/> {formatDistanceToNow(new Date(log.createdAt), {addSuffix:true})}
                                </span>
                            </div>
                            <p className="text-sm text-gray-300 mb-1">{log.description}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                BY: <span className="text-gray-400">{log.userName}</span>
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
