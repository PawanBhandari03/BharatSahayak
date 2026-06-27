import { CheckCircle2, IndianRupee, Clock, ExternalLink, ShieldCheck, FileText } from 'lucide-react';

export default function Dashboard({ schemes, profile }) {
  const totalBenefit = schemes.reduce((acc, curr) => curr.amountType !== 'none' ? acc + (curr.amount || 0) : acc, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      {/* Summary Card */}
      <div className="glass rounded-3xl p-8 mb-10 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Hi {profile.name}, we found {schemes.length} schemes for you!</h2>
          <p className="text-purple-300">Based on your profile, you are eligible for the following government benefits.</p>
        </div>
        <div className="bg-purple-950/50 border border-purple-800 rounded-2xl p-6 text-center min-w-[200px]">
          <p className="text-sm text-purple-300 uppercase tracking-wider font-semibold mb-1">Total Potential Benefit</p>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 flex items-center justify-center gap-1">
            <IndianRupee className="w-8 h-8 text-green-400" />
            {totalBenefit.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      {schemes.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl">
           <p className="text-purple-300 text-lg">No schemes found matching your specific criteria at this moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map(scheme => (
            <div key={scheme.id} className="glass rounded-3xl p-6 flex flex-col hover:border-purple-500/50 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-900/40 text-green-300 border border-green-800/50">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {scheme.status === 'active' ? 'Active' : 'Upcoming'}
                </div>
                <div className="flex items-center gap-1 text-purple-300 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  {scheme.deadline === 'rolling' ? 'Rolling' : new Date(scheme.deadline).toLocaleDateString()}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{scheme.name}</h3>
              <p className="text-purple-200/70 text-sm mb-6 flex-grow line-clamp-3">{scheme.description}</p>
              
              <div className="bg-purple-950/40 rounded-xl p-4 mb-6">
                <div className="text-xs text-purple-400 mb-1 font-semibold uppercase">Benefit Amount</div>
                <div className="text-2xl font-bold text-white flex items-center gap-1">
                  {scheme.amount > 0 ? (
                    <>
                      <IndianRupee className="w-5 h-5 text-purple-300" />
                      {scheme.amount.toLocaleString('en-IN')}
                      <span className="text-sm font-normal text-purple-400">/{scheme.amountType === 'onetime' ? 'one-time' : scheme.amountType}</span>
                    </>
                  ) : (
                    <span className="text-lg text-purple-300">Non-Monetary Benefit</span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xs font-semibold text-purple-400 mb-2 flex items-center gap-1.5"><FileText className="w-4 h-4" /> Required Docs</div>
                <div className="flex flex-wrap gap-2">
                  {scheme.documentsRequired.slice(0, 3).map(doc => (
                    <span key={doc} className="text-xs px-2 py-1 rounded bg-purple-900/40 text-purple-200 border border-purple-800/50">{doc}</span>
                  ))}
                  {scheme.documentsRequired.length > 3 && <span className="text-xs px-2 py-1 rounded bg-purple-900/40 text-purple-200 border border-purple-800/50">+{scheme.documentsRequired.length - 3} more</span>}
                </div>
              </div>

              <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer" className="mt-auto w-full py-3.5 bg-white text-purple-950 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-purple-100 transition-colors">
                Apply Now <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
