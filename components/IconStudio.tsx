import React, { useState } from 'react';
import { AppListing } from '../types';
import { generateAppIcon } from '../services/geminiService';
import { Image as ImageIcon, Loader2, Download, RefreshCw } from 'lucide-react';

interface IconStudioProps {
  listing: AppListing;
  setListing: (listing: AppListing) => void;
}

const IconStudio: React.FC<IconStudioProps> = ({ listing, setListing }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Flat & Minimalist');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const description = prompt || listing.appName; // Fallback to app name if prompt is empty
      const imageUrl = await generateAppIcon(description, style);
      setListing({ ...listing, iconUrl: imageUrl });
    } catch (e) {
      alert("Failed to generate icon. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ImageIcon className="text-pink-600" size={20} />
            Icon Generator
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Icon Subject</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe the icon for ${listing.appName}...`}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none resize-none h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Art Style</label>
              <div className="grid grid-cols-2 gap-2">
                {['Flat & Minimalist', '3D Glossy', 'Gradient & Modern', 'Pixel Art', 'Hand Drawn', 'Neumorphism'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`px-3 py-2 text-sm rounded-md border transition-all text-left ${
                      style === s 
                        ? 'border-pink-500 bg-pink-50 text-pink-700 font-medium' 
                        : 'border-slate-200 hover:border-pink-300 text-slate-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-70"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
              {isGenerating ? 'Designing...' : 'Generate Icon'}
            </button>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm border border-blue-100">
          <strong>Tip:</strong> Google Play icons should be simple, distinctive, and avoid text. The generator creates a high-res concept you can use or refine.
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-slate-100 rounded-xl border border-slate-200 p-8">
        {listing.iconUrl ? (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="relative group">
              <img 
                src={listing.iconUrl} 
                alt="Generated Icon" 
                className="w-48 h-48 rounded-[22%] shadow-xl object-cover bg-white" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-[22%]" />
            </div>
            <div className="mt-8 flex gap-3">
               <a 
                href={listing.iconUrl} 
                download={`icon-${listing.appName}.png`}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm"
               >
                 <Download size={16} />
                 Download PNG
               </a>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400">
            <div className="w-48 h-48 rounded-[22%] border-2 border-dashed border-slate-300 flex items-center justify-center mb-4 mx-auto bg-slate-50">
              <ImageIcon size={48} className="opacity-20" />
            </div>
            <p>No icon generated yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IconStudio;
