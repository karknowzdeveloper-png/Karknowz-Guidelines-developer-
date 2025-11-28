import React, { useState, useEffect } from 'react';
import { AppListing, AuditIssue } from '../types';
import { auditListing } from '../services/geminiService';
import { ShieldCheck, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface AuditReportProps {
  listing: AppListing;
}

const AuditReport: React.FC<AuditReportProps> = ({ listing }) => {
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const runAudit = async () => {
    setIsLoading(true);
    try {
      const results = await auditListing(listing);
      setIssues(results);
      setHasRun(true);
    } catch (e) {
      alert("Audit failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-run audit on first mount if data exists
  useEffect(() => {
    if (!hasRun && listing.appName && listing.shortDescription) {
      runAudit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" />
            Policy & ASO Audit
         </h2>
         <button 
           onClick={runAudit}
           disabled={isLoading}
           className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
         >
           {isLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
           Re-Run Audit
         </button>
      </div>

      {!hasRun && !isLoading && (
         <div className="text-center py-12 text-slate-500">
           Click "Re-Run Audit" to analyze your listing with Gemini.
         </div>
      )}

      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="animate-spin mb-3 text-emerald-600" size={32} />
          <p>Analyzing policy compliance and keyword density...</p>
        </div>
      )}

      {hasRun && !isLoading && issues.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center text-emerald-800">
          <CheckCircle className="mx-auto mb-3" size={48} />
          <h3 className="text-lg font-bold mb-1">Everything looks great!</h3>
          <p>No major policy violations or ASO issues detected.</p>
        </div>
      )}

      <div className="space-y-4">
        {issues.map((issue, idx) => (
          <div key={idx} className={`p-4 rounded-lg border flex gap-4 ${getSeverityColor(issue.severity)}`}>
            <div className="mt-1 flex-shrink-0">
               <AlertTriangle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/50 border border-black/5">
                  {issue.severity}
                </span>
                <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/50 border border-black/5">
                  {issue.field}
                </span>
              </div>
              <p className="font-semibold">{issue.message}</p>
              <p className="text-sm mt-1 opacity-90">Suggestion: {issue.suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditReport;
