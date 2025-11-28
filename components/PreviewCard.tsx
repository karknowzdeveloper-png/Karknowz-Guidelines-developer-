import React from 'react';
import { AppListing } from '../types';
import { Star, Download, MoreVertical, ArrowLeft, Search, Menu } from 'lucide-react';

interface PreviewCardProps {
  listing: AppListing;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ listing }) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white border-2 border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col h-[800px] relative">
      {/* Android Status Bar Mock */}
      <div className="bg-white px-6 py-3 flex justify-between items-center text-xs font-medium text-slate-500 z-10">
        <span>12:00</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-slate-300 rounded-sm"></div>
          <div className="w-4 h-4 bg-slate-300 rounded-sm"></div>
        </div>
      </div>

      {/* Play Store Header */}
      <div className="px-4 py-2 flex items-center gap-4 text-slate-700 z-10 sticky top-0 bg-white/95 backdrop-blur-sm">
        <ArrowLeft size={24} />
        <div className="flex-1"></div>
        <Search size={24} />
        <MoreVertical size={24} />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-8">
        {/* Header Section */}
        <div className="px-5 pt-2">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl shadow-md overflow-hidden bg-slate-100 flex-shrink-0">
               {listing.iconUrl ? (
                  <img src={listing.iconUrl} alt="Icon" className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs text-center p-1">
                    No Icon
                  </div>
               )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-xl font-semibold text-slate-900 leading-tight truncate">
                {listing.appName || 'App Name'}
              </h1>
              <p className="text-sm text-green-700 font-medium mt-1">
                Google Commerce Ltd
              </p>
              <p className="text-xs text-slate-500 mt-1 truncate">
                Contains ads • In-app purchases
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center mb-6 px-2">
            <div className="flex flex-col items-center gap-1">
              <span className="flex items-center gap-1 font-semibold text-sm">
                4.7 <Star size={10} fill="currentColor" />
              </span>
              <span className="text-xs text-slate-500">2K reviews</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
             <div className="flex flex-col items-center gap-1">
              <span className="font-semibold text-sm">500K+</span>
              <span className="text-xs text-slate-500">Downloads</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
             <div className="flex flex-col items-center gap-1">
              <span className="w-6 h-6 bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center rounded-sm">
                E
              </span>
              <span className="text-xs text-slate-500">Everyone</span>
            </div>
          </div>

          {/* Install Button */}
          <button className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-2.5 rounded-full transition-colors mb-6 shadow-sm">
            Install
          </button>

           {/* Screenshots Mock */}
           <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-32 h-56 bg-slate-100 rounded-lg flex-shrink-0 border border-slate-200"></div>
              ))}
           </div>
        </div>

        {/* About Section */}
        <div className="px-5 mt-2">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-slate-900">About this app</h2>
            <ArrowLeft className="rotate-180 text-slate-500" size={20} />
          </div>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">
             {listing.shortDescription || "This is a short description of the application to hook the user."}
          </p>
          
           {/* Tags */}
           <div className="flex flex-wrap gap-2 mb-6">
             {listing.keywords.slice(0, 3).map(k => (
               <span key={k} className="px-3 py-1 rounded-full border border-slate-300 text-xs text-slate-600">
                 {k}
               </span>
             ))}
           </div>

           <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
              {listing.fullDescription || "Full description goes here..."}
           </div>
        </div>
      </div>
      
       {/* Navigation Bar Mock */}
       <div className="border-t border-slate-100 px-6 py-3 flex justify-between items-center bg-white">
          <div className="w-6 h-6 rounded-full bg-slate-200"></div>
          <div className="w-6 h-6 rounded-full bg-slate-200"></div>
          <div className="w-6 h-6 rounded-full bg-slate-200"></div>
       </div>
    </div>
  );
};

export default PreviewCard;
