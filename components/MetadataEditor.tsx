import React, { useState } from 'react';
import { AppListing } from '../types';
import { generateListingMetadata } from '../services/geminiService';
import { Sparkles, Loader2, Save } from 'lucide-react';

interface MetadataEditorProps {
  listing: AppListing;
  setListing: (listing: AppListing) => void;
}

const MetadataEditor: React.FC<MetadataEditorProps> = ({ listing, setListing }) => {
  const [tone, setTone] = useState('Professional & Exciting');
  const [keywordsInput, setKeywordsInput] = useState(listing.keywords.join(', '));
  const [isGenerating, setIsGenerating] = useState(false);
  const [reasoning, setReasoning] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setReasoning(null);
    try {
      const result = await generateListingMetadata(listing.appName, keywordsInput, tone);
      setListing({
        ...listing,
        appName: result.title, // Update title if Gemini optimizes it
        shortDescription: result.shortDescription,
        fullDescription: result.fullDescription,
        keywords: keywordsInput.split(',').map(k => k.trim()).filter(k => k)
      });
      setReasoning(result.reasoning);
    } catch (e) {
      alert("Failed to generate metadata. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="text-indigo-600" size={20} />
          AI Generator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Keywords (comma separated)</label>
            <input 
              type="text" 
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
              placeholder="e.g. fitness, workout, tracker"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Brand Tone</label>
            <select 
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
            >
              <option>Professional & Trustworthy</option>
              <option>Fun & Playful</option>
              <option>Minimalist & Modern</option>
              <option>Urgent & Sales-focused</option>
              <option>Technical & Detailed</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          {isGenerating ? 'Gemini is thinking...' : 'Generate Metadata'}
        </button>

        {reasoning && (
          <div className="mt-4 p-4 bg-indigo-50 text-indigo-800 rounded-lg text-sm border border-indigo-100">
            <strong>Why this works:</strong> {reasoning}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
             <label className="block text-sm font-medium text-slate-700">App Title</label>
             <span className={`text-xs ${listing.appName.length > 30 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>{listing.appName.length}/30</span>
          </div>
          <input 
            type="text" 
            value={listing.appName}
            onChange={(e) => setListing({...listing, appName: e.target.value})}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 outline-none font-medium"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
             <label className="block text-sm font-medium text-slate-700">Short Description</label>
             <span className={`text-xs ${listing.shortDescription.length > 80 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>{listing.shortDescription.length}/80</span>
          </div>
          <textarea 
            rows={2}
            value={listing.shortDescription}
            onChange={(e) => setListing({...listing, shortDescription: e.target.value})}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 outline-none resize-none"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
             <label className="block text-sm font-medium text-slate-700">Full Description</label>
             <span className={`text-xs ${listing.fullDescription.length > 4000 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>{listing.fullDescription.length}/4000</span>
          </div>
          <textarea 
            rows={15}
            value={listing.fullDescription}
            onChange={(e) => setListing({...listing, fullDescription: e.target.value})}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 outline-none font-mono text-sm leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

export default MetadataEditor;
